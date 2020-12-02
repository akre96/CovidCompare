import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Image from 'next/image';
import Nav from 'react-bootstrap/Nav';

const Header = ({ siteTitle }) => (
  <Navbar variant="light" bg="light" expand="lg">
    <div className="container-lg">
      <Navbar.Brand className={'brand-text'} style={{ fontSize: '2em' }}>
        <Link href="/">
          <Image height={100} width={100} src="/logo.png" />
        </Link>
        <span>covidcompare.io</span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Link href="/" className="" passHref>
            <Nav.Link active>Current Forecasts</Nav.Link>
          </Link>
          <Link href="/model_performance" className="" passHref>
            <Nav.Link active>Model Performance</Nav.Link>
          </Link>
          <Link href="/historical_forecasts" className="" passHref>
            <Nav.Link active>Historical Forecasts</Nav.Link>
          </Link>
          <Link href="/about" className="" passHref>
            <Nav.Link active>About</Nav.Link>
          </Link>
        </Nav>
      </Navbar.Collapse>
    </div>
  </Navbar>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
