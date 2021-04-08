import React from 'react';
import { View, Text,  Image, TouchableNativeFeedback, FlatList, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { FontAwesome, MaterialIcons }  from '../../Icons/icons';
import moment from 'moment';

export default function Basket(props){


    return(
        <FlatList 
            data = {props.data}
            style= {{marginTop : hp('2%'),marginBottom : hp('1%'),flex : 1}}
            keyExtractor = {(item,index)=>index.toString()}
            numColumns = {2}
            showsVerticalScrollIndicator = {false}
            renderItem = { (Data) => 
                <View style={style_order.CreateBucketContainer}>
                    <Card style={{...style_order.CreateBucket,...{}}}>
                        <TouchableNativeFeedback onPress= { () =>  props.NavToBasketitem(Data.item.Name, Data.item.Wallet, Data.item.id,Data.item.Date, Data.item.Remaining)} onLongPress = {() => props.nav === 'admin' ? props.Long(Data.item):null}>
                            <View>
                                <View style={style_order.ImageCon}>
                                    <Image style = {{...style_order.Image,...{}}} source = {require('../../assets/basket3.png')}/>
                                </View>
                                <View style = {{marginHorizontal : wp('3%'), marginTop : -hp('2%'),alignItems : 'center'}}>
                                    <Text style={style_order.text} numberOfLines = {1} adjustsFontSizeToFit = {true}>{Data.item.Name}</Text>
                                </View>
                                <View style = {{alignItems : 'center',marginHorizontal : wp('3%'), marginTop : hp('1.5%')}}>
                                    <Text style = {{color : 'black',fontSize : hp('1.8%')}}>{moment(Data.item.Date.toDate()).format('DD/MM/YYYY')}</Text>
                                </View>
                                {props.selectedorderid === Data.item.id ? (
                                    <View style = {{alignItems : 'center'}}>
                                        <MaterialIcons name="done" size={hp('3%')} color="green" />
                                    </View>
                                ):(null)}
                            </View>
                        </TouchableNativeFeedback>
                    </Card>
                </View>
            }
        />
    )
}

const style_order = StyleSheet.create({
    CreateBucketContainer : {
        marginTop : hp('3%'),
        marginBottom : hp('1%')
    },
    CreateBucket : {
        height : hp('25%'),
        marginHorizontal : wp('3%'),
        width : wp('42.5%'),
        borderRadius : hp('2%'),
        overflow : 'hidden',
        elevation : 15
    },
    BucketView : {
        flexDirection : 'row'
    },
    ImageCon : {
        marginVertical : hp('2%'),
        marginHorizontal : wp('5%'),
        height : hp('12%')
    },
    Image : {
        height : hp('10%'),
        width : wp('30%'),
        resizeMode : 'contain'
    },
    text : {
        fontSize : hp('2%'),
        color : 'black',
        fontWeight : 'bold',
    }
})