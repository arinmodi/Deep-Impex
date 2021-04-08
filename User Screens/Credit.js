import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Transfer_Style } from './Transfer';
import { Feather, MaterialCommunityIcons } from '../Icons/icons';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { firestore, f } from '../config/config';
import Grid from '../Component/OrdersGrid';
import { NavigationEvents } from 'react-navigation';
import Load from '../Component/loaddata';
import Header from '../Component/Header';

export default function Credits(props){

    const [ orderdata, setorderdata ] = useState([]); 
    const [ personname, setpersonnames ] = useState([]);
    const [  load, setload ] = useState(true);

    useEffect(() => {
        Fetch_Orders()
    }, []);

    const HistoryUI = (data) => {
        return(
            <Grid 
                uri = {data.item.Image}
                Name = {data.item.Name}
                Date = {data.item.Date}
                NavToBasket = {() => NavToCredit(data.item)}
            />
        )
    }

    const NavToCredit = async (data) => {
        props.navigation.navigate({routeName : 'Credit_Ana', params : {data : data.credits, Name : data.Name, PersonNames : personname, Total : data.Total,id : data.id}})
    }

    const removeduplicate = (data) => {
        return data.filter((value, index) => data.indexOf(value) === index);
    }

    const Fetch_Orders = async () => {

        setorderdata([]); setpersonnames([]);
        const uid = f.auth().currentUser.uid;
        const ref = firestore.collectionGroup('Employees_Credits').where('empid', "==", uid);
        const data = await ref.get();
        const exist = data.docs.length;

        if(exist >= 1){
            var orderarray = [];
            var PersonName = [];
            data.forEach(async res => {
                let creditdata = res.data();
                var credits = [];

                for(var map in creditdata){
                    var object = creditdata[map];
                    if(object.PersonName){
                        credits.push({
                            id : map,
                            PersonName : object.PersonName,
                            Amount : parseFloat(object.Amount),
                            ItemName : object.Name,
                            Unit : object.Unit
                        })
                        PersonName.push(object.PersonName);
                    }
                }

                await firestore.collection('Credits').doc(creditdata.Orderid).get().then(orderdata => {
                    let cdata = orderdata.data();
                    orderarray.push({
                        Date : cdata.Date,
                        Name : cdata.Name,
                        Image : require('../assets/basket7.png'),
                        id : orderdata.id,
                        Total : creditdata.Total,
                        credits : credits
                    })
                })
    
                PersonName = removeduplicate(PersonName);
                console.log(orderarray)
                setorderdata(orderarray); setpersonnames(PersonName);
            })
        }else{
            console.log('Not');
        }

        setload(false);
    }

    const onDataRefresh = async () => {
        const val = props.navigation.getParam('update')
        console.log(val);
        await Fetch_Orders();
        props.navigation.setParams({'update' : false});
    }

    return(
        <View style = {{flex : 1}}>
            <NavigationEvents onDidFocus = {() => props.navigation.getParam('update') === true ? (onDataRefresh()) : console.log('Not update')}/>

            {load === false ? (
                <View style = {{flex : 1}}>
                    <Header 
                        Name = {'Credits'}
                        onPress = {() => props.navigation.toggleDrawer()}
                    />

                    {orderdata.length > 0 ? (
                        <View>
                            <FlatList
                                style={{marginBottom:hp('9%')}}
                                showsVerticalScrollIndicator = {false}
                                numColumns = {2}
                                renderItem={HistoryUI}
                                data={orderdata}
                                keyExtractor = {(item,index)=>index.toString()}
                            />
                        </View>
                    ):(
                        <View style = {{flex : 1,alignItems : 'center',justifyContent : 'center',marginTop : -hp('10%')}}>
                            <MaterialCommunityIcons name="credit-card-clock" size={hp('15%')} color="#A9A9B8" />
                            <Text style = {{fontSize : hp('2.5%'),color : '#A9A9B8',marginTop : hp('2%')}}>No Credits Left</Text>
                        </View>
                    )}
                </View>
            ):(
                <View style = {{flex : 1}}>
                     <Header 
                        Name = {'Credits'}
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
