import React, { Component } from "react";
import { Link } from "@reach/router";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import "./ProfilePane.css";

// This identifies your web application to Google's authentication service
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

/**
 * The navigation bar at the top of all pages. Takes no props.
 */
class NavBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    var editButton = ""
    if (this.props.editable) {
      editButton = <button onClick={ this.editProfile }>Edit Profile</button>
    }

    return (
      <div className="ProfilePane-container">
        { editButton }
        <img src={ this.props.user.profile_pic }/>
        <h1>{ this.props.user.name }</h1>
        <h3>{ this.props.user.description }</h3>
      </div>
    );
  }
}

export default NavBar;
