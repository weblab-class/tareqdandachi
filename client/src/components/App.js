import React, { Component } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Profile from "./pages/Profile.js";
import CircuitEditor from "./pages/CircuitEditor.js";
import EditProfile from "./pages/EditProfile.js";
import Leaderboard from "./pages/Leaderboard.js";
import Dashboard from "./pages/Dashboard.js";
import Intro from "./pages/Intro.js";
import Game from "./pages/Game.js";
import Search from "./pages/Search.js";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Learn Pages
import Learn from "./pages/Learn.js";
import Gates from "./pages/learn/Gates.js"
import Bloch from "./pages/learn/Bloch.js";
import Funk from "./pages/learn/Funk.js"
import Qasm from "./pages/learn/Qasm.js";

import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

import NavBar from "./modules/NavBar.js";

toast.configure()

/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
      // challenge stuff
      circuit_recipient: undefined,
      circuit_creator: undefined,
    };
  }

  componentDidMount() {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        this.setState({ userId: user._id });
      }
    });
  }

  handleLogin = (res) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      this.setState({ userId: user._id });
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  handleLogout = () => {
    this.setState({ userId: undefined });
    post("/api/logout").then(window.location="/");
  };

  render() {
    return (
      <>
        <NavBar
          handleLogin={this.handleLogin}
          handleLogout={this.handleLogout}
          userId={this.state.userId}
        />
        <div className="App-container">
          <Router>
            <Intro
              path="/qupong"
              handleLogin={this.handleLogin}
              handleLogout={this.handleLogout}
              loggedIn={this.state.userId !== undefined}
            />
            <Dashboard
              path="/"
              handleLogin={this.handleLogin}
              handleLogout={this.handleLogout}
              userId={this.state.userId}
            />
            <Profile
              path="/profile/:profile_username"
              handleLogin={this.handleLogin}
              handleLogout={this.handleLogout}
            />
            <Profile
              path="/profile"
              handleLogin={this.handleLogin}
              handleLogout={this.handleLogout}
              userId={this.state.userId}
            />
            <CircuitEditor
              path="/circuit-editor/:circuitId"
              handleLogin={this.handleLogin}
              handleLogout={this.handleLogout}
              userId={this.state.userId}
            />
            <EditProfile
              path="/profile/edit"
              handleLogin={this.handleLogin}
              handleLogout={this.handleLogout}
              userId={this.state.userId}
            />
            <Leaderboard
              path="/leaderboard"
              handleLogin={this.handleLogin}
              handleLogout={this.handleLogout}
              userId={this.state.userId}
            />
            <Game
              path="/game"
              handleLogin={this.handleLogin}
              handleLogout={this.handleLogout}
              userId={this.state.userId}
            />
            <Game
              path="/game/:challengeId"
              handleLogin={this.handleLogin}
              handleLogout={this.handleLogout}
              userId={this.state.userId}
            />
            <Learn
              path="/learn"
              handleLogin={this.handleLogin}
              handleLogout={this.handleLogout}
              userId={this.state.userId}
            />
            <Gates
              path="/learn/gates"
              handleLogin={this.handleLogin}
              handleLogout={this.handleLogout}
              userId={this.state.userId}
            />
            <Bloch
              path="/learn/bloch"
              handleLogin={this.handleLogin}
              handleLogout={this.handleLogout}
            />
            <Qasm
              path="/learn/qasm"
              handleLogin={this.handleLogin}
              handleLogout={this.handleLogout}
            />
            <Funk
              path="/learn/funk"
              handleLogin={this.handleLogin}
              handleLogout={this.handleLogout}
            />
            <Search
              path="/search"
              handleLogin={this.handleLogin}
              handleLogout={this.handleLogout}
              userId={this.state.userId}
            />
            <NotFound default />
          </Router>
        </div>
      </>
    );
  }
}

export default App;
