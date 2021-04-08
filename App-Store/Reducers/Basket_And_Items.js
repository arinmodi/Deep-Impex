import { Orders_Basket,Baskets_Load,Items_Load,Pending_Items_Load } from '../Actions/Basket_And_Items';
import { Basket_Items,Pending_Items } from '../Actions/Basket_And_Items';


const intialState = {
    Basket_Data : [],
    Basket_Item_Data : [],
    Pending : [],
    Load_Basket : true,
    Load_Items : true,
    Load_Pending_Items : true
}

const Basket_reducer = (state = intialState , action) => {
    switch(action.type){
        case  Orders_Basket : 
            return { ...state , Basket_Data : action.Data}

        case Basket_Items : 
            return {...state, Basket_Item_Data : action.Data}

        case Pending_Items : 
            return {...state, Pending : action.Data}

        case Baskets_Load : 
            return {...state, Load_Basket : action.data}

        case Items_Load : 
            return {...state, Load_Items : action.data}
        
        case Pending_Items_Load : 
            return {...state, Load_Pending_Items : action.data}

        default : 
            return state
    }
};


export default Basket_reducer;