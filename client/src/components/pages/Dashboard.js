import React, { Component } from "react";

import Intro from "./Intro.js";

import CircuitSmall from "../modules/CircuitSmall.js";
import NewCircuit from "../modules/NewCircuit.js";

import Challenge from "../modules/Challenge.js";

import "./Dashboard.css";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { get, post } from "../../utilities";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      circuits: [],
      challenges: [],
      user: undefined,
    }
  }

  getUserData = () => {
    if (this.props.userId) {
      get(`/api/user`, { userId: this.props.userId }).then((user) => this.setState({ user: user }))
      get(`/api/circuits`, { creator_id: this.props.userId }).then((circuits) => this.setState({ circuits: circuits }))
      get(`/api/all_user_challenges`).then((challenges) => this.setState({ challenges: challenges }))
    }
  };

  createNewCircuit = (circuit) => {
    this.setState({
      circuits: [circuit].concat(this.state.circuits),
    });
  };

  componentDidMount() {
    if (this.props.userId) {
      document.title = "Your Dashboard";
    }
    this.getUserData();
  }

  componentDidUpdate(oldProps, prevState) {
    if (oldProps.userId !== this.props.userId) {
      this.getUserData();
    }
  }

  reject = (id) => {
    console.log(id)

    get(`/api/reject_challenge`, { challengeId: id }).then((challenge) => {
      get(`/api/all_user_challenges`).then((challenges) => this.setState({ challenges: challenges }));
      toast("Rejected Challenge", {autoClose: 1000, hideProgressBar: true});
    })

  }

  accept = (id, recipient, creator) => {

    location.href = "/game/"+id;

  }

  render() {

    if (!this.props.userId) {
      return (
        <Intro
          loggedIn={ false }
          handleLogin={this.props.handleLogin}
        />
      );
    }

    let circuitList = null;
    const hasCircuits = this.state.circuits.length !== 0;
    if (hasCircuits) {
      circuitList = this.state.circuits.map((circuitObj) => (
        <CircuitSmall
          key={`Circuit_${circuitObj._id}`}
          _id={circuitObj._id}
          creator_name={circuitObj.creator_name}
          creator_id={circuitObj.creator_id}
          title={circuitObj.title}
          desc={circuitObj.description}
          score={circuitObj.score}
          userId={this.props.userId}
          showCreator={ false }
          wins={circuitObj.wins}
          games={circuitObj.games}
          stars={circuitObj.stars}
          timestamp={circuitObj.timestamp}
        />
      ));
    } else {
      circuitList = (
        <center style={{ margin: "5em"}}>
          <h1>No Circuits</h1>
          <h3 style={{ maxWidth: "500px"}}>Create your first quantum circuit to see it here</h3>
        </center>
      )
    }

    let challengeList = null;
    const hasChallenge = this.state.challenges.length !== 0;
    if (hasChallenge) {
      console.log(this.state.challenges)
      challengeList = this.state.challenges.map((challenge) => (
        <Challenge
          key={`Circuit_${challenge._id}`}
          _id={challenge._id}
          creator_name={challenge.creator_name}
          creator_id={challenge.creator_id}
          recipient_name={challenge.recipient_name}
          recipient_id={challenge.recipient_id}
          recipient_circuit_name={challenge.recipient_circuit.title}
          userId={this.props.userId}
          status={challenge.state}
          accept={this.accept}
          reject={this.reject}
        />
      ));
    } else {
      challengeList = (
        <center style={{ margin: "5em"}}>
          <h1>No Challenges</h1>
          <h3 style={{ maxWidth: "500px"}}>Challenge other user's algorithms to test your strategies out</h3>
        </center>
      )
    }

    return (
      <>
        <div className="qcFlex">
          <h3 className="qcTitle">Your Circuits</h3>
          <NewCircuit createNewCircuit={this.createNewCircuit} user={this.state.user} />
        </div>
        { circuitList }
        <div className="qcFlex">
          <h3 className="qcTitle">Your Challenges</h3>
        </div>
        { challengeList }
      </>
    )

  }
}

export default Dashboard;
