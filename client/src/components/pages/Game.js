import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import Circuit from "../modules/Circuit.js";
import NewCircuit from "../modules/NewCircuit.js";

import "../../utilities.css";
import "./Game.css";

import { get, post } from "../../utilities";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

class Game extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State

  }

  componentDidMount() {

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

    const PADDLE_WIDTH = 400/8*display_multiplier
    var context = canvas.getContext('2d');
    var player = new Player();
    var computer = new Computer();
    var ball = new Ball(200*display_multiplier, 300*display_multiplier);

    const regular_font = "400 " + 10*display_multiplier+"px monospace";
    const bold_font = "900 " + 10*display_multiplier+"px monospace";

    context.font =regular_font;
    context.textAlign = 'center';

    var keysDown = {};

    var render = function () {
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, width, height);
        context.fillStyle = "#FFDDFF";
        context.fillRect(0, 40, width, height-90);
        player.render();
        computer.render();
        ball.render();

        for (var i = 0; i < 8; i++) {

          const state = "￨" + bell_states[i] + " ⟩"

          if (i == qPos1 || i == qPos2) { context.fillStyle = 'red'; context.font = bold_font; }
          else { context.fillStyle = 'black'; context.font = regular_font; }
          context.fillText(state, (i+0.5)*PADDLE_WIDTH, 15*display_multiplier, PADDLE_WIDTH);

          if (i == mPos1 || i == mPos2) { context.fillStyle = 'green'; context.font = bold_font; }
          else { context.fillStyle = 'black'; context.font = regular_font; }
          context.fillText(state, (i+0.5)*PADDLE_WIDTH, 590*display_multiplier, PADDLE_WIDTH);

        }
    };

    var update = function () {
        player.update();
        computer.update(ball);
        ball.update(player.paddle, computer.paddle);
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
    }

    Paddle.prototype.render = function () {
        context.fillStyle = "#0000FF";
        context.fillRect(this.x, this.y, this.width, this.height);
    };

    Paddle.prototype.move = function (x, y) {
        this.x += x;
        this.y += y;
        this.x_speed = x;
        this.y_speed = y;
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
            diff = -5;
        } else if (diff > 0 && diff > 4) {
            diff = 5;
        }
        this.paddle.move(diff, 0);
        if (this.paddle.x < 0) {
            this.paddle.x = 0;
        } else if (this.paddle.x + this.paddle.width > 400*display_multiplier) {
            this.paddle.x = 400*display_multiplier - this.paddle.width;
        }
    };

    function Player() {
        this.paddle = new Paddle(0, 560*display_multiplier, PADDLE_WIDTH, 10*display_multiplier);
    }

    Player.prototype.render = function () {
        this.paddle.render();
    };

    Player.prototype.update = function () {
        for (var key in keysDown) {
            var value = Number(key);
            if (value == 37) {
                this.paddle.move(-4*display_multiplier, 0);
            } else if (value == 39) {
                this.paddle.move(4*display_multiplier, 0);
            } else {
                this.paddle.move(0, 0);
            }
        }

        var mPos = this.paddle.x / PADDLE_WIDTH;

        mPos1 = Math.floor(mPos);
        mPos2 = Math.ceil(mPos);
        mPos1Strength = Math.sqrt(mPos - mPos1);
        mPos2Strength = Math.sqrt(mPos2 - mPos);
    };

    function Ball(x, y) {
        this.x = x;
        this.y = y;
        this.x_speed = 0;
        this.y_speed = 3*display_multiplier;
    }

    Ball.prototype.render = function () {
        context.beginPath();
        context.arc(this.x, this.y, 5*display_multiplier, 2 * Math.PI, false);
        context.fillStyle = "#000000";
        context.fill();
    };

    Ball.prototype.update = function (paddle1, paddle2) {
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
            this.x_speed = 0;
            this.y_speed = 3*display_multiplier;
            this.x = 200*display_multiplier;
            this.y = 300*display_multiplier;
        }

        if (top_y > 300*display_multiplier) {
            if (top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
                this.y_speed = -3*display_multiplier;
                this.x_speed += (paddle1.x_speed / 2);
                this.y += this.y_speed;
            }
        } else {
            if (top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
                this.y_speed = 3*display_multiplier;
                this.x_speed += (paddle2.x_speed / 2);
                this.y += this.y_speed;
            }
        }

        var qPos = this.x / PADDLE_WIDTH - 0.5;

        qPos1 = Math.floor(qPos);
        qPos2 = Math.ceil(qPos);
        qPos1Strength = Math.sqrt(qPos - qPos1);
        qPos2Strength = Math.sqrt(qPos2 - qPos);

        if (qPos1 == qPos2) { document.getElementById('ballpos').innerText = qPos1 + ":1" }
        else {
          document.getElementById('ballpos').innerText = qPos1 + ":" + qPos1Strength + " | " + qPos2 + ":" + qPos2Strength;
        }

    };

    document.body.appendChild(canvas);
    animate(step);

    window.addEventListener("keydown", function (event) {
        keysDown[event.keyCode] = true;
    });

    window.addEventListener("keyup", function (event) {
        delete keysDown[event.keyCode];
    });

  }

  componentDidUpdate(oldProps, prevState) {
  }

  render() {
    return <div>Ball Position: <span id="ballpos"></span><canvas id="game"></canvas></div>
  }
}

export default Game;
