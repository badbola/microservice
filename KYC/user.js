const mongoose = require("mongoose");

const availabilty = mongoose.Schema({
  date: {
    type: Date,
  },
});

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  first: {
    type: String,
    require: true,
  },
  last: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  date: [availabilty],
});

module.exports = mongoose.model("user", userSchema);
