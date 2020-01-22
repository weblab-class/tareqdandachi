import React, { Component } from "react";

import "./NewCircuit.css";
import { post } from "../../utilities";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class SpecialButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
    };
  }

  render() {
    var classes = "NewCircuit-button u-pointer";
    if (this.props.destructive){
      classes += " destroy";
    }
    if (this.props.className){
      classes += " " + this.props.className;
    }
    return (
      <div className={classes} onClick={this.props.action} style={this.props.style}>
        <a>
          <FontAwesomeIcon icon={this.props.icon} className="icon"/> { this.props.title }
        </a>
      </div>
    );
  }
}

export default SpecialButton;
