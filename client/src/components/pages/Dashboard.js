import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import Circuit from "../modules/Circuit.js";
import NewCircuit from "../modules/NewCircuit.js";

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
      circuits: []
    };
  }

  getUserData = () => {
    if (this.props.userId) {
      get(`/api/user`, { userId: this.props.userId }).then((user) => this.setState({ user: user }))

      get(`/api/circuits`, { creator_id: this.props.userId }).then((circuits) => this.setState({ circuits: circuits }))
    }
  };

  createNewCircuit = (circuit) => {
    this.setState({
      circuits: [circuit].concat(this.state.circuits),
    });
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
        />
      ));
    } else {
      circuitList = <div><h1>No Circuits</h1><h3>Create your first quantum circuit by clicking the green plus button!</h3></div>;
    }
    return (
      <>
        <img src={ this.state.user.profile_pic }/>
        <h1>{ this.state.user.name }</h1>
        <h3>{ this.state.user.description }</h3>
        { circuitList }
        {this.props.userId && <NewCircuit createNewCircuit={this.createNewCircuit} />}
      </>
    );
  }
}

export default Dashboard;
