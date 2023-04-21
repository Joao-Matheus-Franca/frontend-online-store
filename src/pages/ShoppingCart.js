import React from 'react';
import { Link } from 'react-router-dom';

class ShoppingCart extends React.Component {
  state = {
    products: [],
    renderProducts: [],
  };

  // Lógica ajustada com auxilio do seguinte link:
  // https://dev.to/soyleninjs/3-ways-to-remove-duplicates-in-an-array-in-javascript-259o
  componentDidMount() {
    this.limitProducts();
  }

  limitProducts = () => {
    const products = JSON.parse(localStorage.getItem('cartItems'));
    if (products !== null) {
      const result = [];
      products.forEach((element) => {
        result.push(JSON.stringify(element));
      });
      const final = result.filter((r, i) => result.indexOf(r) === i);
      const finalResult = [];
      final.forEach((element) => {
        finalResult.push(JSON.parse(element));
      });
      this.setState({ products, renderProducts: finalResult });
    }
  };

  sumProduct = (event) => {
    const { products } = this.state;
    const { target: { id } } = event;
    const handleProduct = products.find((p) => p.id === id);
    const productQuantity = products.filter((p) => p.id === id).length;
    if (productQuantity < handleProduct.available_quantity) {
      const lastCart = JSON.parse(localStorage.getItem('cartItems'));
      const items = [...lastCart, handleProduct];
      localStorage.setItem('cartItems', JSON.stringify(items));
      this.setState({ products: items });
    }
  };

  subProduct = (event) => {
    const { products } = this.state;
    const { target: { id } } = event;
    const lastCart = JSON.parse(localStorage.getItem('cartItems'));
    const quantityProduct = lastCart.filter((q) => q.id === id);
    if (quantityProduct.length > 1) {
      const handleProduct = products.find((p) => p.id === id);
      const index = products.indexOf(handleProduct);
      const items = lastCart.filter((l, i, a) => a.indexOf(l) !== index);
      localStorage.setItem('cartItems', JSON.stringify(items));
      this.setState({ products: items });
    }
  };

  removeProduct = (event) => {
    const { target: { id } } = event;
    const lastCart = JSON.parse(localStorage.getItem('cartItems'));
    const items = lastCart.filter((l) => l.id !== id);
    localStorage.setItem('cartItems', JSON.stringify(items));
    this.limitProducts();
    this.setState({ products: items });
  };

  render() {
    const { products, renderProducts } = this.state;
    return (
      <div>
        {products.length === 0 ? (
          <p data-testid="shopping-cart-empty-message">Seu carrinho está vazio</p>)
          : renderProducts.map((p) => (
            <div key={ p.id }>
              <h4 data-testid="shopping-cart-product-name">{p.title}</h4>
              <h4>{p.price}</h4>
              <p data-testid="shopping-cart-product-quantity">
                {products.filter((pr) => pr.id === p.id).length}
              </p>
              <button
                id={ p.id }
                type="button"
                onClick={ this.sumProduct }
                data-testid="product-increase-quantity"
              >
                +
              </button>
              <button
                id={ p.id }
                type="button"
                onClick={ this.subProduct }
                data-testid="product-decrease-quantity"
              >
                -
              </button>
              <button
                id={ p.id }
                type="button"
                onClick={ this.removeProduct }
                data-testid="remove-product"
              >
                Remover
              </button>
            </div>
          ))}
        <Link to="/Checkout">
          <button
            type="button"
            data-testid="checkout-products"
          >
            Finalizar compra
          </button>
        </Link>
      </div>
    );
  }
}

export default ShoppingCart;
