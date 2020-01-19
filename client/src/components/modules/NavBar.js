import React, { Component } from "react";
import { Link } from "@reach/router";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import NavigationLink from "./NavigationLink.js";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faChessKnight, faTachometerAlt, faUser, faUserGraduate, faSearch } from '@fortawesome/free-solid-svg-icons'

import "./NavBar.css";
import Logo from "../logo.svg"

// This identifies your web application to Google's authentication service
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

/**
 * The navigation bar at the top of all pages. Takes no props.
 */
class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {pathname: window.location.pathname}
  }

  componentDidUpdate(oldProps) {
    if (oldProps.pathname !== this.props.pathname) {
      console.log(this.props.pathname)
    }
  }

  updatePath = () => console.log(window.location.pathname)//this.setState({ pathname: window.location.pathname });

  render() {
    return (
      <nav className="NavBar-container">
        <div className="NavBar-title u-inlineBlock"><img src={Logo} className="NavBar-Logo"/> QuPong</div>
          {this.props.userId && (
            <NavigationLink to={`/`} className="NavBar-link" pathname={this.state.pathname}>
              <FontAwesomeIcon icon={faTachometerAlt} className="icon"/> Dashboard
            </NavigationLink>
          )}
          <NavigationLink to="/leaderboard" className="NavBar-link" pathname={this.state.pathname}>
            <FontAwesomeIcon icon={faStar} className="icon"/> Leaderboards
          </NavigationLink>
          <NavigationLink to="/game" className="NavBar-link" pathname={this.state.pathname}>
            <FontAwesomeIcon icon={faChessKnight} className="icon"/> Play Game
          </NavigationLink>
          <NavigationLink to="/learn" className="NavBar-link" pathname={this.state.pathname}>
            <FontAwesomeIcon icon={faUserGraduate} className="icon"/> Learn Quantum
          </NavigationLink>
          <NavigationLink to="/search" className="NavBar-link" pathname={this.state.pathname}>
            <FontAwesomeIcon icon={faSearch} className="icon"/> Search
          </NavigationLink>
          {this.props.userId && (
            <NavigationLink to={`/profile`} className="NavBar-link" pathname={this.state.pathname}>
              <FontAwesomeIcon icon={faUser} className="icon"/> Profile
            </NavigationLink>
          )}
          {this.props.userId ? (
            <GoogleLogout
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Logout"
              onLogoutSuccess={this.props.handleLogout}
              onFailure={(err) => console.log(err)}
              className="NavBar-link NavBar-login"
            />
          ) : (
            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Login"
              onSuccess={this.props.handleLogin}
              onFailure={(err) => console.log(err)}
              className="NavBar-link NavBar-login"
            />
          )}
      </nav>
    );
  }
}

export default NavBar;
