import React, { Component } from "react";
import { Link } from "@reach/router";

import "./MinimalButton.css"

class MinimalButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    const color = (this.props.color) ? this.props.color : "blue"

    const linkclass = "MinimalButton " + color

    return (
      <div className={linkclass} onClick={this.props.onClick}>
          {this.props.children}
      </div>
    );
  }
}

export default MinimalButton;
