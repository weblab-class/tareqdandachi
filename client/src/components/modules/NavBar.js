import React, { Component } from "react";
import { Link } from "@reach/router";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import NavigationLink from "./NavigationLink.js";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faChessKnight, faTachometerAlt, faUserCircle, faUserGraduate } from '@fortawesome/free-solid-svg-icons'

import "./NavBar.css";
import Logo from "../logo.svg"

import { get, post } from "../../utilities";

// This identifies your web application to Google's authentication service
const GOOGLE_CLIENT_ID = "117624971444-gmdmhm8712dc3hriss8spnt1vgvmeqkn.apps.googleusercontent.com";

/**
 * The navigation bar at the top of all pages. Takes no props.
 */
class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {pathname: window.location.pathname, name: "Loading..." }
  }

  componentDidMount() {
    console.log(this.props.userId)
    get(`/api/user`, { userId: this.props.userId }).then((user) => this.setState({ name: user.name }))
  }

  componentDidUpdate(oldProps) {
    if (oldProps.pathname !== this.props.pathname) {
      console.log(this.props.pathname)
    }
    if (oldProps.userId != this.props.userId) {
      get(`/api/user`, { userId: this.props.userId }).then((user) => this.setState({ name: user.name }))
    }
  }

  updatePath = () => this.setState({ pathname: window.location.pathname });

  render() {
    return (
      <nav className="NavBar-container" onClick={() => this.updatePath()}>
        <div onClick={() => location.href='/qupong'} className="NavBar-title u-inlineBlock"><img src={Logo} className="NavBar-Logo"/> QuPong</div>
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
          {this.props.userId ? (
            <NavigationLink to={`/profile`} className="NavBar-link NavBar-login" pathname={this.state.pathname}>
              <FontAwesomeIcon icon={faUserCircle} className="icon"/> {this.state.name}
            </NavigationLink>
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
