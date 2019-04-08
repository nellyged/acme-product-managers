import React from 'react';
import Product from './Product';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return {
    products: state.products.sort((a, b) => a.id - b.id),
  };
};

const Products = props => {
  const { products } = props;
  return (
    <ul className="list-group">
      {products.map(product => (
        <li key={product.id} className="list-group-item">
          <div>
            <h6>{product.name}</h6>
            <Product product={product} />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default connect(mapStateToProps)(Products);
