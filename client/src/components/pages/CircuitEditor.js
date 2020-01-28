import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import Circuit from "../modules/Circuit.js";
import SpecialButton from "../modules/SpecialButton.js";
import Loading from "../modules/Loading.js";
import ChallengePicker from "../modules/ChallengePicker.js";
import InputField from "../modules/InputField.js";
import Game from "./Game.js"

import DateDisplayFormatter from "../modules/DateDisplayFormatter.js"

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "../../utilities.css";
import "./CircuitEditor.css";

import TextareaAutosize from 'react-textarea-autosize';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokaiSublime, atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faChessRook, faUserCircle, faTrophy, faEdit, faSave, faTrash, faMedal, faSync, faServer, faCubes } from '@fortawesome/free-solid-svg-icons'

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
      recipient: undefined,
      creator: undefined,
      show_picker: false,
      viewer_circuits: undefined,
      editingTitle: false,
      newTitle: undefined,
      newDescription: undefined,
      bell_simulation: undefined,
      simulate: undefined,
      starred: false,
    };

  }

  getCircuitData = () => {
    if (this.props.circuitId) {
      get(`/api/circuit`, { circuit_id: this.props.circuitId }).then((circuit) => {

        this.setState({ circuit: circuit })

        get(`/api/whoami`).then((user) => {

          this.setState({ creator: user })

        });

        get(`/api/user`, { userId: circuit.creator_id }).then((user) => this.setState({ recipient: user }));

        if (this.props.userId) {

          get('/api/circuits', {creator_id: this.props.userId}).then((circuits) =>  {

            this.setState({ viewer_circuits: circuits });

          })
        }

      })

      const processBellResponse = (response) => {

        response = JSON.parse(response.replace(/'/g, "\"").replace("},}", "}}"));

        var processed = {};

        var hard_bit_map = {"000": 0, "001":1, "010":2, "011":3, "100":4, "101":5, "110":6, "111":7};

        Object.keys(response).forEach(function(key) {
          processed[key] = {}
          const data = response[key]
          Object.keys(hard_bit_map).forEach(function(deeper_key) {
            processed[key][hard_bit_map[deeper_key]] = data[deeper_key] || 0
          });
        });

        return processed

      }

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://tareq.scripts.mit.edu/woop_read.php?id_string=`+this.props.circuitId);
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.onreadystatechange = () => this.setState({bell_simulation: processBellResponse(xhr.response)});
      xhr.send();

    }

  };

  componentDidMount() {
    document.title = "Circuit Editor";
    this.getCircuitData();
  }

  componentDidUpdate(oldProps) {
    if (oldProps !== this.props) {
      this.getCircuitData();
    }
  }

  starCircuit = () => {

    post("/api/star_circuit", {circuit_id: this.props.circuitId}).then((circuit) => {

      console.log(circuit.star_givers)

      const starred = circuit.star_givers.includes(this.props.userId);

      this.setState({circuit: circuit, starred: starred});

      toast(this.state.starred ? "Starred Circuit" : "Unstarred Circuit", { type: toast.TYPE.INFO, autoClose: 500, hideProgressBar: true})

    });

  }

  getScoreString = (score) => {

    if (score == -1) {
      return "Simulate Circuit To Get Score"
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

    const toastId = toast("Saving Changes", {autoClose: false});

    post("/api/save_circuit_qasm", body).then((circuit) => {

      toast.update(toastId, { type: toast.TYPE.SUCCESS, autoClose: 1000, render: "Saved Successfully", hideProgressBar: true});

    });

    this.setState({ editMode: false, circuit: circuit })
    this.render()

    const xhr = new XMLHttpRequest();

    let code = circuit.qasm.replace(/\n/g, ";");

    while (code.includes(';;')) {
      code = code.replace(";;", ";")
    }

    xhr.open('POST', 'https://tareq.scripts.mit.edu/process.php?circuit_id='+this.props.circuitId+'&qasm='+code);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onreadystatechange = () => console.log(xhr.response); //FIX ME
    xhr.send();

  }

  getButtons = () => {

    if (this.state.editingTitle) {

      return <div style={{textAlign: "right"}}>
        <SpecialButton action={this.saveTitle} title="Save Changes" icon={ faSave } />
        <SpecialButton action={this.editTitle} title="Discard Changes" icon={ faTrash } destructive={ true } />
      </div>

    }

    return <>
      {this.state.bell_simulation && <SpecialButton action={this.simulate} title="Simulate a Game" icon={ faCubes } />}
      <SpecialButton action={this.editTitle} title="Edit Circuit Details" icon={ faEdit } />
      <SpecialButton action={this.delete} title="Delete Algo" icon={ faTrash } destructive={ true } />
    </>

  }

  editTitle = () => {

    this.setState({editingTitle: !(this.state.editingTitle)});

  }

  simulate = () => {

    this.setState({simulate: true})

  }

  saveTitle = () => {

    const toastId = toast("Updating Circuit Details", {autoClose: false});

    let title = this.state.newTitle;
    let description = this.state.newDescription;

    title = ((title!==undefined && title!=="")? title : this.state.circuit.title);
    description = ((description!==undefined && description!=="")? description : this.state.circuit.description);

    this.state.circuit.title = title;
    this.state.circuit.description = description;
    this.state.circuit.timestamp = Date.now();

    const body = {
      circuit_id: this.state.circuit._id,
      title: title,
      description: description,
    }

    post("/api/edit_circuit_title", body).then((circuit) => {

      this.editTitle()

      toast.update(toastId, { type: toast.TYPE.SUCCESS, autoClose: 1000, render: "Updated Successfully", hideProgressBar: true});

    });

  }

  challenge = () => {

    if (this.state.recipient && this.state.creator) {

      this.setState({show_picker: true})

      this.render()

    }

  }

  submit_challenge = () => {

    const toastId = toast("Sending Challenge Request", {autoClose: false});

    const body = {
      message: this.state.message,
      recipient: this.state.recipient,
      recipient_circuit: this.state.circuit,
      creator_circuit: this.state.challenger_circuit,
    }

    post("/api/create_challenge", body).then((circuit) => {

      toast.update(toastId, { type: toast.TYPE.SUCCESS, autoClose: 1000, render: "Request Sent", hideProgressBar: true});

    });

  }

  delete = () => {

    post("/api/delete_circuit", {circuit_id: this.state.circuitId}).then((circuit) => {

      toast.warn("Deleted Circuit '" + circuit.title + "'", { autoClose: 5000, hideProgressBar: true});

      location.href="/";

    });

  }

  set_challenge_inputs = (msg, circuit) => {

    this.setState({message: msg, challenger_circuit: circuit})

  }

  render() {
    if (!this.state.circuit) {
        const message = ["Your circuits are being built from ion trap gates", "Supercooled Qubits need time to cool", "We are grabbing your circuits off the shelf", "Too bad StackOverflow can't help you debug these circuits"];
        return <Loading msg={ message[Math.floor(Math.random()*message.length)] } />;
    }

    if (this.state.simulate) {
      return <Game circuit_loaded={this.state.bell_simulation} name={this.state.circuit.title} circuit_id={this.state.circuit._id}/>
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

    let titleBlocks =  <>
      <h1 className={canEditClass}>{ this.state.circuit.title }</h1>
      <h2 className={canEditClass}>{ this.state.circuit.description }</h2>
    </>

    const is_owner = this.props.userId && (this.props.userId == this.state.circuit.creator_id)

    var actions = <h3>Log in to edit, star or challenge this algorithm.</h3>

    const canEditClass = this.state.editMode ? "canEdit" : "";

    if (this.props.userId && (this.props.userId !== this.state.circuit.creator_id)) {
      actions = <div className="spaceButtonsOut">
      <SpecialButton action={this.starCircuit} title={this.state.starred ? "Unstar Circuit" : "Star Circuit"} icon={ faStar } destructive={this.state.starred} />
      <SpecialButton action={this.challenge} title="Challenge Algo" icon={ faMedal } />
      </div>
    } else if (is_owner) {
      actions = <div className="spaceButtonsOut">

        {this.getButtons()}

      </div>

      if (this.state.editingTitle) {
        titleBlocks = <>
          <InputField className={"titleField "+canEditClass} onChange={ (e) => {this.setState({newTitle: event.target.value})} } defaultValue={ this.state.circuit.title } title="Circuit Title" />
          <InputField className={"descField "+canEditClass} onChange={(e) => {this.setState({newDescription: event.target.value})}} defaultValue={ this.state.circuit.description } title="Circuit Description" />
        </>
      }
    }

    const renderedCircuit = (<>
      <img src={"http://tareq.scripts.mit.edu/woop/id:"+this.state.circuit._id+".png?"+Date.now()} className="circuitPreviewImage" id="circuitPreviewImage" />
    </>)

    const unrenderedCircuit = (<center className="simulationBlock">
      <br /><br />
      <FontAwesomeIcon icon={faServer} className="icon" style={{display: "inline-block", fontSize: "5em", verticalAlign: "middle", marginRight: "0.5em"}}/>
      <div className="simulationMessage">
        <h3>Circuit Being Simulated...</h3>
        <h4>The servers take a while to simulate the quantum circuit.</h4>
      </div>
      <br />
      <br />
    </center>)

    let creator_name = this.state.circuit.creator_name;

    if (this.state.recipient) { creator_name = this.state.recipient.name }

    return (
      <div className="CircuitEditor-container">
        {titleBlocks}
        <h5><FontAwesomeIcon icon={faUserCircle} className="icon"/> { creator_name }</h5>
        <h5><FontAwesomeIcon icon={faChessRook} className="icon"/> Won {this.state.circuit.wins}/{this.state.circuit.games} Games</h5>
        <h5><FontAwesomeIcon icon={faTrophy} className="icon"/> { this.getScoreString(this.state.circuit.score) }</h5>
        <h5><FontAwesomeIcon icon={faStar} className="icon"/>{this.state.circuit.stars} {this.state.circuit.stars == 1 ? "Star" : "Stars"}</h5>
        <h5>Updated <DateDisplayFormatter date={this.state.circuit.timestamp} /></h5>
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
        <div style={{textAlign: "right"}}><a className="u-link" href="/learn/gates" target="_blank">What gates can I use?</a></div>

        <br />

        <div className="qcFlex">
          <h2>Rendered Circuit</h2>
          <SpecialButton action={() => {this.setState({bell_simulation: undefined}); this.getCircuitData(); document.getElementById("circuitPreviewImage").src = "http://tareq.scripts.mit.edu/woop/id:"+this.state.circuit._id+".png?"+Date.now()}} title="Reload" icon={ faSync }/>
        </div>
        { (this.state.bell_simulation !== undefined) ? renderedCircuit : unrenderedCircuit }

        <ChallengePicker set_challenge_inputs={this.set_challenge_inputs} circuits={this.state.viewer_circuits} show={this.state.show_picker} onClose={() => {this.setState({show_picker: false})}} onConfirm={this.submit_challenge}/>
      </div>
    );
  }
}

export default CircuitEditor;
