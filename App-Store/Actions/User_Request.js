import { set } from 'react-native-reanimated';
import { database } from '../../config/config';

export const FETCH_DATA = 'FETCH_DATA';
export const status = 'status';

export const set_load = (value) => {
    return { type : status, data : value }
}


export const Set_Emp_Data = (Emp_Data) => {
    console.log("Action Called")
    return { type : FETCH_DATA , Data : Emp_Data }
}

export const Fetch_Emp_Data = () => {
    console.log('hello2')
    const Store_Data = ( Emp_Request_Data,data,Request, dispatch ) => {
        var Emp_Obj = data[Request]
        database.ref('Requests').once('value').then(
            function(snapshot){
                const exists = (snapshot.val !== null);
                if(exists) data = snapshot.val();
                console.log('hello3')
                Emp_Request_Data.push({
                    ProfileImage : Emp_Obj.ProfileImage,
                    PhoneNumber : Emp_Obj.PhoneNumber,
                    UserName : Emp_Obj.UserName,
                    Email : Emp_Obj.Email,
                    DeviceToken : Emp_Obj.DeviceToken,
                    uid : Request
                })

                dispatch(Set_Emp_Data(Emp_Request_Data));
                dispatch(set_load(false));
            }
        )
    }


    return function(dispatch){
        database.ref('Requests').on('value',
            function(snapshot){
                console.log("find")
                const exists = (snapshot.val() !== null);
                console.log(exists)
                const Emp_Request_Data = [];
                if(exists){ 
                    var data = snapshot.val();
                    console.log('hello1')
                    for(var Request in data){
                        Store_Data( Emp_Request_Data,data,Request, dispatch )
                    }
                }else {
                    console.log('Hello3');
                    dispatch(Set_Emp_Data(Emp_Request_Data));
                    dispatch(set_load(false));;

                }
                }
            ),function(error){
                console.log(error)
            }
        }
    }
