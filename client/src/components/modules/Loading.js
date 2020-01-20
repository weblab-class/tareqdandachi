import React, { Component } from "react";

// TODO: add css later
import { post } from "../../utilities";

class Loading extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <center style={{marginTop: "30vh"}}><img src="https://media2.giphy.com/media/3oKIPAaA76uBrFhnYQ/source.gif" width="50" style={{marginBottom: "2em"}} /><h3>{ this.props.msg }</h3></center>
    );
  }
}

export default Loading;
