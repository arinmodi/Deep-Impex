import { database } from '../../config/config';

export const USER_DATA = 'USER_DATA';
export const STATUS = "STATUS";

export const Set_User_Data = (Data) => {
    return { type : USER_DATA  , Data : Data }
}

export const Done = (value) => {
    return { type : STATUS , data : value }
}

export const Fetch_User_Data = () => {
   return function(dispatch){
        database.ref('Accepted_Employee').orderByChild('UserName').on('value',
            function(snapshot){
                const exists = (snapshot.val() !== null);
                const Users = [];
                if(exists){ 
                    snapshot.forEach((data) => {
                        let user = data.val();
                        var name = user.UserName;
                        var UserName = name.split(" ");
                        UserName = UserName[0];
                        var l_name = UserName[1] ? name.substr(name.indexOf(' ') + 1) : '';
                        l_name = l_name === UserName ? '' : l_name;
                        Users.push({
                            uid : data.key,
                            ProfileImage : user.ProfileImage,
                            UserName : UserName,
                            L_Name : l_name,
                            Active : user.Active
                        })
                    })

                    console.log('user')
                    dispatch(Set_User_Data(Users));
                    dispatch(Done(false));
                    
                }else {
                    console.log('Hello3');
                    dispatch(Set_User_Data(Users));
                    dispatch(Done(false));
                }
                }
            ),function(error){
                console.log(error)
            }
        }
    }