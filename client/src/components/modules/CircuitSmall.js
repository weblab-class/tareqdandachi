import React, { Component } from "react";
import { get } from "../../utilities";

import "./CircuitSmall.css";

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
class CircuitSmall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      circuits: [],
    };
  }

  componentDidMount() {
  }

  getScoreString = (score) => {

    if (score == -1) {
      return "Score N/A"
    }

    return (
      <div>
        <span className="CircuitSmall-score"> { score/100 } </span>/ 5.0
      </div>
    );

  }

  edit_circuit = () => {
    location.href = '/circuit-editor/' + this.props._id
  }

  send_challenge = () => {
    // TODO: DO THIS
  }

  render() {

    const classToUse = this.props.selected ? "CircuitSmall-container selected" : "CircuitSmall-container"

    var creatorLink = "";
    if (this.props.showCreator) {
      creatorLink = (
        <h5>
          <a className="creatorLink" onClick={ this.props.onclick_function !== undefined ? this.props.onclick_function : location.href = "/profile/"+this.props.creator_id }>
            <FontAwesomeIcon icon={faUserCircle} className="icon"/> { this.props.creator_name }
          </a>
        </h5>
      )
    }

    return (
      <div className={ classToUse+" "+this.props.className } onClick={ this.props.onclick_function !== undefined ? this.props.onclick_function : this.edit_circuit }>
        <h1>{ (this.props.index || "") + " " + this.props.title }</h1>
        <h2>{ this.props.desc }</h2>
        { creatorLink }
        <h5><FontAwesomeIcon icon={faChessRook} className="icon" style={{color: "#2ecc71"}}/> {this.props.wins}/{this.props.games}</h5>
        <h5><FontAwesomeIcon icon={faTrophy} className="icon" style={{color: "#DFAF00"}}/> { this.getScoreString(this.props.score) }</h5>
        <h5><FontAwesomeIcon icon={faStar} className="icon" style={{color: "#f1c40f"}}/> {this.props.stars}</h5>
      </div>
    );
  }
}

export default CircuitSmall;
