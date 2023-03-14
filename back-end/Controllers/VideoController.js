const User = require("../Models/UserModel");
const Video = require("../Models/VideoModel");
const createError = require("../Error");
const Mongoose = require("mongoose")



const AddVideo = async (req, res, next) => {
  try {
    const newVideo = new Video({ user: req.user, ...req.body });
    await newVideo.save();
    res.status(200).json(newVideo);
  } catch (err) {
    next(err);
  }
};

const UpdateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id).populate("user")
    if (!video) return next(createError(404, "Video not found!"));
    if (req.user._id == video.user._id) {
      const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedVideo);
    } else {
      return next(createError(403, "You can update only your video!"));
    }
  } catch (err) {
    next(err);
  }
};

const DeleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found!"));
    if (req.user._id == video.user._id) {
      await Video.findByIdAndDelete(req.params.id);
      res.status(200).json("The video has been deleted.");
    } else {
      return next(createError(403, "You can delete only your video!"));
    }
  } catch (err) {
    next(err);
  }
};

const GetVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id).populate("user").populate("views")
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

const UpdateViews = async (req, res, next) => {
  try {
    let video = await Video.findByIdAndUpdate(req.params.id).populate("views").populate("user")
    let viewed = video.views.find((id)=>req.body.userId == id)
    if(!viewed){
      video.views.push(req.body.userId+"")
     await video.save()
    }
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

const UpdateLikes = async (req, res, next) => {
    try {
      let liked = req.body.liked
      let videoId = req.params.id
      let video =" {}"
      if(liked){
      video = await Video.findByIdAndUpdate(videoId).populate("user").populate("views")
      video.likes.push(req.user._id)
      await video.save()
      }else{
       video = await Video.findByIdAndUpdate(videoId,{
            $pull:{likes:req.user._id}
          },{new:true}).populate("user")
      }
      res.status(200).json(video);
    } catch (err) {
      next(err);
    }
  };

const SearchVideo = async (req, res, next) => {
  const query = req.params.text;
  try {
    const videos = await Video.find({
      title: { $regex: query, $options: "i" },
    }).populate("user")
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

const GetAllVideos = async (req, res, next) => {
    try {
      const videos = await Video.find({}).populate("user")
      res.status(200).json(videos);
    } catch (err) {
      next(err);
    }
  };

const GetMyVideos = async (req, res, next) => {
  try {
    const videos = await Video.find({user : req.params.id}).populate("user")
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  AddVideo,
  UpdateVideo,
  DeleteVideo,
  GetVideo,
  UpdateViews,
  UpdateLikes,
  SearchVideo,
  GetAllVideos,
  GetMyVideos
};
