import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getProductById } from '../services/api';

class ProductDetails extends React.Component {
  state = {
    product: '',
  };

  async componentDidMount() {
    const { match } = this.props;
    const { params } = match;
    const { id } = params;
    const product = await getProductById(id);
    this.setState({ product });
  }

  addCart = () => {
    const { product } = this.state;
    const lastCart = JSON.parse(localStorage.getItem('cartItems'));
    if (lastCart === null) {
      const saved = product;
      const initial = [saved];
      localStorage.setItem('cartItems', JSON.stringify(initial));
    } else {
      const saved = product;
      const items = [...lastCart, saved];
      localStorage.setItem('cartItems', JSON.stringify(items));
    }
  };

  render() {
    const { product } = this.state;
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
        </Link>
      </div>
    );
  }
}

ProductDetails.propTypes = {
  match: PropTypes.shape({ params: PropTypes.shape({ id: PropTypes.string }) }),
}.isRequired;

export default ProductDetails;
