import React, { Component } from "react";
import { get } from "../../utilities";

import "./Circuit.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faChessRook, faUserCircle, faTrophy } from '@fortawesome/free-solid-svg-icons'

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

  edit_circuit = () => {
    location.href = 'circuit-editor/' + this.props._id
  }

  send_challenge = () => {
    // TODO: DO THIS
  }

  render() {
    var creatorString = "";
    if (this.props.showCreator) {
      creatorString = this.props.creator_name;
    }
    //<button onClick={ this.edit_circuit }>View Logic</button>
    // <button onClick={ this.send_challenge }>Challenge Algorithm</button>
    return (
      <div className="Circuit-container">
        <h1 onClick={ this.edit_circuit }>{ (this.props.index || "") + " " + this.props.title }</h1>
        <h2>{ this.props.desc }</h2>
        <h5><FontAwesomeIcon icon={faUserCircle} className="icon"/> { creatorString }</h5>
        <h5><FontAwesomeIcon icon={faChessRook} className="icon"/> 138 Games</h5>
        <h5><FontAwesomeIcon icon={faTrophy} className="icon"/> { this.getScoreString(this.props.score) }</h5>
        <h5><FontAwesomeIcon icon={faStar} className="icon"/> 3 Stars</h5>
        <h5>Updated 20 days ago</h5>
      </div>
    );
  }
}

export default Circuit;
