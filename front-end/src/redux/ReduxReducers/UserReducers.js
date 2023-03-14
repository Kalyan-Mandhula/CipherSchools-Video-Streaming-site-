const UserReducer = (state = {} , action)=>{
    switch(action.type){
        case "Login_User" : 
        return {...action.payload}
        case "Logout_User" :
            return {}
        default :
        return state
    }
}

export default UserReducer