import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { usersWithProducts } from './store';

const mapStateToProps = state => {
  return { managers: usersWithProducts(state) };
};

const Nav = props => {
  const {
    managers,
    location: { pathname },
  } = props;
  const tabs = [
    { title: 'Home', path: '/' },
    { title: 'Products', path: '/products' },
    { title: `Managers (${managers.users.length})`, path: '/users' },
  ];
  return (
    <ul className="nav nav-pills" style={{ marginBottom: '20px' }}>
      {tabs.map(tab => (
        <li key={tab.title} className="nav-item">
          <Link
            to={tab.path}
            className={`nav-link ${tab.path === pathname ? 'active' : ''}`}
          >
            {tab.title}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default connect(mapStateToProps)(Nav);
