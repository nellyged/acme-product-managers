import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { updateProduct } from './store';

const mapStateToProps = state => {
  return { managers: state.managers.sort((a, b) => a.id - b.id) };
};

const mapDispatchToProps = dispatch => {
  return {
    saveProduct: (prodId, managerId) =>
      dispatch(updateProduct(prodId, managerId)),
  };
};

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      managerId: this.props.product.managerId
        ? this.props.product.managerId
        : '',
    };
  }
  onChange = ev => {
    this.setState({
      [ev.target.name]: ev.target.value === '' ? '' : ev.target.value * 1,
    });
  };
  render() {
    const { managers, product, saveProduct } = this.props;
    const { managerId } = this.state;
    const { onChange } = this;
    return (
      <Fragment>
        <div className="form-group">
          <label>
            <em>Product Manager</em>
          </label>
          <select
            name="managerId"
            className="form-control"
            value={managerId}
            onChange={onChange}
          >
            <option value="">-- none --</option>
            {managers.map(manager => (
              <option key={manager.id} value={manager.id}>
                {manager.name}
              </option>
            ))}
          </select>
        </div>
        <button
          disabled={
            product.managerId === managerId ||
            (!product.managerId && managerId === '')
              ? true
              : false
          }
          className="btn btn-primary"
          onClick={() => saveProduct(product.id, managerId)}
        >
          Save
        </button>
      </Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Product);
