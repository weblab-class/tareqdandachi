import React, { Component } from "react";
import { Link } from "@reach/router";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import MinimalButton from "../modules/MinimalButton.js"

import "./ProfilePane.css";

// This identifies your web application to Google's authentication service
const GOOGLE_CLIENT_ID = "117624971444-gmdmhm8712dc3hriss8spnt1vgvmeqkn.apps.googleusercontent.com";

/**
 * The navigation bar at the top of all pages. Takes no props.
 */
class ProfilePane extends Component {
  constructor(props) {
    super(props);

    this.state = {skill: "beginner"}
  }

  componentDidMount = () => {
    this.setState({skill: (this.props.user.skill=="expert" || (this.props.circuit_count > 6)) ? "expert" : "beginner"});
  }

  editProfile = () => { location.href='/profile/edit' }

  render() {

    var editButton = ""
    if (this.props.editable) {
      editButton = (
        <>
          <MinimalButton onClick={ this.editProfile } color="blue">Edit Profile</MinimalButton>
          <MinimalButton onClick={ this.props.handleLogout } color="red">Log Out</MinimalButton>
        </>
      )
    }

    let allowClickClass = ""

    if (this.props.onClick) {
      allowClickClass = " interactive"
    }

    return (
      <div className={"ProfilePane-container" + allowClickClass} onClick={this.props.onClick}>
        <img src={ this.props.user.profile_pic }/>
        <div className="ProfilePane-text">
          <h1>{ this.props.user.name }</h1>
          <h3>{ this.props.user.description }</h3>
          {(this.props.circuit_count !== false) && (<><span className={"label "+this.state.skill}>{ this.state.skill }</span><br /></>)}
          { editButton }
        </div>
      </div>
    );
  }
}

export default ProfilePane;
