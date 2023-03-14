const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    img: {
      type: String,
    },
    fromGoogle: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);


let User = mongoose.model('User',UserSchema)


module.exports = User