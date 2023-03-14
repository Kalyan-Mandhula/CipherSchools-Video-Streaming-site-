

export const Mssgs = (mssg)=>(dispatch)=>{
    dispatch({
        type : "NewMssg" ,
        payload : mssg
    })
}