import React from 'react';
import { View, Text, StyleSheet,ImageBackground,TouchableNativeFeedback,Dimensions, Image } from 'react-native';
import { Card } from 'react-native-paper';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';

export default function Grid (props){
    return(
        <View style={style_order.CreateBucketContainer}>
            <Card style={{...style_order.CreateBucket,...{}}}>
                <TouchableNativeFeedback onPress= { () =>  props.NavToBasket()}>
                    <View>
                        <View style={style_order.ImageCon}>
                            <Image style = {{...style_order.Image,...{}}} source = {props.uri}/>
                        </View>
                        <View style = {{marginHorizontal : wp('3%'), marginTop : -hp('2%')}}>
                            <Text style={style_order.text}>{props.Name}</Text>
                            <Text style={{fontSize : hp('2%'), color : '#154293', textAlign : 'right', marginTop : wp('4%')}}>{props.Date}  </Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>
            </Card>
        </View>
    )
}

export const style_order = StyleSheet.create({
    CreateBucketContainer : {
        marginTop : hp('3%'),
        marginBottom : hp('1%')
    },
    CreateBucket : {
        height : hp('25%'),
        marginHorizontal : wp('5%'),
        width : wp('40%'),
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
        height : hp('12%'),
        alignItems : 'center'
    },
    Image : {
        height : hp('10%'),
        width : hp('10%'),
        resizeMode : 'contain'
    },
    text : {
        fontSize : hp('1.8%'),
        color : 'black',
        fontWeight : 'bold'
    }
})