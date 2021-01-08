/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import PropTypes from 'prop-types';
import { FaGithub } from 'react-icons/fa';
import Head from 'next/head';

import Header from './header';

const Layout = ({ children, pageName, pageDescription }) => (
  <>
    <Head>
      <title>{pageName || 'covidcompare.io'}</title>
      <meta
        property="description"
        content={
          pageDescription ||
          'Compare predicted trajectories in COVID-19 mortality from major, global models'
        }
      />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="google-site-verification" content="SKZ5pm_1GXtoaohhKeTG-o_47_XTMSmW3gbqfA-w7kY" />
      <meta charSet="UTF-8" />
      <meta property="og:url" content="https://covidcompare.io" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="covidcompare.io" />
      <meta
        property="og:description"
        content="Compare predicted trajectories in COVID-19 mortality from major, global models"
      />
      <meta property="og:image" content="https://covidcompare.io/logo.png" />
      <script
        async
        defer
        data-domain="covidcompare.io"
        src="https://plausible.io/js/plausible.js"
      />
    </Head>
    <Header siteTitle="covidcompare.io" />
    <br />
    <div className="container">
      <main>{children}</main>
    </div>
    <div className="container">
      <footer
        className="row"
        style={{
          marginTop: '2rem',
        }}
      >
        <p style={{ textAlign: 'center', width: '100%' }}>
          <a href="https://forms.gle/CJ1b2L5iXqsJD28k7" target="_blank" rel="noreferrer">
            <button type="button" className="btn btn-primary">
              Give Feedback
            </button>
          </a>
        </p>
        <p style={{ textAlign: 'center', width: '100%' }}>
          © {new Date().getFullYear()} Joseph Friedman, Patrick Liu, Samir Akre
        </p>
        <p style={{ textAlign: 'center', width: '100%' }}>
          <a
            style={{ color: 'gray' }}
            href="https://github.com/pyliu47/covidcompare"
            target="_blank"
            rel="noreferrer"
          >
            <FaGithub fontSize="1.5rem" style={{ marginRight: '5px', marginTop: '-5px' }} />
            Analysis Code
          </a>
          {' | '}
          <a
            style={{ color: 'gray' }}
            href="https://github.com/akre96/CovidCompare"
            target="_blank"
            rel="noreferrer"
          >
            <FaGithub fontSize="1.5rem" style={{ marginRight: '5px', marginTop: '-5px' }} />
            Website Code
          </a>
        </p>
      </footer>
    </div>
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  pageName: PropTypes.string,
  pageDescription: PropTypes.string,
};
Layout.defaultProps = {
  pageName: 'covidcompare.io',
  pageDescription: 'Compare predicted trajectories in COVID-19 mortality from major, global models',
};

export default Layout;
