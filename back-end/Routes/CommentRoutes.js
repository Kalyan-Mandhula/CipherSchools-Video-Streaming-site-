const express = require("express")
const router = express.Router()
const CheckLogin = require("../Middlewares/CheckLogin")

const {AddComment,ReplyForComment,DeleteComment,GetComments} = require("../Controllers/CommentController")

router.post("/", CheckLogin, AddComment)
router.post("/:id",CheckLogin,ReplyForComment)
router.delete("/:id/:VideoId", CheckLogin, DeleteComment)
router.get("/:videoId", GetComments)



module.exports = router