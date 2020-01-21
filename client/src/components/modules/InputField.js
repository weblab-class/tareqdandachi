import React, { Component } from "react";

// TODO: add css later
import { post } from "../../utilities";
import "./InputField.css";

class InputField extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="InputField">
        <input type="text" required name="text" id="field-text" defaultValue={this.props.defaultValue} className={this.props.className ? this.props.className : ""} onChange={this.props.onChange}/>
        <label className="InputField-field-label" htmlFor="field-text">{this.props.title}</label>
      </div>
    );
  }
}

export default InputField;
