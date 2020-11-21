import Link from "next/link"
import PropTypes from "prop-types"
import React from "react"

import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'

const Header = ({ siteTitle }) => (
  <Navbar variant="dark" bg="dark" expand="md">
    <Container>
      <Navbar.Brand style={{fontSize: "2em"}}>
        <Link
          href="/"
        >
          {siteTitle}
        </Link>
        </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link>
              <Link href="/" className="nav-link">
                  Current Forecast
              </Link>
          </Nav.Link>
          <Nav.Link href="/model_errors">
            <Link href="/model_errors" className="nav-link">
                    Model Errors
            </Link>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
