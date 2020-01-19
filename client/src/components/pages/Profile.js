import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import Circuit from "../modules/Circuit.js";
import NewCircuit from "../modules/NewCircuit.js";
import ProfilePane from "../modules/ProfilePane.js";

import "../../utilities.css";
import "./Profile.css";

import { get, post } from "../../utilities";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

class Profile extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      user: undefined,
      algos: 0,
      circuits: [],
      scope_user: undefined,
      editable: false,
      notLoggedIn: false
    };

    this.getUserScope()

  }

  getUserScope = () => {

    if (this.props.profile_username) {
      this.setState({ editable: false })
      get(`/api/id_from_username`, { username: this.props.profile_username }).then((id) => this.setState({ scope_user: id }))
      this.setState({ notLoggedIn: false })
    } else if (this.props.userId) {
      this.setState({ editable: true })
      this.setState({ scope_user: this.props.userId })
      this.setState({ notLoggedIn: false })
    } else {
      this.setState({ notLoggedIn: true })
    }

  }

  getUserData = () => {
    if (this.state.scope_user) {
      get(`/api/user`, { userId: this.state.scope_user }).then((user) => this.setState({ user: user }))
      get(`/api/circuits`, { creator_id: this.state.scope_user }).then((circuits) => this.setState({ circuits: circuits }))
    }
  };

  createNewCircuit = (circuit) => {
    this.setState({
      circuits: [circuit].concat(this.state.circuits),
    });
  };

  componentDidMount() {
    this.getUserScope()
    document.title = "Your Dashboard";
    this.getUserData();
  }

  componentDidUpdate(oldProps, prevState) {
    console.log("h", oldProps.userId !== this.props.userId, oldProps.userId, this.props.userId)
    if ((oldProps.userId !== this.props.userId) && this.props.userId) {
      this.setState({scope_user: this.props.userId})
      this.setState({ editable: true })
      this.getUserData();
      this.setState({ notLoggedIn: false })
    }
    if (prevState.scope_user !== this.state.scope_user) {
      this.getUserData();
    }
  }

  render() {
    if (this.state.notLoggedIn) {
      return <div>Log In</div>;
    }
    if (!this.state.user) {
      return <div>This person is in a superposition of existing and not existing</div>;
    }
    let circuitList = null;
    const hasCircuits = this.state.circuits.length !== 0;
    if (hasCircuits) {
      circuitList = this.state.circuits.map((circuitObj) => (
        <Circuit
          key={`Circuit_${circuitObj._id}`}
          _id={circuitObj._id}
          creator_name={circuitObj.creator_name}
          creator_id={circuitObj.creator_id}
          title={circuitObj.title}
          desc={circuitObj.description}
          score={circuitObj.score}
          userId={this.props.userId}
          showCreator={ false }
        />
      ));
    } else {
      circuitList = <div><h1>No Circuits</h1><h3>Create your first quantum circuit by clicking the green plus button!</h3></div>;
    }

    return (
      <>
        <ProfilePane
          user={this.state.user}
          editable={this.state.editable}
          handleLogout={this.props.handleLogout}
        />
        { circuitList }
        {this.props.userId && <NewCircuit createNewCircuit={this.createNewCircuit} />}
      </>
    );
  }
}

export default Profile;
