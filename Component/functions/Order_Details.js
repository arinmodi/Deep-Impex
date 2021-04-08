import { firestore, database } from '../../config/config';

export const fetch_Order_id = async () => {
    const Order_ref = firestore.collection("Orders");
    var name;
    var wallet;
    var id;
    var remaining;
    var Date
    const upcoming_order_ref = await database.ref('/Upcoming_Order/').once('value').then( snapshot => { return snapshot.val() } )

    if(upcoming_order_ref !== null){
        
        id = await upcoming_order_ref.id;
    
        await Order_ref.doc(id).get().then(
            res => {
                name = res.data().Name,
                wallet = res.data().Wallet,
                remaining = res.data().Remaining_Amount,
                Date = res.data().Date
            }
        )
    
        return {
            id, name, wallet, remaining, Date
        }
    }else {
        return false
    }
}