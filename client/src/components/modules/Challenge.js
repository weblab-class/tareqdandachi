import React, { Component } from "react";
import { get } from "../../utilities";
import SpecialButton from "./SpecialButton";

import "./Challenge.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle, faExclamationCircle, faCircle } from '@fortawesome/free-solid-svg-icons'

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
    // key={`Circuit_${challenge._id}`}
    // _id={challenge._id}
    // creator_name={challenge.creator_name}
    // creator_id={challenge.creator_id}
    // recipient_name={challenge.recipient_name}
    // recipient_id={challenge.recipient_id}
    // userId={this.props.userId}
    // status={challenge.state}

    const name_to_use = (this.props.userId == this.props.creator_id) ? "You" : this.props.creator_name

    let state_viz = {
      "pending": <FontAwesomeIcon icon={faExclamationCircle} style={{color: "#F5A623"}} className="icon"/>,
      "win": <FontAwesomeIcon icon={faCheckCircle} style={{color: "#7ED321"}} className="icon"/>,
      "lose": <FontAwesomeIcon icon={faTimesCircle} style={{color: "#D31D1D"}} className="icon"/>,
    }

    let state_names = {
      "pending": "challenged",
      "win": "won against",
      "lose": "lost to",
    }

    let can_accept = (this.props.status == "pending") ?
    <div className="action_buttons">
      <SpecialButton action={() => this.props.reject(this.props._id)} title="Reject Challenge" icon={ faTimesCircle } destructive={true} className="challengeAction" />
      <SpecialButton action={() => this.props.accept(this.props._id, this.props.circuit_recipient, this.props.circuit_creator)} title="Accept Challenge" icon={ faCheckCircle } destructive={false} />
    </div> : <></>;

    if (this.props.userId !== this.props.creator_id) {
      state_viz = {
        "lose": <FontAwesomeIcon icon={faCheckCircle} style={{color: "#7ED321"}} className="icon"/>,
        "win": <FontAwesomeIcon icon={faTimesCircle} style={{color: "#D31D1D"}} className="icon"/>,
        "pending": <FontAwesomeIcon icon={faExclamationCircle} style={{color: "#F5A623"}} className="icon"/>,
      }

      state_names = {
        "win": "won against",
        "lose": "lost to",
        "pending": "challenged",
      }

    } else { can_accept = <></>; }

    return (
      <div className="Challenge-container">
        <div className="status">{ state_viz[this.props.status] }</div>
        { name_to_use } {state_names[this.props.status]} "{ this.props.recipient_circuit_name }"
        { can_accept }
      </div>
    );
  }
}

export default Challenge;
