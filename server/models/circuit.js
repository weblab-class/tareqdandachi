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
});

// compile model from schema
module.exports = mongoose.model("circuit", CircuitSchema);
