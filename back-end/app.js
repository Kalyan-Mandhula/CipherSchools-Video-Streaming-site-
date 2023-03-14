
const {createServer} = require("http")
const {Server} = require("socket.io")
const express = require("express")
const app = express()

const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv")
dotenv.config()

// MongoDB connection
const connectDB = ()=>{
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser:true ,
        useUnifiedTopology :true
    }).then((res)=>console.log("Database connected")).catch((err)=>console.log("Mongo Error"))
}
connectDB()


//utils
app.use(express.json())
app.use(cookieParser())

const httpServer = createServer(app)
global.io =new Server(httpServer)
module.exports = io

io.on("connection",(socket)=>{
  // socket.on("user is active",(mssg)=>{
  //   socket.emit("server sends a mssg","Hello User")
  // })
})



// Api routes
const ApiRoutes =require("./Routes/api")
app.use("/api",ApiRoutes)

app.get("/",(req,res)=>{
    res.send("HomePage")
})


// Error handler
app.use((error,req,res,next)=>{
    if(process.env.NODE_ENV==="development"){
      res.status(500).json({
        message : error.message,
        stack : error.stack
      })
    }else{
      res.status(500).json({
        message : error.message,
      })
    }
  })

httpServer.listen(5000,()=>{
  console.log("httpserver listening")
})