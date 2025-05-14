const Counter = require("../models/Counter");

async function autoIncrement(modelName, doc) {
  const counter = await Counter.findOneAndUpdate(
    { model: modelName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );

  doc.autoIncrementId = counter.sequence_value;
}

module.exports = autoIncrement;
