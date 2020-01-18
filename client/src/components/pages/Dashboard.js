import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import "../../utilities.css";
import "./Dashboard.css";

import { get, post } from "../../utilities";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      user: undefined,
      algos: 0,
    };
  }

  getUserData = () => {
    console.log("WOOPS", this.props.userId)
    get(`/api/user`, { userId: this.props.userId }).then((user) => this.setState({ user: user }));
  };

  componentDidMount() {
    document.title = "Your Dashboard";
    this.getUserData();
  }

  componentDidUpdate(oldProps) {
    if (oldProps.userId !== this.props.userId) {
      this.getUserData();
    }
  }

  render() {
    if (!this.state.user) {
      return <div>This person is in a superposition of existing and not existing as of now</div>;
    }
    return (
      <>
        <h1>{ this.state.user.name }</h1>
      </>
    );
  }
}

export default Dashboard;
