const express = require("express")
const CheckLogin = require("../Middlewares/CheckLogin")
const router = express.Router()

const {AddVideo,UpdateVideo,DeleteVideo,GetVideo,UpdateViews,UpdateLikes,SearchVideo,GetAllVideos,GetMyVideos}= require("../Controllers/VideoController")

router.post("/", CheckLogin, AddVideo)
router.put("/:id", CheckLogin, UpdateVideo)
router.delete("/:id", CheckLogin, DeleteVideo)
router.put("/view/:id", UpdateViews)
router.put("/like/:id",CheckLogin,UpdateLikes)
router.get("/find/:id", GetVideo)
router.get("/search/:text", SearchVideo)
router.get("/GetMyVideos/:id",GetMyVideos)
router.get("/",GetAllVideos)


module.exports = router