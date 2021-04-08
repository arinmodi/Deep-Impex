import { firestore } from '../../config/config';

export const Orders_Basket = 'Orders_Basket';
export const Basket_Items = 'Basket_Item';
export const Pending_Items = 'Pending_Items';

export const Baskets_Load = 'Baskets_Load';
export const Items_Load = 'Items_Load';
export const Pending_Items_Load = 'Pending_Items_Load';


export const Set_Basket_Load = (value) => {
    return { type :  Baskets_Load, data : value }
}

export const Set_Items_Load = (value) => {
    return { type :  Items_Load, data : value }
}

export const Set_Pending_Items_Load = (value) => {
    return { type :  Pending_Items_Load, data : value }
}


export const Set_Orders_Basket_Data = (Basket_Data) => {
    return { type : Orders_Basket, Data : Basket_Data }
}

export const Fetch_Orders_Basket_Data = (days) => {

    var today = new Date();
    var selecteddate = new Date();
    selecteddate.setDate(selecteddate.getDate() - days )
    const ref = firestore.collection('Orders').where('Date', ">" , selecteddate).orderBy('Date', 'desc');
    return function(dispatch){
        dispatch(Set_Basket_Load(true));
        ref.onSnapshot((snapshot) => {
            const baskets_arr = [];
            var srno = 0;
            snapshot.docs.forEach(res => {
                let basket = res.data();
                console.log("Called Create" + srno)
                baskets_arr.push({
                    Name : basket.Name,
                    Date : basket.Date,
                    Wallet : basket.Wallet,
                    Remaining : basket.Remaining_Amount,
                    id : res.id,
                })
                srno += 1;
            })
            console.log(baskets_arr);
            dispatch(Set_Orders_Basket_Data(baskets_arr));
            dispatch(Set_Basket_Load(false));
        })
    }
}

export const Set_Basket_Items_Data = (Items_Data) => {
    return { type : Basket_Items, Data : Items_Data }
}

export const Fetch_Basket_Items_Data = (id) => {

    const ref = firestore.collection('Orders').doc(id).collection('Items').doc('All_Items');
    var Items_arr = [];
    console.log('Called1')
    return function(dispatch){
        ref.onSnapshot((snapshot) => {
            dispatch(Set_Items_Load(true));
            if(snapshot.exists){
                var Items = [];
                var data = snapshot.data();
                for(var document in snapshot.data()){
                    var object = data[document];
                    if(object.Rate){
                        Items.push({
                            id : document,
                            Name : object.Name,
                            Quantity : object.Quantity,
                            Image : object.Image,
                            Annonation : object.Annonation,
                            Rate : object.Rate,
                            Debit : object.Debit,
                            Credit : object.Credit,
                            empid : object.empid,
                            PersonName : object.PersonName,
                            Unit : object.Unit
                        })
                    }else {
                        Items.push({
                            id : document,
                            Name : object.Name,
                            Quantity : object.Quantity,
                            Image : object.Image,
                            Annonation : object.Annonation,
                            ADDBY : object.ADDBY,
                            Unit : object.Unit
                        })
                    }
                }
                dispatch(Set_Basket_Items_Data(Items_arr.concat(Items)));
                dispatch(Set_Items_Load(false));
            }else {
                dispatch(Set_Basket_Items_Data(Items_arr));
                dispatch(Set_Items_Load(false));
            }
        })
    }
};

export const Set_Pending_Items_Data = (Items_Data) => {
    return { type : Pending_Items, Data : Items_Data }
}

export const Fetch_Pending_Items = () => {
    const ref = firestore.collection('Pending_Items').orderBy("Date");
    return function(dispatch){
        ref.onSnapshot((snapshot) => {
            dispatch(Set_Pending_Items_Load(true));
            var Pending_Items = [];
            if(snapshot.docs.length > 0){
                snapshot.docs.forEach(doc => {
                    var data = doc.data();
                    Pending_Items.push({
                        id : doc.id,
                        Name : data.Name,
                        Quantity : data.Quantity,
                        Image : data.Image,
                        Date : data.Date,
                        Unit : data.Unit
                    })
                })
            }
            dispatch(Set_Pending_Items_Data(Pending_Items));
            dispatch(Set_Pending_Items_Load(false));
        })
    }
}


