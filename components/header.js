import Link from "next/link"
import PropTypes from "prop-types"
import React from "react"

const Header = ({ siteTitle }) => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <div className='container'>
        <Link
          href="/"
        >
            <a
                className="navbar-brand"
                style={{fontSize: "2em"}}
            >
                {siteTitle}
            </a>
        </Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
      </button>

      <div className="navbar-collapse collapse" id="navbarSupportedContent">
        <ul className="navbar nav mr-auto">
          <li className="nav-item">
            <Link href="/" className="nav-link">
                <a className="nav-link">
                    Current Forecast
                </a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/model-errors" className="nav-link">
                <a className="nav-link">
                    Model Errors
                </a>
            </Link>
          </li>

        </ul>
      </div>
    </div>
  </nav>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
