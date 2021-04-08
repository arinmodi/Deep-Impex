import React from 'react';
import { Image, View, Text } from 'react-native';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Chase } from 'react-native-animated-spinkit'

export default function(props){
    return(
        <View style = {{...props.style, ...{alignItems : 'center',justifyContent : 'center'}}}>
            <Chase  size = {hp('6%')} color = {"#154293"}/>
            <Text style = {{textAlign : 'center', fontSize : hp('2%'),marginTop : hp('2%'),marginLeft : wp('3%'),color : 'black'}}>Loading....</Text>
        </View>
    )
}