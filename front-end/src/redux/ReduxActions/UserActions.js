import axios from "axios"

export const UserLogin = (UserDetails)=>(dispatch)=>{
    dispatch({
        type : "Login_User" ,
        payload : UserDetails
    })
}

export  const UserLogout =()=>async (dispatch)=>{
    await axios.get("/api/logout")
    sessionStorage.removeItem("User")
    localStorage.removeItem("User")
    dispatch({
        type :"Logout_User"
    })
    window.location.href ="/login"
}



