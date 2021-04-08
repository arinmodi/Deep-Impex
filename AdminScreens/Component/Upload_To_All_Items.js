import { firestore } from '../../config/config';

const s4 = () => {
    return Math.floor((1+Math.random())* 0x10000).toString(16).substring(1)
}
  
const uniqueid = (ItemName) => {
    console.log('Add2')
    return ItemName + '-' + s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + '-' + s4() + '-' + s4();
}


export default async function Upload_Data_To_All_Items(Image_URL,ItemName, Quantity, id, Annonation, addby,unit){
    const ref = firestore.collection('Orders').doc(id);
    const item_id = uniqueid(ItemName);
    console.log(Quantity);
    var item = {};
    if(addby === 'admin'){
        item = {
            Name : ItemName,
            Quantity : parseFloat(Quantity),
            Image : Image_URL,
            Annonation : Annonation,
            Unit : unit
        }
    }else{
        console.log('Called', addby)
        item = {
            Name : ItemName,
            Quantity : parseFloat(Quantity),
            Image : Image_URL,
            Annonation : Annonation,
            ADDBY : addby,
            Unit : unit
        }
    }

    const doc = ref.collection('Items').doc('All_Items');
    await doc.get().then(snapshot => {
        console.log(snapshot.exists)
        if(snapshot.exists){
            doc.update({ [item_id] : item });
        }else{
            doc.set({ [item_id] : item })
        }
    })
} 