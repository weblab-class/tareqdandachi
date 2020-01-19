import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import Circuit from "../modules/Circuit.js";

import "../../utilities.css";
import "./CircuitEditor.css";

import { get, post } from "../../utilities";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "117624971444-gmdmhm8712dc3hriss8spnt1vgvmeqkn.apps.googleusercontent.com";

class CircuitEditor extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      circuit: undefined
    };
  }

  getCircuitData = () => {
    console.log("LOGGING ID", this.props.circuitId)
    if (this.props.circuitId) {
      console.log("LOGGING ID", this.props.circuitId)
      get(`/api/circuit`, { circuit_id: this.props.circuitId }).then((circuits) => this.setState({ circuit: circuits }))
    }
  };

  componentDidMount() {
    document.title = "Circuit Editor";
    this.getCircuitData();
  }

  componentDidUpdate(oldProps) {
    if (oldProps.circuitId !== this.props.circuitId) {
      this.getCircuitData();
    }
  }

  render() {
    if (!this.state.circuit) {
      return <div>CIRCUIT NOT FOUND</div>;
    }
    return (
      <>
        <h1>{ this.state.circuit.title }</h1>
        <h3>{ this.state.circuit.description }</h3>
      </>
    );
  }
}

export default CircuitEditor;
