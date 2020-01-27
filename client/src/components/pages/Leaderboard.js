import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import Circuit from "../modules/Circuit.js";
import Loading from "../modules/Loading.js";

import "../../utilities.css";
import "./Leaderboard.css";

import { get, post } from "../../utilities";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "117624971444-gmdmhm8712dc3hriss8spnt1vgvmeqkn.apps.googleusercontent.com";

class Leaderboard extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      circuits: []
    };
  }

  getUserData = () => {
    get(`/api/high_performers`).then((circuits) => this.setState({ circuits: circuits }))
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
    let circuitList = null;
    const hasCircuits = this.state.circuits.length !== 0;
    if (hasCircuits) {
      circuitList = this.state.circuits.map((circuitObj, index) => (
        <Circuit
          key={`Circuit_${circuitObj._id}`}
          index={ index+1+"." }
          _id={circuitObj._id}
          creator_name={circuitObj.creator_name}
          creator_id={circuitObj.creator_id}
          title={circuitObj.title}
          desc={circuitObj.description}
          score={circuitObj.score}
          userId={this.props.userId}
          showCreator={ true }
          wins={circuitObj.wins}
          stars={circuitObj.stars}
          games={circuitObj.games}
          timestamp={circuitObj.timestamp}
        />
      ));
    } else {
      const message = ["Measuring the leaderboard entanglements", "Until measured, all of the algorithms are on the leaderboard", "Do algorithm quantum tunnel to the leaderboards?", "There's a 50% possibility your algorithm is on these leaderboards, not probability..."];
      circuitList = <Loading msg={ message[Math.floor(Math.random()*message.length)] } />;
    }

    return (
      <div className="Leaderboards">
        <h1 style={{marginLeft: "0.6em"}}>Leaderboards</h1>
        { circuitList }
      </div>
    );
  }
}

export default Leaderboard;
