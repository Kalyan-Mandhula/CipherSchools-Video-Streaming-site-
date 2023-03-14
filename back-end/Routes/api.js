const express = require("express")
const app = express()

const UserRoutes = require("./UserRoutes")
const VideoRoutes = require("./VideoRoutes")
const CommentRoutes = require("./CommentRoutes")


app.get("/logout",(req,res)=>{
    return res.clearCookie("access_token").send("Logged out")
})


app.use("/users",UserRoutes)
app.use("/videos",VideoRoutes)
app.use("/comments",CommentRoutes)

module.exports = app