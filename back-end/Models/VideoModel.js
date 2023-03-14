const mongoose = require("mongoose")
let io = require("../app")

const VideoSchema = new mongoose.Schema(
  {
    user: {
      type : mongoose.Schema.Types.ObjectId , 
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    views: {
      type: [String],
      default: 0,
    },
    likes: {
      type: [String],
      default: [],
    }
  },
  { timestamps: true }
);

let Video = mongoose.model('Video',VideoSchema)


Video.watch().on("change",(data)=>{
   if(data.operationType === "insert"){
  io.emit("VideoAdded",{...data})
}
})

module.exports = Video