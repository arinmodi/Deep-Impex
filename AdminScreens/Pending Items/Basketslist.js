import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableNativeFeedback, FlatList } from 'react-native';
import { Card } from 'react-native-paper';
import { fetch_Order_id } from '../../Component/functions/Order_Details';
import { Future_Order_Fetch } from '../../Upcoming_Orders/Future_Orders';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { styles as header } from '../Component/styles';
import { styles as item } from '../../Component/BasketItemGrid';
import moment from 'moment';
import Grid from '../../Component/OrdersGrid';
import Load from '../../Component/loaddata';
import SubHeader from '../../Component/SubScreenHeader';

export default function BasketList(props){

    const [ currentorder, setcurrentorder ] = useState({});
    const [ data, setdata ] = useState([]);
    const [load,setload] = useState(true);
    const itemdata = props.navigation.getParam('data');

    useEffect(() => {
        Fetch_Details();
    }, []);

    const Fetch_Details = async () => {
        const details = await fetch_Order_id();
        if(details !== false){
            setcurrentorder({
                id : details.id,
                Name : details.name,
                Date : details.Date
            })
        };
        setdata([]);
        var data = await Future_Order_Fetch();
        setdata(data);
        setload(false);
    }

    const RenderUI = (data) => {
        return(
            <Grid 
                uri = {data.item.Image}
                Name = {data.item.Name}
                Date = {moment(data.item.Date.toDate()).format('DD/MM/YYYY')}
                NavToBasket = {() => props.navigation.navigate({ routeName : 'ADD', params : { Basket_data : data.item, data : itemdata }})}
            />
        )
    };

    const onPress = () => {
        console.log(itemdata)
        props.navigation.navigate({ routeName : 'ADD', params : { Basket_data : currentorder, data : itemdata }})
    }

    return(
        <View style = {{flex : 1}}>
            <SubHeader 
                Name = {"Baskets"}
                onPress = {() => props.navigation.navigate('Main')}
            />

            <Text style = {{marginTop : hp('2%'),fontSize : hp('2.5%'),fontWeight : 'bold',textAlign: 'center',color : 'black'}}>Select Order</Text>

            {load === false ? (
                <View>
                    <Text style = {{marginTop : hp('2%'),fontSize : hp('2.5%'),marginLeft : wp('5%'),color : 'blue'}}>Cureent Order:</Text>
                    {currentorder.id ? (
                        <View>
                            <View style={item.Main}>    
                                <TouchableNativeFeedback onPress = {() => onPress()}>
                                    <Card style={{...item.card,...{height : hp('15%')}}}>
                                        <View style={{flexDirection:'row'}}>
                                            <View style = {{alignItems : 'center',marginTop:hp('1%'),width : wp('30%'),justifyContent : 'center'}}>
                                                <Image source = {require('../../assets/basket.png')} style = {{height : hp('10%'),width : hp('10%'),resizeMode : 'contain'}}/>
                                            </View>

                                            <View>
                                                <View style={item.itemName}>
                                                    <Text style={{...item.itemtext, ...{fontWeight:'bold',fontSize : hp('3%')}}}>{currentorder.Name}</Text>
                                                </View>

                                                <View style={item.itemQuan}>
                                                    <Text style={{color :'blue'}}>{moment(currentorder.Date.toDate()).format('DD/MM/YYYY')}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </Card>
                                </TouchableNativeFeedback>
                            </View>
                        </View>
                    ):(<View style = {{alignItems :'center'}}>
                        <Text style = {{fontSize : hp('2.5%'),color : '#A9A9B8',marginTop : hp('2%')}}>Not Found Current Order</Text>
                    </View>)}

                    <Text style = {{marginTop : hp('3%'),fontSize : hp('2.5%'),marginLeft : wp('5%'),color : 'green',fontWeight : 'bold'}}>Future Orders:</Text>

                    {data.length > 0 ? (
                        <View>
                            <FlatList
                                style={{marginBottom:currentorder.id ? hp('78%'):hp('4%')}}
                                numColumns = {2}
                                renderItem={RenderUI}
                                data={data}
                                keyExtractor = {(item,index)=>index.toString()}
                            />
                        </View>
                    ):(
                        <View style = {{alignItems :'center',marginTop : hp('5%')}}>
                            <Text style = {{fontSize : hp('2.5%'),color : '#A9A9B8'}}>Not Found Future Order</Text>
                        </View>
                    )}
                </View>
            ):(
                <Load style = {{flex : 2}}/>
            )}
        </View>
    )
}