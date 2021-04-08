import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Card } from 'react-native-paper';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Ionicons } from '../Icons/icons';
import { FontAwesome } from '../Icons/icons';
import { styles } from './BasketItems';
import { Styles } from '../AdminScreens/Place_Order_Screens/BasketItem';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';

function Purchased_Items(props){

    const data = props.navigation.getParam('Data');
    const Name = props.navigation.getParam('OrderName');
    const AllData = props.navigation.getParam('AllData');
    const P_I_L = props.navigation.getParam('P_I_L');

    const onPress = (data) => {
        props.navigation.navigate({routeName : 'View', params : {data : data}})
    }

    const FlatListRender = (data) => {
        return(
            <View style={Styles.Main}>
                <TouchableNativeFeedback onPress = {() => onPress(data.item)}> 
                    <Card style={{...Styles.card, ...{height : hp('24%')}}}>
                        <View>
                            <Image style = {{height : hp('12%'), width : wp('40%'),resizeMode : 'contain',marginLeft : wp('3%')}} source = {{uri : data.item.Image }}/>
                        </View>
                        <View style={Styles.itemName}>
                            <Text style={Styles.itemtext} numberOfLines = {1} allowFontScaling = {true} adjustsFontSizeToFit = {true}>{data.item.Name}</Text>
                        </View>
                        <View style = {{flexDirection: 'row',marginLeft : wp('3%')}}>
                            <View style={Styles.itemRate}>
                                <Text style={{...Styles.itemtext, ...{fontWeight : 'normal'}}}>{data.item.Quantity} {data.item.Unit}</Text>
                            </View>
                            <View style={Styles.itemRate}>
                                <Text style={Styles.itemtext}>{data.item.Rate} <FontAwesome name="rupee" size={hp('1.8%')} color="black" /></Text>
                            </View>
                        </View>
                    </Card>
                </TouchableNativeFeedback>  
            </View>
        )
    }

    const onBack = () => {
        props.navigation.navigate('Main');
    }

    return(
        <View>
            <View style = {{flexDirection : 'row',height : hp('10%'), backgroundColor : '#154293',alignItems : 'center'}}>
                <Ionicons name="md-arrow-back" size={hp('4%')} color="white" style = {{marginHorizontal : wp('4%')}} onPress = {onBack}/>
                <View style = {{flex : 1, alignItems : 'center',marginLeft : -wp('10%')}}>
                    <Text style = {{fontSize : hp('2.5%'), color : 'white'}}>{Name}</Text>
                </View>
            </View>

            {data.length !== 0 ? (
                <View>

                    <View>
                        <FlatList
                            style={{marginBottom:hp('20%')}}
                            keyExtractor = {(item,index)=>index.toString()}
                            renderItem={FlatListRender}
                            data={data}
                            numColumns = {2}
                        />
                    </View>
                </View>
            ) : (
                <View>
                    <View style = {{marginTop : hp('15%') , alignItems : 'center',elevation : 20}}>
                        <Image source = {require('../assets/No_Purchased_Item.png')} style = {{height : hp("25%"), marginHorizontal : wp('4%'), width : hp('25%'),resizeMode : 'contain'}}/>
                    </View>
                    <Text style = {{fontSize : hp('3%'),fontWeight : 'bold',marginTop : hp('3%'),textAlign : 'center',color : 'black'}}>All Items are pending</Text>
                    <TouchableOpacity onPress = {() => props.navigation.navigate({routeName : 'Basket', params : {data : AllData, P_I_L : P_I_L}})}>
                        <Text style = {{fontSize : hp('2.5%'),textAlign : 'center', fontWeight : 'bold',color : 'blue'}}>Check List, here</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
} 

export default Purchased_Items;