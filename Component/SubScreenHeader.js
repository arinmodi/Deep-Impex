import React from 'react';
import { View, Text } from 'react-native';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { AntDesign,Ionicons } from '../Icons/icons';

export default function SubHeader(props){
    return(
        <View  style={{height : hp('10%'),backgroundColor:'#154293'}}>
            <View style={{flexDirection:'row',marginTop:hp('2.5%'),marginBottom : hp('2%')}}>
                <Ionicons name="ios-arrow-back" size={hp('4%')} color="white"style={{marginLeft : wp('5%')}} onPress = {props.onPress}/>
                <View style = {{flex : 1,alignItems : 'center',marginLeft : -wp('10%')}}>
                    <Text style={{fontSize:hp('2.5%'),color:'white',marginTop : hp('0.5%')}}>{props.Name}</Text>
                </View>
            </View>
        </View>
    )
}