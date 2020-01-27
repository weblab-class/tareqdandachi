/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");
const Circuit = require("./models/circuit");
const Challenge = require("./models/challenge");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socket = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});
router.get("/user", (req, res) => {
  User.findById(req.query.userId).then((user) => {
    res.send(user);
  });
});
router.get("/users", (req, res) => {
  User.find({}).then((user) => {
    res.send(user);
  });
});

router.get("/id_from_username", (req, res) => {
  User.findOne({username: req.query.username}).then((user) => {
    res.send(user._id);
  });
});

router.post("/save_user_changes", auth.ensureLoggedIn, (req, res) => {
  User.findById(req.user._id).then((user) => {
    user.name = req.body.name;
    user.description = req.body.desc;
    user.profile_pic = req.body.profile_pic;
            user.save() ;
    res.send(user);
      });
});

router.get("/circuit", (req, res) => {
  Circuit.findById(req.query.circuit_id).then((circuit) => {
    res.send(circuit);
  });
});

router.get("/circuits", (req, res) => {
  Circuit.find({creator_id: req.query.creator_id}).sort( { timestamp: -1 } ).then((circ) => {
    res.send(circ);
  });
});

router.get("/all_circuits", (req, res) => {
  Circuit.find({}).then((circ) => {
    res.send(circ);
  });
});

router.post("/create_circuit", auth.ensureLoggedIn, (req, res) => {
  const newCircuit = new Circuit({
    title: req.body.circuit.title,
    score: -1,
    qasm: req.body.circuit.qasm,
    description: req.body.circuit.description,
    weights: [],
    creator_id: req.user._id,
    creator_name: req.user.name,
    public: false,
  });

  newCircuit.save().then((circuit) => res.send(circuit));
});

router.post("/edit_circuit_title", (req, res) => {
  Circuit.findById(req.body.circuit_id).then((circuit) => {
    circuit.title = req.body.title
    circuit.description = req.body.description
    circuit.timestamp = Date.now();
    circuit.save().then((circuit) => res.send(circuit));
  });
});

router.post("/save_circuit_qasm", auth.ensureLoggedIn, (req, res) => {
  Circuit.findById(req.body.circuit_id).then((circuit) => {
    if (req.body.circuit.creator_id==req.user._id) {
      circuit.qasm = req.body.circuit.qasm;
      circuit.timestamp = Date.now();
      circuit.save() .then((circuit) => res.send(circuit));
    }
      });
});

router.post("/delete_circuit", auth.ensureLoggedIn, (req, res) => {
  Circuit.deleteOne({id: req.body.circuit_id, creator_id: req.user._id}).then((circuit) => {
    res.send(circuit)
      });
});

router.post("/update_score", auth.ensureLoggedIn, (req, res) => {
  Circuit.findById(req.body.circuit_id).then((circuit) => {
    circuit.score = req.body.score;
    circuit.save() .then((circuit) => res.send(circuit));
  });
});

router.get("/high_performers", (req, res) => {
  Circuit.find({ score: { $ne: -1 } }).sort({ score: -1 }).limit(10).then((high_performers) => {
    res.send(high_performers);
  });
});

router.post("/create_challenge", auth.ensureLoggedIn, (req, res) => {
  const newChallenge = new Challenge({
    message: req.body.message,
    creator_id: req.user._id,
    creator_name: req.user.name,
    creator_circuit: req.body.creator_circuit,
    recipient_id: req.body.recipient._id,
    recipient_name: req.body.recipient.name,
    recipient_circuit: req.body.recipient_circuit,
  });

  newChallenge.save().then((challenge) => res.send(challenge));
});

router.get("/active_challenges", (req, res) => {
  Challenge.find({ state: "pending" }).sort( { timestamp: 1 } ).then((challenges) => {
    res.send(challenges);
  });
});

router.get("/completed_challenges", (req, res) => {
  Challenge.find({ state: { $ne: "pending" } }).sort( { timestamp: 1 } ).then((challenges) => {
    res.send(challenges);
  });
});

router.post("/begin_challenge", auth.ensureLoggedIn, (req, res) => {
  // Challenge.findOne({ state: "pending", recipient_id: req.user._id, id: req.body.challengeId }).then((challenge) => {
  //   res.send(challenge);
  // });
  console.log(req.body)
  Challenge.findById(req.body.challengeId).then((challenge) => {
    console.log(challenge)
    res.send(challenge);
  });
});

router.post("/complete_challenge", auth.ensureLoggedIn, (req, res) => {
  const winning_id = (req.body.challenger_win) ? req.body.challenge.creator_circuit._id : req.body.challenge.recipient_circuit._id
  const lose_id = (!req.body.challenger_win) ? req.body.challenge.creator_circuit._id : req.body.challenge.recipient_circuit._id
  Challenge.findById(req.body.challenge._id).then((challenge) => {
    challenge.state = req.body.challenger_win ? "win" : "lose";
    challenge.save();
    Circuit.findById(winning_id).then((winner) => {
      winner.wins += 1;
      winner.games += 1;
      winner.save();
      Circuit.findById(lose_id).then((loser) => {
        loser.games += 1;
        loser.save().then((circuit) => res.send(challenge));
      });
    });
  });
});

router.get("/reject_challenge", auth.ensureLoggedIn, (req, res) => {
  Challenge.deleteOne({ state: "pending", recipient_id: req.user._id, id: req.body.challengeId }).then((challenge) => {
    res.send(challenge);
  });
});

router.get("/all_user_challenges", auth.ensureLoggedIn, (req, res) => {
  Challenge.find({ $or: [ {creator_id: req.user._id}, {recipient_id: req.user._id} ] }).sort( { timestamp: 1 } ).then((challenges) => {
    res.send(challenges);
  });
});

router.post("/search", (req, res) => {

  query_regex = { '$regex' : ".*" + req.body.query + ".*", '$options' : 'i' };

  Circuit.find({ $or: [ {title: query_regex}, {description: query_regex} ] }).sort( { timestamp: 1 } ).then((circuits) => {
    User.find({ $or: [ {username: query_regex}, {name: query_regex}, {description: query_regex} ] }).then((users) => {
      res.send({users: users, circuits: circuits});
    });
  });
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) socket.addUser(req.user, socket.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
