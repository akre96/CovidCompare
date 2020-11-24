import React from 'react';
import PropTypes from 'prop-types';

import Header from './header';

const Layout = ({ children }) => {
  return (
    <>
      <Header siteTitle={`covidcompare`} />
      <br></br>
      <div className="container">
        <main>{children}</main>
      </div>
        <footer
          className="row"
          style={{
            marginTop: `2rem`,
          }}
        >
          <div className="container">
          © {new Date().getFullYear()} Joseph Friedman, Patrick Liu, Samir Akre
          </div>
        </footer>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
