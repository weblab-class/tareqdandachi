import React, { Component } from "react";

import CircuitSmall from "../modules/CircuitSmall.js";
import NewCircuit from "../modules/NewCircuit.js";
import GoogleLogin from "react-google-login";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import "./Intro.css";

import { get, post } from "../../utilities";
const GOOGLE_CLIENT_ID = "117624971444-gmdmhm8712dc3hriss8spnt1vgvmeqkn.apps.googleusercontent.com";

class Intro extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="intro">
        { (!this.props.loggedIn) &&

          <GoogleLogin
            clientId={GOOGLE_CLIENT_ID}
            onSuccess={this.props.handleLogin}
            onFailure={(err) => console.log(err)}
            className="NavBar-link NavBar-login"
            render={renderProps => (
              <>
                <div className="logInBanner" onClick={renderProps.onClick} disabled={renderProps.disabled}><FontAwesomeIcon icon={faGoogle} className="icon" style={{marginRight: "1em"}}/> Log in to create your first Quantum Algorithm</div>
                <div className="logInBanner mobile" onClick={renderProps.onClick} disabled={renderProps.disabled}><FontAwesomeIcon icon={faGoogle} className="icon" style={{marginRight: "1em"}}/> Sign in with Google</div>
              </>
            )}
          /> }
        <div className="banner"><h1>Craft your own Quantum Algorithm</h1></div>

        <h2>What is QuPong?</h2>
        <p>QuPong is a web-based tool that helps you learn how quantum programming works by building, simulating and competing with other quantum circuits to win a game of Pong. It requires no previous knowledge of quantum mechanics or quantum computation whatsoever but through practice, you will be able to build quantum algorithms that can be executed in the real world in all kinds of situations.</p>

        <h2>Getting Started</h2>
        <p>What is quantum and why is it so special? - Learn <a className="u-link" href="/learn/funk">Quantum Funk</a></p>
        <p>How to build your first quantum algorithm? - Learn <a className="u-link" href="/learn/gates">Quantum Gates</a></p>
        <p>What are states and how to visualize them? - Learn <a className="u-link" href="/learn/gates">Bloch Sphere</a></p>
        <p>Migrate your skills from dragging and dropping gates to coding them - Learn <a className="u-link" href="/learn/qasm">QASM & Qiskit</a></p>
      </div>
    );

  }
}

export default Intro;
