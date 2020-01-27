import React, { Component } from "react";

class DateDisplayFormatter extends Component {
  constructor(props) {
    super(props);
  }

  dateSince = (date) => {

    date = new Date(date)

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval >= 1) {
      return interval + " year"+(interval>1?"s":"")+" ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval + " month"+(interval>1?"s":"")+" ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval + " day"+(interval>1?"s":"")+" ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval + " hour"+(interval>1?"s":"")+" ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval + " minute"+(interval>1?"s":"")+" ago";
    }

    if (Math.floor(seconds) == 0) {
      return "now"
    }

    return Math.floor(seconds) + " second"+(seconds>1?"s":"")+" ago";
  }

  render() {

    return (
      <>{ this.dateSince(this.props.date) }</>
    );
  }
}

export default DateDisplayFormatter;
