const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Creating UserSchema
const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  name: String,
  password: String,
  isSeller: {
    type: Boolean,
    default: false
  },
  address: {
    addr1: String,
    addr2: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated : {
    type: Date,
    default: Date.now

  }
});

module.exports = mongoose.model("User", UserSchema);