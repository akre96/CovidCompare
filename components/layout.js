import React from "react"
import PropTypes from "prop-types"

import Header from "./header"


const Layout = ({ children }) => {
  return (
    <>
      <Header siteTitle={`COVID Compare`} />
      <br></br>
      <div className='container'>
        <main>{children}</main>
      <footer className="row" style={{
          marginTop: `2rem`
        }}>
        © {new Date().getFullYear()} Joseph Friedman, Patrick Liu, Samir Akre
      </footer>
      </div>

    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
