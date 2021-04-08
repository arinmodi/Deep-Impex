import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableNativeFeedback, Dimensions } from 'react-native';
import { Card } from 'react-native-paper';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Feather } from '../Icons/icons';
import { database, f } from '../config/config';
import Load from '../Component/loaddata';
import Header from '../Component/Header';

export default function Transfer(props){

const [empdata, setempdata] = useState([]);
const [ order, setorder ] = useState(true);
const [  load, setload ] = useState(true);

useEffect(() => {
    Fetch_Data();
}, [])

const Fetch_Data = async () => {
    setempdata([]);
    console.log(global.id)
    if(!global.id){
        setorder(false);
    }else{
        const uid = f.auth().currentUser.uid;
        var emps = [];
        await database.ref('Accepted_Employee').once('value').then(data => {
            data.forEach(snapshot => {
                var values = snapshot.val();
                if(values.Active === true){
                    emps.push({
                        id : snapshot.key,
                        Name : values.UserName,
                        Image : values.ProfileImage,
                    })
                }
            })
        })
        var newdata = emps.filter(data => { return data.id != uid });
        setempdata(newdata);
    }
    setload(false);
}

const onPay = (empdata) => {
    props.navigation.navigate({routeName : 'Pay', params : {data : empdata}})
}

return(
    <View style = {{flex : 1}}>
        {load === false ? (
            <View>

                <Header 
                    Name = {'Transfer'}
                    onPress = {() => props.navigation.toggleDrawer()}
                />


                <View>
                    {order === true ? (
                        <FlatList 
                            style = {{marginTop: hp('3%'),marginBottom : hp('17%')}}
                            keyExtractor = {(item,index)=>index.toString()}
                            data = {empdata}
                            renderItem = {(data) => 
                                <View style = {Transfer_Style.container}>
                                    <Card style = {Transfer_Style.subcontainer}>
                                        <View style = {{flexDirection : 'row',alignItems : 'center'}}>
                                            <Image style = {Transfer_Style.Image} source = {{uri : data.item.Image}}/>
                                            <Text style = {Transfer_Style.Name} numberOfLines = {1}>{data.item.Name}</Text>
                                            <TouchableNativeFeedback onPress = {() => onPay(data.item)}>
                                                <Card style = {Transfer_Style.Pay}>
                                                    <Text style = {{color : 'white',marginLeft : wp('5%'),fontSize : hp('2.5%'),fontWeight : 'bold',marginTop : hp('0.7%')}}>Pay</Text>
                                                </Card>
                                            </TouchableNativeFeedback>
                                        </View>
                                    </Card>
                                </View>
                            }
                        />
                    ): (
                        <View>
                            <Image source = {require('../assets/no_order.png')} style = {{ marginTop : hp('12%'), height : hp('30%'), width : wp('55%'), marginHorizontal : wp('22%'), resizeMode : 'contain'}}/>
                            <Text style = {{...Transfer_Style.Title,...{fontWeight : 'normal',color : '#154293'}}}>No Order Today!</Text>
                            <Text style = {{...Transfer_Style.Title,...{fontWeight : 'bold',marginTop : hp('1%')}}}>Can't Transfer Balance</Text>
                        </View>
                    )}
                </View>
            </View>
        ):(
            <View style = {{flex : 1}}>
                <Header 
                    Name = {'Transfer'}
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

export const Transfer_Style = StyleSheet.create({
    header : {
        height : hp('14%'),
        backgroundColor : '#154293',
        alignItems : 'center',
        flexDirection : 'row'
    },
    headertext : {
        fontSize : hp('3%'),
        color : 'white',
        marginTop : hp('4%'),
        marginLeft : wp('5%')
    },
    container : {
        marginBottom : hp('3%'),
        marginHorizontal : wp('3%')
    },
    subcontainer : {
        height : hp('15%'),
        elevation : 15,
        borderRadius : wp('5%'),
        overflow : 'hidden'
    },
    Image: {
        height : hp('10%'),
        width : Dimensions.get('screen').width<400?wp('19%'):wp('17%'),
        marginTop : hp('2%'),
        marginLeft : wp('5%'),
        borderRadius : hp('10%')
    },
    Name : {
        marginLeft : wp('6%'),
        width : wp('40%'),
        fontSize : hp('2%'),
        fontWeight : 'bold',
        color : 'black'
    },
    Pay : {
        width : wp('18%'),
        height : hp('5%'),
        elevation : 15,
        backgroundColor : '#154293',
    },
    Title : {
        textAlign:'center',
        fontSize:Dimensions.get('screen').width<400?wp('6%'):wp('5%'),
        marginTop:hp('3%'),
        fontWeight:'bold',
    },
})
