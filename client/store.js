import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';

const initialState = {
  products: [],
  managers: [],
};

const SET_PRODUCTS = 'SET_PRODUCTS';
const SET_MANAGERS = 'SET_MANAGERS';

const setProducts = products => ({
  type: SET_PRODUCTS,
  products,
});

const setManagers = managers => ({
  type: SET_MANAGERS,
  managers,
});

const fetchProducts = () => {
  return dispatch => {
    return axios
      .get('/api/products')
      .then(response => response.data)
      .then(products => dispatch(setProducts(products)));
  };
};

const fetchManagers = () => {
  return dispatch => {
    return axios
      .get('/api/users')
      .then(response => response.data)
      .then(managers => dispatch(setManagers(managers)));
  };
};

const updateProduct = (prodId, managerId) => {
  return dispatch => {
    return axios
      .put(`/api/products/${prodId}`, {
        managerId: managerId === '' ? null : managerId,
      })
      .then(() => dispatch(fetchProducts()));
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return { ...state, products: action.products };
    case SET_MANAGERS:
      return { ...state, managers: action.managers };
    default:
      return state;
  }
};

const usersWithProducts = state => {
  return {
    count: state.products.reduce((acc, product) => {
      if (product.managerId) acc.push(product.managerId);
      return acc;
    }, []).length,
    users: state.managers.filter(manager =>
      state.products
        .reduce((acc, product) => {
          if (product.managerId) acc.push(product.managerId);
          return acc;
        }, [])
        .includes(manager.id)
    ),
  };
};

const store = createStore(reducer, applyMiddleware(thunk));

export {
  store,
  fetchProducts,
  fetchManagers,
  updateProduct,
  usersWithProducts,
};
