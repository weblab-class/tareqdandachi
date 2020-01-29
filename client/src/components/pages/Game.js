import React, { Component } from "react";
import ReactDOM from 'react-dom';

import GoogleLogin, { GoogleLogout } from "react-google-login";
import Circuit from "../modules/Circuit.js";
import NewCircuit from "../modules/NewCircuit.js";
import CircuitLogic from "../modules/CircuitLogic.js"
import CircuitSim from "../modules/CircuitSim.js";

import Loading from "../modules/Loading.js";

import "../../utilities.css";
import "./Game.css";

import { get, post } from "../../utilities";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "117624971444-gmdmhm8712dc3hriss8spnt1vgvmeqkn.apps.googleusercontent.com";

class Game extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State

    this.state = {
      paddle: 0,
      PADDLE_WIDTH: 0,
      ball_states: 0,
      paddles: 0,
      opponent_paddles: undefined,
      circuit_loaded: undefined,
      opponent_circuit_loaded: undefined,
      challenge: undefined,
    };;

  }

  lazyLoadedCircuit = () => {

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

    post("/api/begin_challenge", {challengeId: this.props.challengeId}).then((challenge) => {

      this.setState({challenge: challenge})

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://tareq.scripts.mit.edu/woop_read.php?id_string=`+challenge.recipient_circuit._id);
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.onreadystatechange = () => this.setState({circuit_loaded: processBellResponse(xhr.response)});
      xhr.send();

      const xhr2 = new XMLHttpRequest();
      xhr2.open('POST', `https://tareq.scripts.mit.edu/woop_read.php?id_string=`+challenge.creator_circuit._id);
      xhr2.setRequestHeader('Content-type', 'application/json');
      xhr2.onreadystatechange = () => this.setState({opponent_circuit_loaded: processBellResponse(xhr2.response)});
      xhr2.send();

    });

  }

  loadGame = () => {

    const bell_states = ['000', '001', '010', '011', '100', '101', '110', '111'];
    const display_multiplier = 2;

    var qPos1, qPos2, qPos1Strength, qPos2Strength
    qPos1 = qPos2 = qPos1Strength = qPos2Strength = 0

    var mPos1, mPos2, mPos1Strength, mPos2Strength
    mPos1 = mPos2 = mPos1Strength = mPos2Strength = 0

    var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60)
    };
    var canvas = document.getElementById("game");
    var width = 400*display_multiplier;
    var height = 600*display_multiplier;
    canvas.width = width;
    canvas.height = height;

    var score_home = 0
    var score_away = 0
    const speed_multiplier = 3

    const circuit_id = this.props.circuit_id
    var stop = false;
    const challenge = this.state.challenge

    const PADDLE_WIDTH = 400/8*display_multiplier
    this.setState({PADDLE_WIDTH: PADDLE_WIDTH})
    var context = canvas.getContext('2d');
    var players = [new Player(), new Player(), new Player(), new Player(), new Player(), new Player(), new Player(), new Player()]
    // var player = new Player();

    var computer = new Computer();
    var real_opponent = this.props.challengeId !== undefined;
    if (real_opponent) {
      computer = [new Player(true), new Player(true), new Player(true), new Player(true), new Player(true), new Player(true), new Player(true), new Player(true)];
      this.setState({opponent_paddles: computer});
    }

    var ball = new Ball(200*display_multiplier, 300*display_multiplier);

    const regular_font = "400 " + 10*display_multiplier+"px 'Roboto Mono', monospace";
    const bold_font = "900 " + 10*display_multiplier+"px 'Roboto Mono', monospace";

    var selectedLane = -1;

    context.font =regular_font;
    context.textAlign = 'center';

    this.setState({paddles: players});
    var chosen_paddle = Math.floor(Math.random() * 7);
    this.setState({paddle: chosen_paddle});

    var render = function () {

        if (stop){ return }

        context.fillStyle = "#262626";
        context.fillRect(0, 0, width, height);
        context.fillStyle = "#111";
        context.fillRect(0, 40, width, height-90);

        for (var i = 0; i < players.length; i++) {
          players[i].render()
        }

        if (real_opponent) {
          // computer = [new Player(), new Player(), new Player(), new Player(), new Player(), new Player(), new Player(), new Player()];
          for (var i = 0; i < computer.length; i++) {
            computer[i].render()
          }
        } else {
            computer.render();
        }

        ball.render();

        for (var i = 0; i < 8; i++) {

          const state = "￨" + bell_states[i] + " ⟩"

          if (i == qPos1 || i == qPos2) { context.fillStyle = '#fed330'; context.font = bold_font; }
          else { context.fillStyle = 'white'; context.font = regular_font; }
          context.fillText(state, (i+0.5)*PADDLE_WIDTH, 15*display_multiplier, PADDLE_WIDTH);

          //change this later
          if (false) { context.fillStyle = '#658DFF'; context.font = bold_font; }
          else { context.fillStyle = 'white'; context.font = regular_font; }
          context.fillText(state, (i+0.5)*PADDLE_WIDTH, 590*display_multiplier, PADDLE_WIDTH);

        }

        context.fillStyle = 'rgba(255,255,255,0.3)';
        context.font = "900 " + 125*display_multiplier+"px Roboto";
        context.textAlign = "center";
        context.textBaseline = 'middle';
        context.fillText(score_home+" : "+score_away, canvas.width/2, canvas.height/2);
    };

    var update = function () {
        for (var i = 0; i < players.length; i++) {
          players[i].update()
        }

        if (real_opponent) {
          // computer = [new Player(), new Player(), new Player(), new Player(), new Player(), new Player(), new Player(), new Player()];
          for (var i = 0; i < computer.length; i++) {
            computer[i].update()
          }
        } else {
          computer.update(ball);
        }

        if (real_opponent) { ball.update(players, computer) }
        else { ball.update(players, computer.paddle) }
    };

    var step = function () {
        update();
        render();
        animate(step);
    };

    function Paddle(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.x_speed = 0;
        this.y_speed = 0;
        this.probability = 1;
    }

    Paddle.prototype.render = function () {
        context.fillStyle = "rgba(252, 92, 101,"+ this.probability**0.7 +")";
        context.fillRect(this.x, this.y, this.width, this.height);
    };

    Paddle.prototype.move = function (x, y) {
        this.x += x;
        this.y += y;
        this.x_speed = Math.random();//x;
        this.y_speed = Math.random();//y;
        if (this.x < 0) {
            this.x = 0;
            this.x_speed = 0;
        } else if (this.x + this.width > 400*display_multiplier) {
            this.x = 400*display_multiplier - this.width;
            this.x_speed = 0;
        }
    };

    Paddle.prototype.set_position = function (x) {
        this.x = x;
        this.x_speed = (Math.random()+0.5)*10;
        if (this.x < 0) {
            this.x = 0;
            this.x_speed = 0;
        } else if (this.x + this.width > 400*display_multiplier) {
            this.x = 400*display_multiplier - this.width;
            this.x_speed = 0;
        }
    };

    function Computer() {
        this.paddle = new Paddle(175*display_multiplier, 25*display_multiplier, PADDLE_WIDTH, 10*display_multiplier);
    }

    Computer.prototype.render = function () {
        this.paddle.render();
    };

    Computer.prototype.update = function (ball) {
        var x_pos = ball.x;
        var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
        if (diff < 0 && diff < -4) {
            diff = -6;
        } else if (diff > 0 && diff > 4) {
            diff = 6;
        }
        this.paddle.move(diff, 0);
        if (this.paddle.x < 0) {
            this.paddle.x = 0;
        } else if (this.paddle.x + this.paddle.width > 400*display_multiplier) {
            this.paddle.x = 400*display_multiplier - this.paddle.width;
        }
    };

    function Player(top) {
        if (top) { this.paddle = new Paddle(0, 25*display_multiplier, PADDLE_WIDTH, 10*display_multiplier); }
        else {this.paddle = new Paddle(0, 560*display_multiplier, PADDLE_WIDTH, 10*display_multiplier);}
    }

    Player.prototype.render = function () {
        this.paddle.render();
    };

    Player.prototype.update = function () {
        // for (var key in keysDown) {
        //     var value = Number(key);
        //     if (value == 37) {
        //         this.paddle.move(-4*display_multiplier, 0);
        //     } else if (value == 39) {
        //         this.paddle.move(4*display_multiplier, 0);
        //     } else {
        //         this.paddle.move(0, 0);
        //     }
        // }

        var mPos = this.paddle.x / PADDLE_WIDTH;

        mPos1 = Math.floor(mPos);
        mPos2 = Math.ceil(mPos);
        mPos1Strength = Math.sqrt(mPos - mPos1);
        mPos2Strength = Math.sqrt(mPos2 - mPos);
    };

    function Ball(x, y) {

        this.random_ball_position = function () {

          const yInput = speed_multiplier*display_multiplier;
          const plusminus = (Math.random()>0.5)? 1 : -1

          return [(Math.random()-0.5)*10, plusminus*yInput]

        }

        this.x = x;
        this.y = y;
        this.x_speed = this.random_ball_position()[0];
        this.y_speed = this.random_ball_position()[1];
    }

    function increaseScore(home) {

      if (home) {
        score_home++
      } else {
        score_away++
      }

      if (Math.max(score_home, score_away) >= 20 && circuit_id && !(stop)) {

        const score_function_per_20 = (x) => Math.round((1.25*x)**0.5*100);
        stop = true;

        post("/api/update_score", {circuit_id: circuit_id, score: score_function_per_20(score_home)}).then((challenge) => {
          location.reload();
        });

      } else if (Math.max(score_home, score_away) >= 10 && challenge && !(stop)) {

        stop = true;

        post("/api/complete_challenge", {challenge: challenge, challenger_win: (score_home < score_away)}).then((challenge) => {
          window.location.href = "/"
        });

      }

    }

    Ball.prototype.render = function () {
        context.beginPath();
        context.arc(this.x, this.y,5*display_multiplier, 2 * Math.PI, false);
        context.fillStyle = "#fed330";
        context.fill();
    };

    const updateQPos = (qPos1, qPos1Strength, qPos2, qPos2Strength) => {
      this.setState({ball_states: [[qPos1, qPos1Strength], [qPos2, qPos2Strength]]})
    }

    Ball.prototype.update = function (paddles, paddle2) {
        this.x += this.x_speed;
        this.y += this.y_speed;
        var top_x = this.x - 5;
        var top_y = this.y - 5;
        var bottom_x = this.x + 5;
        var bottom_y = this.y + 5;

        if (this.x - 5*display_multiplier < 0) {
            this.x = 5*display_multiplier;
            this.x_speed = -this.x_speed;
        } else if (this.x + 5*display_multiplier > 400*display_multiplier) {
            this.x = 395*display_multiplier;
            this.x_speed = -this.x_speed;
        }

        if (this.y < 0 || this.y > 600*display_multiplier) {
            const reset_vals = this.random_ball_position();
            if (this.y<0) { increaseScore(true) }
            else { increaseScore(false) }
            this.x_speed = reset_vals[0];
            this.y_speed = reset_vals[1];
            this.x = 200*display_multiplier;
            this.y = 300*display_multiplier;
        }

        const pick_paddle = (prob) => {

          if (prob == 0) { return 0 }

          var track = 0

          for (var i = 0; i < 8; i++) {

            track += players[i].paddle.probability

            if (track > prob) {

              return i

            }

          }

          return 7

        }

        const paddle1 = paddles[chosen_paddle].paddle

        if (real_opponent) {
          paddle2 = paddle2[chosen_paddle].paddle
        }

        if (top_y > 300*display_multiplier) {

          if (!(top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y)) {
            chosen_paddle = pick_paddle(Math.random())
          }
        } else {
          if (!(top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y)) {
            chosen_paddle = pick_paddle(Math.random())
          }
        }

        if (top_y > 300*display_multiplier) {
            if (top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
                this.y_speed = -speed_multiplier*display_multiplier;
                this.x_speed += (paddle1.x_speed / 2);
                this.y += this.y_speed;
                // chosen_paddle = Math.floor(Math.random() * 7)
            }
        } else {
            if (top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
                this.y_speed = speed_multiplier*display_multiplier;
                this.x_speed += (paddle2.x_speed / 2);
                this.y += this.y_speed;
                // chosen_paddle = Math.floor(Math.random() * 7)
            }
        }

        var qPos = this.x / PADDLE_WIDTH - 0.5;

        qPos1 = Math.floor(qPos);
        qPos2 = Math.ceil(qPos);
        qPos1Strength = Math.sqrt(qPos - qPos1);
        qPos2Strength = Math.sqrt(qPos2 - qPos);

        updateQPos(qPos1, qPos1Strength, qPos2, qPos2Strength);

        // if (qPos1 == qPos2 || qPos1<0 || qPos2>7) { document.getElementById('ballpos').innerText = Math.max(qPos1, 0) + ":1" }
        // else {
        //   document.getElementById('ballpos').innerText = qPos1 + ":" + qPos1Strength + " | " + qPos2 + ":" + qPos2Strength;
        // }

    };

    animate(step);

    window.addEventListener("keydown", function (event) {
    });

    const moveCursor = () => {

        const cursor = document.getElementById("cursor");
        if (cursor) { cursor.parentNode.removeChild(cursor) }

        if (selectedLane == -1) { return }

        const cursorElement = document.createElement("div");
        cursorElement.id = "cursor"
        cursorElement.classList.add("cursor");
        cursorElement.classList.add("gate");
        cursorElement.innerHTML = "cursor"

        const wire = document.getElementById("wire"+(selectedLane+1));
        wire.appendChild(cursorElement);
    }

    const addGate = (gateType, display) => {

      // <div id="HGate" gate="h" className="gate h" draggable="true" onDragStart={this.drag}>H</div>

      const gateTypeLower = gateType.toLowerCase();
      const wire = document.getElementById("wire"+(selectedLane+1));

      const gateElement = document.createElement("div");

      gateElement.id = gateTypeLower + (wire.id) + (wire.children.length-1)
      gateElement.classList.add("gate");
      gateElement.classList.add(gateTypeLower);

      gateElement.draggable = "true";
      gateElement.addEventListener('dblclick', function (e) {
        e.target.parentNode.removeChild(e.target);
      });

      gateElement.setAttribute("gate", gateTypeLower);
      gateElement.innerHTML = (display) ? display : gateType;

      wire.appendChild(gateElement);

      // selectedLane = -1;
      moveCursor()
    }

    const removeGate = () => {
      const wire = document.getElementById("wire"+(selectedLane+1));
      const wire_children = wire.children;

      if (wire.children.length > 1) {
        wire.removeChild(wire_children[wire.children.length-2])
      }

    }

    window.addEventListener('click', () => {

      selectedLane = -1;
      moveCursor()

    }, true);

    window.addEventListener('dragstart', () => {

      selectedLane = -1;
      moveCursor()

    }, true);

    window.onkeyup = (e) => {
        if (event.keyCode == 40) {

          selectedLane = ((selectedLane + 1) % 3);

          moveCursor();

        } else if (event.keyCode == 38) {

          selectedLane = selectedLane - 1;
          if (selectedLane < 0) { selectedLane = 2; }

          moveCursor();

        } else if (event.keyCode == 72) {

          addGate("H");

        } else if (event.keyCode == 88) {

          addGate("X");

        } else if (event.keyCode == 67) {

          addGate("CX");

        } else if (event.keyCode == 49) {

          addGate("one", "1");

        } else if (event.keyCode == 48) {

          addGate("zero", "0");

        } else if (event.keyCode == 73) {

          addGate("I");

        } else if (event.keyCode == 8) {

          removeGate();

        }

    };

  }

  componentDidMount() {

    if (this.props.challengeId!==undefined) {
      this.lazyLoadedCircuit();
    } else {
      this.loadGame()
    }

  }

  componentDidUpdate(oldProps, prevState) {
    if (prevState !== this.state && this.state.circuit_loaded!==undefined && this.state.opponent_circuit_loaded!==undefined && (prevState.circuit_loaded==undefined || prevState.opponent_circuit_loaded==undefined)) { this.render(); this.loadGame() }
  }

  setPaddlePosition = (x, scale=1) => {

    if (this.props.circuit_loaded==undefined && this.props.challengeId==undefined) {

      var state_dictionary = {}

      for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 2; j++) {
          for (var k = 0; k < 2; k++) {

            const getVal = (index, isOne) => ((isOne) ? x[index] : 1-x[index])

            state_dictionary[k+j*2+i*4] = getVal(2, k)*getVal(1, j)*getVal(0, i)

          }
        }
      }

      x = state_dictionary;

    }

    for (var i = 0; i < this.state.paddles.length; i++) {

      this.state.paddles[i].paddle.set_position(i*this.state.PADDLE_WIDTH);

      this.state.paddles[i].paddle.probability = x[i]/scale;

    }

    return true

  }

  setOpponentPaddlePosition = (x, scale=1) => {

    if (this.props.circuit_loaded==undefined && this.props.challengeId==undefined) {

      var state_dictionary = {}

      for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 2; j++) {
          for (var k = 0; k < 2; k++) {

            const getVal = (index, isOne) => ((isOne) ? x[index] : 1-x[index])

            state_dictionary[k+j*2+i*4] = getVal(2, k)*getVal(1, j)*getVal(0, i)

          }
        }
      }

      x = state_dictionary;

    }

    for (var i = 0; i < this.state.paddles.length; i++) {

      this.state.opponent_paddles[i].paddle.set_position(i*this.state.PADDLE_WIDTH);

      this.state.opponent_paddles[i].paddle.probability = x[i]/scale;

    }

    return true

  }

  render() {

    const message = ["Entangling your opponents qubits.", "Applying some hadamards on the ball.", "Transpiling your circuit gates into CX and U gates."];

    if (this.props.challengeId !== undefined) {
      if (!(this.state.circuit_loaded && this.state.opponent_circuit_loaded)) { return <Loading msg={ message[Math.floor(Math.random()*message.length)] } /> }
      return <>
        <div className="gameContainer">
          <div className="first-half">
            <canvas id="game"></canvas>
          </div>
          <CircuitSim
            paddle={this.state.paddle}
            setPaddlePosition={this.setPaddlePosition}
            setOpponentPaddlePosition={this.setOpponentPaddlePosition}
            PADDLE_WIDTH={this.state.PADDLE_WIDTH}
            ball_states={this.state.ball_states}
            simulation_values={this.state.circuit_loaded}
            opponent_simulation_values={this.state.opponent_circuit_loaded}
            home_name={this.state.challenge.recipient_circuit.title}
            away_name={this.state.challenge.creator_circuit.title}
            circuit_id={this.state.challenge.recipient_circuit._id}
          />
        </div>
      </>
    }

    return <div className="gameContainer">
      <div className="first-half">
        <canvas id="game"></canvas>
      </div>
      {(this.props.circuit_loaded==undefined && this.props.challengeId==undefined) ? (
        <CircuitLogic
          paddle={this.state.paddle}
          setPaddlePosition={this.setPaddlePosition}
          PADDLE_WIDTH={this.state.PADDLE_WIDTH}
          ball_states={this.state.ball_states}
        />) : (
          <CircuitSim
            paddle={this.state.paddle}
            setPaddlePosition={this.setPaddlePosition}
            PADDLE_WIDTH={this.state.PADDLE_WIDTH}
            ball_states={this.state.ball_states}
            simulation_values={this.props.circuit_loaded}
            home_name={this.props.challenge}
            name={this.props.name}
            circuit_id={this.props.circuit_id}
        />)}
    </div>
  }
}

export default Game;
