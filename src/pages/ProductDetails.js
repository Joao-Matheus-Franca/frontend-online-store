import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getProductById } from '../services/api';
import Form from '../components/Form';
import ReviewCard from '../components/ReviewCard';

class ProductDetails extends React.Component {
  state = {
    product: '',
    reviews: [],
    cartItens: 0,
  };

  async componentDidMount() {
    const { match } = this.props;
    const { params } = match;
    const { id } = params;
    const product = await getProductById(id);
    this.setState({ product });

    const cartItens = JSON.parse(localStorage.getItem('cartItems'));
    if (cartItens !== null) {
      this.setState({ cartItens: cartItens.length });
    }

    const reviews = JSON.parse(localStorage.getItem(id));
    if (reviews) {
      this.setState({ reviews });
    }
  }

  addCart = () => {
    const { product } = this.state;
    const lastCart = JSON.parse(localStorage.getItem('cartItems'));
    if (lastCart === null) {
      const saved = product;
      const initial = [saved];
      this.setState({ cartItens: initial.length });
      localStorage.setItem('cartItems', JSON.stringify(initial));
    } else {
      const saved = product;
      const items = [...lastCart, saved];
      this.setState({ cartItens: items.length });
      localStorage.setItem('cartItems', JSON.stringify(items));
    }
  };

  render() {
    const { product, reviews, cartItens } = this.state;
    return (
      <div>
        <h1 data-testid="product-detail-name">
          { product.title }
        </h1>
        <img
          data-testid="product-detail-image"
          src={ product.thumbnail }
          alt={ product.title }
        />
        <h2
          data-testid="product-detail-price"
        >
          { product.price }
        </h2>
        <button
          data-testid="product-detail-add-to-cart"
          type="button"
          onClick={ this.addCart }
        >
          Adicionar ao Carrinho
        </button>
        <Link to="/ShoppingCart">
          <button
            type="button"
            data-testid="shopping-cart-button"
          >
            Carrinho
          </button>
          <p data-testid="shopping-cart-size">{cartItens}</p>
        </Link>
        <Form id={ product.id } />
        {reviews.map((e, i) => (
          <ReviewCard
            key={ i }
            email={ e.email }
            text={ e.text }
            rating={ e.rating }
          />))}
      </div>
    );
  }
}

ProductDetails.propTypes = {
  match: PropTypes.shape({ params: PropTypes.shape({ id: PropTypes.string }) }),
}.isRequired;

export default ProductDetails;
