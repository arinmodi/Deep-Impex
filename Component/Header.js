import React from 'react';
import { View, Text } from 'react-native';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { AntDesign } from '../Icons/icons';

export default function Header(props){
    return(
        <View  style={{fheight : hp('10%'),backgroundColor:'#154293'}}>
            <View style={{flexDirection:'row',marginTop:hp('2.5%'),marginBottom : hp('2%')}}>
                <AntDesign name="menuunfold" size={hp('4%')} color="white" style={{marginLeft : wp('5%')}} onPress = {props.onPress}/>
                <View style = {{flex : 1,alignItems : 'center',marginLeft : -wp('10%')}}>
                    <Text style={{fontSize:hp('2.5%'),color:'white',marginTop : hp('0.5%')}}>{props.Name}</Text>
                </View>
            </View>
        </View>
    )
}