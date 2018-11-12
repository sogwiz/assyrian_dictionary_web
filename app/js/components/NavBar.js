import React from 'react'
import Parse from 'parse'
import { Link } from 'react-router'

class NavBar extends React.Component {

  onLogout() {
    Parse.User.logOut()
    this.props.history.replace('/login')
  }

  render() {
    return (
      <div id='navbar'>
        <a href='/'
          >
          Home
        </a>
        <a href='https://groups.google.com/forum/#!forum/assyrian-app-dictionary'
          target='_blank'>
          Feedback
        </a>
        <Link to="/about">About</Link>
        {this.renderLogout()}
      </div>
    )
  }

  renderLogout() {
    if (!Parse.User.current()) { return false }
    return (
      <Link to='/' onClick={this.onLogout.bind(this)}>
        Logout
      </Link>
    )
  }
}

export default NavBar
