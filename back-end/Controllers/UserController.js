const User = require("../Models/UserModel")
const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")
const createError = require("../Error")

const Register = async(req,res,next)=>{
    try{
        let {email} = req.body
        let checkUser = await User.findOne({email})
        if(!checkUser){
            const hashedPassword = bcrypt.hashSync(req.body.password,10)
            let newUser = new User({...req.body , password : hashedPassword}) 
            await newUser.save()

            let cookieParams = {
                httpOnly :true,
                sameSite :"strict"
            }

            let token = JWT.sign({email : newUser.email,_id : newUser._id, name : newUser.name},process.env.JWT_STRING)
    res.cookie("access_token",token,cookieParams).json({
        success : true ,
        User : {_id : newUser._id ,
         name : newUser.name ,
         email : newUser.email} 
     })
            
        }else{
            res.send("User with mail already exists")
        }
        
    }catch(err){
        next(err)
    }
}

const Login = async(req,res,next)=>{
    try{
    const {email,password,doNotLogout} = req.body
    let checkUser = await User.findOne({email})

    if(!checkUser){
       return next(createError(500,"User not found"))
    }
    let validateUser = await bcrypt.compare(password,checkUser.password)
    if(!validateUser){
       return next(createError(500,"Wrong credentials"))
    }

    let cookieParams = {
        httpOnly :true,
        sameSite :"strict"
    }

    if(doNotLogout){
        cookieParams = {...cookieParams , maxAge : 1000*60*60*24*7}
    }
    
    let token = JWT.sign({email : checkUser.email,_id : checkUser._id, name : checkUser.name},process.env.JWT_STRING)
    res.cookie("access_token",token,cookieParams).json({
        success : true ,
        User : {_id : checkUser._id ,
         name : checkUser.name ,
         email : checkUser.email} 
     })

        
    }catch(err){
        next(err)
    }
}

const GetUser = async(req,res,next)=>{
    try{
       let user = await User.findById(req.params.id)
       if(!user){
        return next(createError(500,"User not found"))
       }
       res.json(user)
    }catch(err){
        next(err)
    }

}

const UpdateUser = async(req,res,next)=>{
    try{   
        
    if(req.params.id === req.user._id){
        let user = await User.findByIdAndUpdate(req.params.id,{ $set : {...req.body , password : bcrypt.hashSync(req.body.password,10)}},{new : true})
        res.json( {
            User : {_id : user._id ,
                name : user.name ,
                email : user.email} 
        })
    }else{
         return next(createError(500,"You can edit only your account"))
    }     
    }catch(err){
        next(err)
    }
}

const DeleteUser = async(req,res,next)=>{
    try{        
        // to-do delete videos uploaded by user
        await User.findByIdAndDelete(req.params.id)
        res.send("user deleted")
    }catch(err){
        next(err)
    }

}

module.exports = {Register,Login,GetUser,UpdateUser,DeleteUser}