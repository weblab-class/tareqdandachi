import React, { Component } from "react";
import { get } from "../../utilities";

import "./Circuit.css";
import DateDisplayFormatter from "./DateDisplayFormatter.js"

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

  getScoreString = (score) => {

    if (score == -1) {
      return "Score Not Calculated Yet"
    }

    return (
      <div>
        Score: <span className="Circuit-score"> { score/100 } </span>/ 5.0
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
    var creatorLink = "";
    if (this.props.showCreator) {
      creatorLink = (
        <h5>
          <a className="creatorLink" href={ "/profile/"+this.props.creator_id }>
            <FontAwesomeIcon icon={faUserCircle} className="icon"/> { this.props.creator_name }
          </a>
        </h5>
      )
    }
    //<button onClick={ this.edit_circuit }>View Logic</button>
    // <button onClick={ this.send_challenge }>Challenge Algorithm</button>
    return (
      <div className="Circuit-container">
        <h1 onClick={ this.edit_circuit }>{ (this.props.index || "") + " " + this.props.title }</h1>
        <h2>{ this.props.desc }</h2>
        { creatorLink }
        <h5><FontAwesomeIcon icon={faChessRook} className="icon"/> {this.props.wins}/{this.props.games}</h5>
        <h5><FontAwesomeIcon icon={faTrophy} className="icon"/> { this.getScoreString(this.props.score) }</h5>
        <h5><FontAwesomeIcon icon={faStar} className="icon"/> {this.props.stars}</h5>
        <h5>Updated <DateDisplayFormatter date={this.props.timestamp} /></h5>
      </div>
    );
  }
}

export default Circuit;
