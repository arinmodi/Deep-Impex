import { firestore } from '../../config/config';

export const NEWS_DATA = 'NEWS_DATA';
export const status = 'status';

export const set_load = (value) => {
    return { type : status, data : value }
}

export const Set_News_Data = (Data) => {
    return { type : NEWS_DATA  , Data : Data }
}

export const Fetch_News_Data = () => {
    var selecteddate = new Date();
    return function(dispatch){
       const ref = firestore.collection('News').where('Date', '>=', selecteddate);
       ref.onSnapshot(data => {
           var newsdata = [];
           data.forEach(res => {
               let doc = res.data();
               newsdata.push({
                   Date : doc.Date,
                   Image : doc.Image,
                   Name : doc.Name,
                   Quantity : doc.Quantity,
                   annonation : doc.annonation,
                   id : res.id,
                   Unit : doc.Unit
               })
           })
           console.log(newsdata)
           dispatch(Set_News_Data(newsdata));
           dispatch(set_load(false));
       })
    }
}