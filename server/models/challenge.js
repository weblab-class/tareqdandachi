const mongoose = require("mongoose");

const ChallengeSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  recipient_id: String,
  recipient_name: String,
  creator_id: String,
  creator_name: String,
  message: String,
  state: { type: String, default: "pending" },
  recipient_circuit: {
    _id: String,
    title: String,
    qasm: String,
  },
  creator_circuit: {
    _id: String,
    title: String,
    qasm: String,
  },
});

// compile model from schema
module.exports = mongoose.model("challenge", ChallengeSchema);
