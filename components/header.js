import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';

const Header = ({ siteTitle }) => (
  <Navbar variant="dark" bg="dark" expand="md">
    <Container>
      <Navbar.Brand style={{ fontSize: '2em' }}>
        <Link href="/">{siteTitle}</Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Link href="/" className="" passHref>
            <Nav.Link>Current Forecast</Nav.Link>
          </Link>
          <Link href="/model_errors" className="" passHref>
            <Nav.Link>Model Errors</Nav.Link>
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
