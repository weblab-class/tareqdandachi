import React, { Component } from "react";
import { get } from "../../utilities";

import "./Challenge.css";

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
class Challenge extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="Challenge-container">
      </div>
    );
  }
}

export default Challenge;
