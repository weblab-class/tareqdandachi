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
      return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval + " minutes ago";
    }

    if (Math.floor(seconds) == 0) {
      return "now"
    }

    return Math.floor(seconds) + " seconds ago";
  }

  render() {

    return (
      <>{ this.dateSince(this.props.date) }</>
    );
  }
}

export default DateDisplayFormatter;
