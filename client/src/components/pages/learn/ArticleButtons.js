import React, { Component } from "react";
import "../Learn.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons'

class ArticleButtons extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <br />
        <div class="articleButtons">
          <button class="button" onClick={() => {location.href=this.props.left_link}}><FontAwesomeIcon icon={faAngleLeft} className="icon"/> { this.props.left }</button>
          <button class="button" onClick={() => {location.href=this.props.right_link}}>{ this.props.right } <FontAwesomeIcon icon={faAngleRight} className="icon"/></button>
        </div>
      </>
    )
  }
}

export default ArticleButtons;
