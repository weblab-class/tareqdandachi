import React, { Component } from "react";
import { Link } from "@reach/router";

class NavigationLink extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(oldProps) {
    if (oldProps.pathname !== this.props.pathname) {
      console.log(this.props.pathname)
    }
  }

  path_matches = () => this.props.pathname == this.props.to

  render() {
    var linkclass = this.props.className;

    if (this.path_matches()) {
      linkclass += " selected"
    }

    return (
      <Link to={this.props.to} className={linkclass}>
          {this.props.children}
      </Link>
    );
  }
}

export default NavigationLink;
