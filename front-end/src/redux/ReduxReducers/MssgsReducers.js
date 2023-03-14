
const MssgReducer = (mssgs = [] , action)=>{
    switch(action.type){
        case "NewMssg" : 
           mssgs.push(action.payload)
        return mssgs
        default :
        return mssgs
    }
}

export default MssgReducer