import React from 'react';
import PropTypes from 'prop-types';
import { FaGithub } from 'react-icons/fa';

import Header from './header';

const Layout = ({ children }) => {
  return (
    <>
      <Header siteTitle={`covidcompare`} />
      <br></br>
      <div className="container-lg">
        <main>{children}</main>
      </div>
      <footer
        className="row"
        style={{
          marginTop: `2rem`,
        }}
      >
        <div className="container-lg">
          <p style={{ textAlign: 'center' }}>
            © {new Date().getFullYear()} Joseph Friedman, Patrick Liu, Samir Akre
          </p>
          <p style={{ textAlign: 'center' }}>
            <a
              style={{ color: 'gray' }}
              href="https://github.com/pyliu47/covidcompare"
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub fontSize={'1.5rem'} style={{marginRight: '5px', marginTop: '-5px'}}/>
              Analysis Code 
            </a>
          </p>
          <p style={{ textAlign: 'center' }}>
            <a
              style={{ color: 'gray' }}
              href="https://github.com/akre96/CovidCompare"
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub fontSize={'1.5rem'} style={{marginRight: '5px', marginTop: '-5px'}}/>
              Website Code 
            </a>
          </p>
        </div>
      </footer>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
