import React, { Component } from "react";

import Loading from "../modules/Loading.js";

class NotFound extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const message = ["Quantum Noise Mitigation is a field for a reason.", "Our quantum states got detangled.", "We should've hosted this on a quantum server.", "The states have decoherenced.", "Our noise margin is small, just not small enough.", "If only we could cool our systems lower than 15 mK."]

    return (
      <Loading title="ERROR 404" msg={ message[Math.floor(Math.random()*message.length)] } />
    );
  }
}

export default NotFound;
