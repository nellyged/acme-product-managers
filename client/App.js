import React, { Component } from 'react';
import { connect } from 'react-redux';
import Nav from './Nav';
import Products from './Products';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { fetchProducts, fetchManagers, usersWithProducts } from './store';

const mapDispatchToProps = dispatch => {
  return {
    getProducts: () => dispatch(fetchProducts()),
    getManagers: () => dispatch(fetchManagers()),
  };
};

const mapStateToProps = state => {
  return { managers: usersWithProducts(state), products: state.products };
};

class App extends Component {
  componentDidMount() {
    const { getProducts, getManagers } = this.props;
    getProducts();
    getManagers();
  }
  render() {
    const { managers, products } = this.props;
    return (
      <Router>
        <h1>Acme Product Managers</h1>
        <Route component={Nav} />
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <div>{`We ${
                managers.count === products.length
                  ? 'DONT have'
                  : `DO have ${products.length - managers.count}`
              } openings for Product Managers!`}</div>
            )}
          />
          <Route path="/products" component={Products} />
          <Route
            path="/users"
            render={() => (
              <ul>
                {managers.users.map(manager => (
                  <li key={manager.id}>{manager.name}</li>
                ))}
              </ul>
            )}
          />
        </Switch>
      </Router>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
