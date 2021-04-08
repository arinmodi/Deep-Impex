import { Chat } from '../Actions/Chats';

const intialState = {
    Chats : []
}


const Chat_reducer = (state = intialState , action) => {
    switch(action.type){
        case  Chat : 
            return { ...state , Chats: action.data}

        default : 
            return state
    }
};


export default Chat_reducer;