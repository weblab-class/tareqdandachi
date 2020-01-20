import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import Circuit from "../modules/Circuit.js";
import NewCircuit from "../modules/NewCircuit.js";
import ProfilePane from "../modules/ProfilePane.js";
import Loading from "../modules/Loading.js";

import "../../utilities.css";
import "./Profile.css";

import { get, post } from "../../utilities";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "117624971444-gmdmhm8712dc3hriss8spnt1vgvmeqkn.apps.googleusercontent.com";

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
      this.setState({ editable: false, scope_user: this.props.profile_username })

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
      return <Loading msg="This person is in a superposition of existing and not existing..."/>;
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
      circuitList = (
        <center style={{ margin: "5em"}}>
          <h1>No Circuits</h1>
          { this.state.editable ? (<h3 style={{ maxWidth: "500px"}}>Click the green button to create your first circuit</h3>) : (<h3>This user has no circuits</h3>)}
        </center>
      )
    }

    return (
      <>
        <ProfilePane
          user={this.state.user}
          editable={this.state.editable}
          handleLogout={this.props.handleLogout}
        />
        <div class="qcFlex">
          <h1 class="qcTitle">Quantum Circuits</h1>
          {this.props.userId && <NewCircuit createNewCircuit={this.createNewCircuit} />}
        </div>
        { circuitList }
      </>
    );
  }
}

export default Profile;
