import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import Circuit from "../modules/Circuit.js";
import SpecialButton from "../modules/SpecialButton.js";

import "../../utilities.css";
import "./CircuitEditor.css";

import TextareaAutosize from 'react-textarea-autosize';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokaiSublime, atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faChessRook, faUserCircle, faTrophy, faEdit, faSave, faTrash, faMedal } from '@fortawesome/free-solid-svg-icons'

import { get, post } from "../../utilities";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "117624971444-gmdmhm8712dc3hriss8spnt1vgvmeqkn.apps.googleusercontent.com";

class CircuitEditor extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      circuit: undefined,
      editMode: false,
    };
  }

  getCircuitData = () => {
    if (this.props.circuitId) {
      get(`/api/circuit`, { circuit_id: this.props.circuitId }).then((circuits) => this.setState({ circuit: circuits }))
    }
  };

  componentDidMount() {
    document.title = "Circuit Editor";
    this.getCircuitData();
  }

  componentDidUpdate(oldProps) {
    if (oldProps.circuitId !== this.props.circuitId) {
      this.getCircuitData();
    }
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

  toggleEdit = () => {
    this.setState({ editMode: true })
  }

  discard = () => {
    this.setState({ editMode: false })
  }

  handleChange = () => {}

  saveChanges = () => {

    var circuit = this.state.circuit
    circuit.qasm = document.getElementById("qasmEditor").value

    var body = {circuit_id: this.props.circuitId, circuit: circuit}

    post("/api/save_circuit_qasm", body).then((circuit) => {
      alert("SAVED CHANGES")
    });

    this.setState({ editMode: false, circuit: circuit })
    this.render()
  }

  render() {
    if (!this.state.circuit) {
      return <div>CIRCUIT NOT FOUND</div>;
    }

    var code = this.state.circuit.qasm.replace(/\\n/g, "\n");

    var button = <></>

    if (this.props.userId == this.state.circuit.creator_id) {
      button = <SpecialButton action={this.toggleEdit} title="Edit QASM" icon={ faEdit } />
    }

    var codeViewer = (
      <SyntaxHighlighter language="armasm" style={atomOneDark} className="qasmCode" showLineNumbers={ true }>
        { code }
      </SyntaxHighlighter>
    )

    if (this.state.editMode) {
      button = (
        <div className="spaceButtonsOut">
          <SpecialButton action={this.saveChanges} title="Save Changes" icon={ faSave }/>
          <SpecialButton action={this.discard} title="Discard Changes" icon={ faTrash } destructive={ true } />
        </div>
      )
      codeViewer = (
        <TextareaAutosize
            className="qasmCode"
            id="qasmEditor"
            defaultValue={ code }
            onChange={this.handleChange}
            />
      )
    }

    var actions = <h3>Log in to edit, star or challenge this algorithm.</h3>

    if (this.props.userId && (this.props.userId !== this.state.circuit.creator_id)) {
      actions = <SpecialButton action={this.challenge} title="Challenge Algo" icon={ faMedal } />
    }

    return (
      <div className="CircuitEditor-container">
        <h1>{ this.state.circuit.title }</h1>
        <h2>{ this.state.circuit.description }</h2>
        <h5><FontAwesomeIcon icon={faUserCircle} className="icon"/> { this.state.circuit.creator_name }</h5>
        <h5><FontAwesomeIcon icon={faChessRook} className="icon"/> 138 Games</h5>
        <h5><FontAwesomeIcon icon={faTrophy} className="icon"/> { this.getScoreString(this.state.circuit.score) }</h5>
        <h5><FontAwesomeIcon icon={faStar} className="icon"/> 3 Stars</h5>
        <h5>Updated 20 days ago</h5>
        <div>
          <h2>Actions</h2>
          <div className="actions">
            { actions }
          </div>
        </div>

        <div className="qcFlex">
          <h2>Algorithm Code</h2>
          { button }
        </div>
        { codeViewer }
      </div>
    );
  }
}

export default CircuitEditor;
