const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  skill: String,
  googleid: String,
  circuits: [{
    _id: String,
    title: String,
  }],
  description: {type: String, default: "I am new to QuPong, see me build some cool circuits!"},
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
