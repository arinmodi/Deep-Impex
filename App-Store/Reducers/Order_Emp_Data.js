import { EMP_DATA,status } from '../Actions/Order_Emp_Data';

const intialState = {
    Status_Data : {},
    Load : true
}


const Order_status_reducer = (state = intialState , action) => {
    switch(action.type){
        case  EMP_DATA : 
            return { ...state , Status_Data: action.Data}

        case status : 
            return { ...state,  Load : action.data }

        default : 
            return state;
    }
};


export default Order_status_reducer;