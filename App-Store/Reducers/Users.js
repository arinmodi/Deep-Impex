import { USER_DATA, STATUS } from '../Actions/Users';

const intialState = {
    User_Data : [],
    done : true
}


const Userreducer = (state = intialState , action) => {
    switch(action.type){
        case  USER_DATA : 
            return { ...state , User_Data: action.Data}

        case STATUS : 
            return { ...state, done : action.data }

        default : 
            return state
    }
};


export default Userreducer;