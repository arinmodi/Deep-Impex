import { FETCH_DATA, status } from '../Actions/User_Request';

const intialState = {
    Emp_Request_Data : [],
    Load : true
}




const reducer = (state = intialState , action) => {
    switch(action.type){
        case  FETCH_DATA : 
            return { ...state , Emp_Request_Data: action.Data}

        case status : 
            return { ...state,  Load : action.data }

        default : 
            return state
    }
};


export default reducer;