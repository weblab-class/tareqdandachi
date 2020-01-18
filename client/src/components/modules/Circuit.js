import React, { Component } from "react";
import { get } from "../../utilities";

import "./Circuit.css";

/**
 * Circuit is a component for displaying content like stories
 *
 * Proptypes
 * @param {string} _id of the story
 * @param {string} creator_name
 * @param {string} creator_id
 * @param {string} content of the story
 */
class Circuit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      circuits: [],
    };
  }

  componentDidMount() {
  }

  // this gets called when the user pushes "Submit", so their
  // post gets added to the screen right away
  addNewCircuit = (circuitObj) => {
    this.setState({
      circuits: this.state.circuits.concat([circuitObj]),
    });
  };

  getScoreString = (score) => {

    if (score == -1) {
      return "Score Not Calculated Yet"
    }

    return (
      <div>
        Score: <span class="Circuit-score"> { score/100 } </span>/ 5.0
      </div>
    );

  }

  render() {
    return (
      <div className="Circuit-container">
        <h1>{ this.props.title }</h1>
        <h2>{ this.props.desc }</h2>
        <h5>{ this.getScoreString(this.props.score) }</h5>
      </div>
    );
  }
}

export default Circuit;
