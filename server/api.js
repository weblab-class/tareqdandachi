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

router.get("/circuit", (req, res) => {
  Circuit.findById(req.query.circuit_id).then((circuit) => {
    res.send(circuit);
  });
});

router.get("/circuits", (req, res) => {
  Circuit.find({creator_id: req.query.creator_id}).then((circ) => {
    res.send(circ);
  });
});

router.get("/all_circuits", (req, res) => {
  Circuit.find({}).then((circ) => {
    res.send(circ);
  });
});

router.post("/create_circuit", auth.ensureLoggedIn, (req, res) => {
  console.log(req.circuit, "REQ")
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
