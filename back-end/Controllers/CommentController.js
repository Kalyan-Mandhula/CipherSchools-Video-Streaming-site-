const createError = require("../Error")
const Comment = require("../Models/CommentsModel")
const Video = require("../Models/VideoModel")

 const AddComment = async (req, res, next) => {
  try {
    const newComment = new Comment({ ...req.body, user: req.user });
    await newComment.save();
    res.status(200).send(newComment);
  } catch (err) {
    next(err);
  }
};

const ReplyForComment = async (req, res, next) => {
    try {
      let newComment = new Comment({ ...req.body, user: req.user , isReply : true});
      await newComment.save()
      let comment = await Comment.findByIdAndUpdate(req.params.id,{$push : { replies : { $each: [newComment], $position: req.params.index } } } ,{new:true})
      res.status(200).send(comment);
    } catch (err) {
      next(err);
    }
  };

 const DeleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(res.params.id);
    const video = await Video.findById(res.params.VideoId);
    if (req.user._id === comment.user._id || req.user._id === video.user._id) {
      await Comment.findByIdAndDelete(req.params.id);
      res.status(200).json("The comment has been deleted.");
    } else {
      return next(createError(403, "You can delete ony your comment!"));
    }
  } catch (err) {
    next(err);
  }
};

 const GetComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId }).populate({
      path: 'replies',
      populate: {
        path: 'user',
        model: 'User'
      }}
    ).populate("user")
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};


module.exports = {AddComment,ReplyForComment,DeleteComment,GetComments}