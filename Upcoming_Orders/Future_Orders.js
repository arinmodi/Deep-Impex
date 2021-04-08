import React, { useEffect, useState } from 'react';
import {  View, Text, FlatList } from 'react-native';
import { styles } from '../AdminScreens/Component/styles';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Feather, MaterialCommunityIcons } from '../Icons/icons';
import Grid from '../Component/OrdersGrid';
import { firestore } from '../config/config';
import { Render } from '../Component/Unique_Image';
import moment from 'moment';
import Load from '../Component/loaddata';
import Header from '../Component/Header';

export const Future_Order_Fetch = async () => {
    var orderdata = [];
    const date = new Date();
    const ref = firestore.collection('Orders').where('Date', '>' , date);

    await ref.get().then(data => {
        data.forEach(res => {
            let doc = res.data();
            var image = Render();
            if(moment(date).format('DD/MM/YYYY') !== moment(doc.Date.toDate()).format('DD/MM/YYYY')){
                orderdata.push({
                    id : res.id,
                    Date : doc.Date,
                    Name : doc.Name,
                    wallet : doc.Wallet,
                    Image : image
                })
            }
        })
    })

    console.log(orderdata);

    return orderdata;
};

export default function Future_Orders(props){

    const [data, setdata] = useState([]);
    const [  load, setload ] = useState(true);

    const RenderUI = (data) => {
        return(
            <Grid 
                uri = {data.item.Image}
                Name = {data.item.Name}
                Date = {moment(data.item.Date.toDate()).format('DD/MM/YYYY')}
                NavToBasket = {() => props.navigation.navigate({ routeName : 'Items', params : { data : data.item }})}
            />
        )
    };

    useEffect(() => {
        Save_Data();
    }, [])

    const Save_Data = async () => {
        setdata([]);
        var data = await Future_Order_Fetch();
        setdata(data);
        setload(false);
    }

    return(
        <View style = {{flex : 1}}>

            {load === false ? (
                <View style = {{flex  : 1}}>
                    <Header 
                        Name = {'Orders'}
                        onPress = {() => props.navigation.toggleDrawer()}
                    />

                    {data.length > 0 ? (
                        <View>
                            <FlatList
                                style={{marginBottom:hp('9%')}}
                                numColumns = {2}
                                renderItem={RenderUI}
                                data={data}
                                keyExtractor = {(item,index)=>index.toString()}
                                showsVerticalScrollIndicator = {false}
                            />
                        </View>
                    ):(
                        <View style = {{flex : 1,alignItems : 'center',justifyContent : 'center',marginTop : -hp('10%')}}>
                            <MaterialCommunityIcons name="truck-check" size={hp('12%')} color="#A9A9B8" />
                            <Text style = {{fontSize : hp('2.5%'),color : '#A9A9B8',marginTop : hp('2%')}}>No Orders Found</Text>
                        </View>
                    )}
                </View>
            ):(
                <View style = {{flex : 1}}>
                    <Header 
                        Name = {'Orders'}
                        onPress = {() => props.navigation.toggleDrawer()}
                    />
                    <Load 
                        style = {{flex : 1,marginTop : -hp('10%')}}
                    />
                </View>
            )}
        </View>
    )
}