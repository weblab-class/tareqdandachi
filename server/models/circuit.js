const mongoose = require("mongoose");

const CircuitSchema = new mongoose.Schema({
  title: String,
  timestamp: { type: Date, default: Date.now },
  score: Number,    // The score is multiplied by 100 when saved to the database,
                    // a score of -1 means the circuit hasn't been graded
  qasm: String,
  weights: [String],
  creator_id: String,
  creator_name: String,
  public: { type: Boolean, default: true },
  description: String,
  stars: { type: Number, default: 0 },
  star_givers: {type: [String], default: []},
  games: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  parsed: { type: Boolean, default: false },
});

// compile model from schema
module.exports = mongoose.model("circuit", CircuitSchema);
