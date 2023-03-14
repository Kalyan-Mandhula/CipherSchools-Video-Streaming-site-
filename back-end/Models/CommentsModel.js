
const mongoose = require("mongoose")

const CommentSchema = new mongoose.Schema(
  {
    user: {
      type : mongoose.Schema.Types.ObjectId , 
      ref: 'User',
      required: true,
    },
    videoId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    replies : [{type : mongoose.Schema.Types.ObjectId , ref: 'Comment'}],
    isReply :{
      type: Boolean ,
      default:false 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);