import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import SpecialButton from "../modules/SpecialButton.js";
import InputField from "../modules/InputField.js";
import Loading from "../modules/Loading.js";
import Circuit from "../modules/Circuit.js";
import ProfilePane from "../modules/ProfilePane.js";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

import "../../utilities.css";
import "./Search.css";

import { get, post } from "../../utilities";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "117624971444-gmdmhm8712dc3hriss8spnt1vgvmeqkn.apps.googleusercontent.com";

class Search extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      results: undefined,
      searching: false,
      query: "",
    };

  }

  changeQuery = (event) => {
    this.setState({query: event.target.value})
  }

  search = () => {
    this.setState({results: [], searching: true})

    post("/api/search", {query: this.state.query}).then((results) => {

      this.setState({results: results, searching: false})

      console.log(results)

    });

  }

  confirm_keydown = (e) => {
    if(e.keyCode == 13){
      this.search()
    }
  }

  render() {
    if (this.state.searching) {
      const message = ["Using grover's algorithm to find some matches", "Performing asymptotically optimal search on some oracles", "Maybe we should switch to quantum servers for faster searches"]

      return <Loading msg={message[Math.floor(Math.random()*message.length)]} title="Searching..."/>
    }

    let circuitList = null;
    let peopleList = null;

    if (this.state.results) {

      const hasCircuits = this.state.results.circuits.length !== 0;
      if (hasCircuits) {
        circuitList = this.state.results.circuits.map((circuitObj) => (
          <Circuit
            key={`Circuit_${circuitObj._id}`}
            _id={circuitObj._id}
            creator_name={circuitObj.creator_name}
            creator_id={circuitObj.creator_id}
            title={circuitObj.title}
            desc={circuitObj.description}
            score={circuitObj.score}
            userId={this.props.userId}
            showCreator={ false }
            wins={circuitObj.wins}
            stars={circuitObj.stars}
            games={circuitObj.games}
            timestamp={circuitObj.timestamp}
          />
        ));
      } else {
        circuitList = (
          <center style={{ margin: "5em"}}>
            <h1>No Results</h1>
            <h3>No circuits that match the query were found</h3>
          </center>
        )
      }

      const hasPeople = this.state.results.users.length !== 0;
      if (hasPeople) {
        peopleList = this.state.results.users.map((person) => (
          <ProfilePane
            user={person}
            editable={false}
            handleLogout={this.props.handleLogout}
            circuit_count={false}
            onClick={() => location.href = "/profile/"+person._id}
          />
        ));
      } else {
        peopleList = (
          <center style={{ margin: "5em"}}>
            <h1>No Results</h1>
            <h3>No users that match the query were found</h3>
          </center>
        )
      }

    }

    return <div className="searchContainer">
      <div className="searchForm">
        <div className="searchField">
          <InputField
            type="text"
            placeholder="Search"
            onChange={this.changeQuery}
            title="Search"
            onKeyDown={this.confirm_keydown}
          />
        </div>
        <SpecialButton action={this.search} title="Search" icon={ faSearch } className="searchButton" />
      </div>
      <br />
      { this.state.results && <div className="resultTitle"><h1>People Search</h1><br /></div>}
      <div className="resultSection">{ peopleList }</div>
      { this.state.results && <div className="resultTitle"><h1>Circuit Search</h1></div>}
      <div className="resultSection">{ circuitList }</div>

      { !(this.state.results) && <center style={{color: "#ccc", marginTop: "15vh"}}><h1>Search For Something</h1><h3>Enter a search query and hit the search button.</h3><br /></center>}
    </div>
  }
}

export default Search;
