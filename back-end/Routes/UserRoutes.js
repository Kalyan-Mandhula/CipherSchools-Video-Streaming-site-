const express = require("express")
const router = express.Router()

const {Register,Login,GetUser,UpdateUser,DeleteUser} = require("../Controllers/UserController")
const CheckLogin = require("../Middlewares/CheckLogin")

//register user
router.post("/register",Register)

//login user
router.post("/login",Login)

//update user
router.put("/:id",CheckLogin,UpdateUser)

//delete user
router.delete("/:id",CheckLogin,DeleteUser)

//get user by id
router.get("/:id",CheckLogin,GetUser)


module.exports = router