import React from 'react';
import Button from '../components/Button';
import { getCategories, getProductsFromCategoryAndQuery } from '../services/api';
import Categories from '../components/Categories';
import ProductCard from '../components/ProductCard';

class Search extends React.Component {
  state = {
    btn: [],
    search: '',
    categories: [],
    products: [],
  };

  async componentDidMount() {
    const categories = await getCategories();
    this.setState({ categories });
    const cartItens = JSON.parse(localStorage.getItem('cartItems'));
    if (cartItens !== null) {
      this.setState({ btn: cartItens });
    }
  }

  handleChange = (event) => {
    const { target } = event;
    const { name, type } = target;
    const value = type === 'checkbox' ? target.checked : target.value;
    this.setState(
      { [name]: value },
    );
  };

  handleClick = async () => {
    const { search, categories } = this.state;
    const categoryId = categories.find((c) => c.name === search);
    if (categoryId) {
      const products = await getProductsFromCategoryAndQuery(categoryId.id, undefined);
      this.setState({ products: products.results });
    } else {
      const products = await getProductsFromCategoryAndQuery(undefined, search);
      this.setState({ products: products.results });
    }
  };

  handleCategories = async (event) => {
    const { target: { id } } = event;
    const data = await getProductsFromCategoryAndQuery(id);
    this.setState({ products: data.results });
  };

  addCart = (event) => {
    const { target: { id } } = event;
    const { products } = this.state;
    const lastCart = JSON.parse(localStorage.getItem('cartItems'));
    if (lastCart === null) {
      const product = products.find((p) => p.title === id);
      const saved = product;
      const initial = [saved];
      this.setState({ btn: initial });
      localStorage.setItem('cartItems', JSON.stringify(initial));
    } else {
      const product = products.find((p) => p.title === id);
      const saved = product;
      const items = [...lastCart, saved];
      this.setState({ btn: items });
      localStorage.setItem('cartItems', JSON.stringify(items));
    }
  };

  render() {
    const { search, btn } = this.state;
    const { categories, products } = this.state;
    return (
      <>
        <Button produtosDoCarrinho={ btn } />
        <label htmlFor="search">
          <input
            data-testid="query-input"
            id="search"
            name="search"
            onChange={ this.handleChange }
            value={ search }
          />
        </label>
        <button
          data-testid="query-button"
          type="button"
          onClick={ this.handleClick }
        >
          Pesquisar
        </button>
        <span data-testid="home-initial-message">
          Digite algum termo de pesquisa ou escolha uma categoria.
        </span>
        <span>
          {categories.map((category) => (
            <Categories
              key={ category.id }
              value={ category.name }
              id={ category.id }
              onClick={ this.handleCategories }
            />))}
        </span>
        {products.length === 0 ? <h2>Nenhum produto foi encontrado</h2>
          : products.map((p) => (
            <>
              <ProductCard
                key={ p.id }
                title={ p.title }
                price={ p.price }
                thumbnail={ p.thumbnail }
                onClick={ this.addCart }
                id={ p.id }
              />
              { p.shipping.free_shipping && (
                <p data-testid="free-shipping">Frete grátis</p>)}
            </>))}
      </>
    );
  }
}

export default Search;
