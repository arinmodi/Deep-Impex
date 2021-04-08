import { database } from '../../config/config';

export const Chat = "Chat";

export const set_chats = (data) => {
    return { type : Chat, data : data }
}

export const Fetch_Chats = () => {
    return function(dispatch){
        database.ref("Chats").orderByChild("timestamp").limitToLast(100).on("value" , (data) => {
            var chats = [];
            data.forEach(chat => {
                let chat_data = chat.val();
                chats.push({
                    _id : chat.key,
                    text: chat_data.Message,
                    createdAt : chat_data.timestamp,
                    user : {
                        _id : chat_data.empid,
                        name : chat_data.name,
                    }
                })
            });
            chats.reverse();
            console.log(chats)
            dispatch(set_chats(chats));
        })
    }
}