import { NEWS_DATA,status } from '../Actions/News';

const intialState = {
    News_Data : [],
    Load : true
}


const Newsreducer = (state = intialState , action) => {
    switch(action.type){
        case  NEWS_DATA : 
            return { ...state , News_Data: action.Data}

        case status : 
            return { ...state,  Load : action.data }

        default : 
            return state;
    }
};


export default Newsreducer;