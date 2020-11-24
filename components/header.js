import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';

const Header = ({ siteTitle }) => (
  <Navbar variant="dark" bg="dark" expand="lg">
    <Container>
      <Navbar.Brand style={{ fontSize: '2em' }}>
        <Link href="/">{siteTitle}</Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Link href="/" className="" passHref>
            <Nav.Link active>Current Forecasts</Nav.Link>
          </Link>
          <Link href="/model_errors" className="" passHref>
            <Nav.Link active>Model Performance</Nav.Link>
          </Link>
          <Link href="/prediction_error" className="" passHref>
            <Nav.Link active>Historical Forecasts</Nav.Link>
          </Link>
          <Link href="/about" className="" passHref>
            <Nav.Link active>About</Nav.Link>
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
