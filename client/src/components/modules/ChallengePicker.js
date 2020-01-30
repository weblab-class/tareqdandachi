import React, { Component } from "react";
import PropTypes from 'prop-types';

import SpecialButton from "./SpecialButton.js"
import CircuitSmall from "../modules/CircuitSmall.js";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faPaperPlane } from '@fortawesome/free-solid-svg-icons'

// TODO: add css later
import { post } from "../../utilities";

class ChallengePicker extends Component {
  constructor(props) {
    super(props);

    var circ_id = undefined

    if (this.props.circuits) {
      circ_id = this.props.circuits[0]._id
      this.props.set_challenge_inputs("You are being challenged by me!", this.props.circuits[0]);
    }

    this.state = { message: "You are being challenged by me!", selected_id: circ_id}

  }

  componentDidMount() {
    if (this.props.circuits!==undefined && this.state.selected_id==undefined) {
      this.setState({selected_id: this.props.circuits[0]._id})
      this.props.set_challenge_inputs("You are being challenged by me!", this.props.circuits[0]);
    }
  }

  componentDidUpdate() {
    if (this.props.circuits!==undefined && this.state.selected_id==undefined) {
      this.setState({selected_id: this.props.circuits[0]._id})
      this.props.set_challenge_inputs("You are being challenged by me!", this.props.circuits[0]);
    }
  }

  render() {
    // this.props.set_challenge_inputs()

    if(!this.props.show) {
      return null;
    }

    let circuitList = null;
    let hasCircuits = this.props.circuits !== undefined;
    if (hasCircuits) { hasCircuits = this.props.circuits.length !== 0}
    if (hasCircuits) {
      circuitList = this.props.circuits.map((circuitObj) => (
        <CircuitSmall
          key={`Circuit_${circuitObj._id}`}
          _id={circuitObj._id}
          creator_name={circuitObj.creator_name}
          creator_id={circuitObj.creator_id}
          title={circuitObj.title}
          desc={circuitObj.description}
          score={circuitObj.score}
          userId={this.props.userId}
          stars={circuitObj.stars}
          wins={circuitObj.wins}
          games={circuitObj.games}
          showCreator={ false }
          selected = {circuitObj._id == this.state.selected_id}
          className="small"
          onclick_function={ () => {
            this.props.set_challenge_inputs(this.state.message, circuitObj);
            this.setState({selected_id: circuitObj._id});
          }}
        />
      ));
    } else {
      circuitList = (
        <center style={{ margin: "5em"}}>
          <h1>No Circuits</h1>
          <h3 style={{ maxWidth: "500px"}}>Create your first quantum circuit to see it here</h3>
        </center>
      )
    }

    // The gray background
    const backdropStyle = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      padding: 50,
      overflow: "scroll",
    };

    // The modal "window"
    const modalStyle = {
      backgroundColor: '#fff',
      borderRadius: 5,
      maxWidth: 500,
      minHeight: 300,
      margin: '0 auto',
      padding: 30
    };

    const footerStyle = {
      textAlign: "right",
    };

    return (
      <div className="backdrop" style={backdropStyle}>
        <div className="modal" style={modalStyle}>
          {circuitList}

          <br /><br />

          <div className="footer" style={footerStyle}>
            <SpecialButton action={this.props.onClose} title="Cancel" icon={ faTimes } destructive={true} style={{marginRight: "10px"}}/>
            <SpecialButton action={() => {this.props.onConfirm(); this.props.onClose()}} title="Send Request" icon={ faPaperPlane } />
          </div>
        </div>
      </div>
    );
  }
}

ChallengePicker.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  children: PropTypes.node
};


export default ChallengePicker;
