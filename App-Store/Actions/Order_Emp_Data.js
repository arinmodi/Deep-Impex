import { firestore, database } from '../../config/config';
import { ChangeColorFunction, fetch_User_data } from '../../Component/functions/fetch_order_empdata';

export const EMP_DATA = 'EMP_DATA';
export const status = 'status';

export const set_load = (value) => {
    return { type : status, data : value }
}

export const Set_Emp_Data = (Data) => {
    return { type : EMP_DATA  , Data : Data }
}

export const fetch_emp_data = (id, rem) => {
    const Order_ref = firestore.collection("Orders").doc(id).collection('Employees');

    return function(dispatch){
        Order_ref.onSnapshot( async (data) => {
            var maindata= [];
            var colors = [];
            var number = 1;
            var empdata = [];

            maindata.push ({ y : rem, x : ' ' });
            colors.push('blue');
            if(data.docs.length > 0){
                data.forEach((res) => {
                    var color = ChangeColorFunction(number);
                    maindata.push({
                        color : color,
                        y : res.data().wallet,
                        x : " ",
                        empid : res.id,
                        Debit : res.data().Debit,
                        Purchase : res.data().Total_Purchased
                    }),
                    colors.push(color)
                    number += 1;
                })
    
                empdata = await fetch_User_data(maindata);
                console.log(empdata);
                dispatch(Set_Emp_Data({maindata, colors, empdata}));
                dispatch(set_load(false));
            }else{
                dispatch(Set_Emp_Data({ maindata, colors, empdata }));
                dispatch(set_load(false));
            }
        })
    }
}