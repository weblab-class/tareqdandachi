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
        <label className="InputField-field-label" htmlFor="field-text">{this.props.title}</label>
        <input type="text" required name="text" id={this.props.id} defaultValue={this.props.defaultValue} className={this.props.className ? this.props.className : ""} onChange={this.props.onChange} placeholder={this.props.placeholder} onKeyDown={this.props.onKeyDown}/>
      </div>
    );
  }
}

export default InputField;
