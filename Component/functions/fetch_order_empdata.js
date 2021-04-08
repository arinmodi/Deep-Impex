import { firestore, database } from '../../config/config';

export const ChangeColorFunction = (number) => {
    var ColorCode;

    switch(number){
        case 1 : return ( ColorCode = "#5DFC0A" );
        case 2 : return ( ColorCode = "#19FBED" );
        case 3 : return ( ColorCode = "#FFD700" );
        case 4 : return ( ColorCode = "#FFC900" );
        case 5 : return ( ColorCode = "#951CCA" );
        case 6 : return ( ColorCode = "#5D8AA8" );
        case 7 : return ( ColorCode = "#F4C2C2" );
        case 8 : return ( ColorCode = "#FAF0BE" );
        case 9 : return ( ColorCode = "#fe01b1" );
        case 10 : return ( ColorCode = "#d1e231" );
        case 11 : return ( ColorCode = "#ead8bb" );
        case 12 : return ( ColorCode = "#fbdd7e" );
        case 13 : return ( ColorCode = "#FF007C" );
        case 14 : return ( ColorCode = "#FFEB00" );
        case 15 : return ( ColorCode = "#FA5B3D" );
        case 16 : return ( ColorCode = "#FFA62F" );
        case 17 : return ( ColorCode = "#C88141" );
        case 18 : return ( ColorCode = "#FFCBA4" );
        case 19 : return ( ColorCode = "#E8A317" );
        case 20 : return ( ColorCode = "#f3cd98" );
        case 21 : return ( ColorCode = "#493D26" );
        case 22 : return ( ColorCode = "#B38481" );
        case 23 : return ( ColorCode = "#F9B7FF" );
        case 24 : return ( ColorCode = "#893BFF" );
        case 25 : return ( ColorCode = "#F433FF" );
        case 26 : return ( ColorCode = "#6CC417" );
        case 27 : return ( ColorCode = "#50EBEC" );
        case 28 : return ( ColorCode = "#151B54" );
        case 29 : return ( ColorCode = "#34282C" );
        case 30 : return ( ColorCode = "#3EA99F" );
    }
    
    return ColorCode;
}

export const fetch_User_data = async (maindata) => {
    var empdata = [];
    const ref = database.ref('Accepted_Employee');
    
    await ref.once('value').then(snapshot => {
        snapshot.forEach(data => {
            maindata.forEach(element => {
                if(data.key === element.empid){
                    var name = data.val().UserName;
                    var UserName = name.split(" ");
                    UserName = UserName[0];
                    empdata.push({
                        name: UserName,
                        image : data.val().ProfileImage,
                        y : element.y,
                        color : element.color,
                        Debit : element.Debit,
                        empid : element.empid,
                        Purchase : element.Purchase
                    })
                }
            })
        })
    })

    return empdata;
}


export const fetch_emp_data = async (id) => {
    const Order_ref = firestore.collection("Orders").doc(id).collection('Employees');
    const snapshot = await Order_ref.get().then(snapshot => { return snapshot  });

    
    if(snapshot.docs.length > 0){
        var maindata= [];
        var colors = [];
        var number = 1;
        snapshot.docs.forEach(async res =>{
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

        const empdata = await fetch_User_data(maindata);
        return {  maindata, colors, empdata }
    }else{
        return false;
    }
}