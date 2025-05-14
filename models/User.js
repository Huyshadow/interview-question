const mongoose = require("mongoose");
const autoIncrement = require("../middleware/autoIncrement");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  autoIncrementId: { type: Number, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    await autoIncrement("User", this);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
