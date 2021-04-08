import React, {useState} from 'react';
import { View,Text,StyleSheet,TouchableNativeFeedback,TouchableOpacity, Image } from 'react-native';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { FontAwesome, MaterialCommunityIcons, MaterialIcons, AntDesign } from '../Icons/icons';
import { Card } from 'react-native-paper';

export default function BasketItemGrid(props){

    const [ open, close ] = useState(false)

    return(
        <View style={styles.Main}>
            <TouchableNativeFeedback>       
                <Card style={{...styles.card, ... {height : open ? hp('18%') : hp('12%')}}} onLongPress = {props.onLong} onPress = {props.onPress}>
                    <View style={{flexDirection:'row'}}>
                        <View style = {{alignItems : 'center',marginTop:hp('1%')}}>
                            <Image source = {{uri : props.uri}} style = {styles.Image}/>
                        </View>
                        {props.LongPress === true ? (
                            <View style = {{marginLeft : -wp('5%'),marginTop : hp('9%')}}>
                                <MaterialIcons name="done" size={hp('2.8%')} color="green" />
                            </View>
                        ) : (null)}
                        <View>
                            <View style={styles.itemName}>
                                <Text style={{...styles.itemtext, ...{fontWeight:'bold'}}}>{props.Name}</Text>
                            </View>
                            <View style={styles.itemQuan}>
                                <Text style={styles.itemtext}>{props.Quan} {props.unit}</Text>
                                {!props.Rate ? (null) : (  <Text style={{...styles.itemtext, ...{fontWeight:'bold'}}}>{props.Rate} <FontAwesome name="rupee" size={hp('1.8%')} color="black" /></Text> )}
                            </View>
                        </View>
                        <View>
                            {!props.Rate ? (
                                <View style={styles.itemRate}>
                                    <MaterialCommunityIcons name = "clock-alert" size={hp('2.8%')} color="red" /> 
                                </View>
                            ) : (
                                <View style={styles.itemRate}>
                                    <Image source = {require('../assets/done.png')} style = {styles.icon} />
                                </View>
                            )}
                            {props.AddBY ? (
                                <View style = {{marginTop : hp('2%')}}>
                                    {open ? (
                                        <AntDesign name="caretup" size={hp('2.5%')} color="green" onPress = {() => close(false)} />
                                    ) : (
                                        <AntDesign name="caretdown" size={hp('2.5%')} color="green" onPress = {() => close(true)} />
                                    )}
                                </View>
                            ):(null)
                            }
                        </View>
                    </View>
                    {props.AddBY && open ? (
                        <View style = {{marginTop : hp('2%'),alignItems : 'center'}}>
                            <Text style = {{color : 'black'}}>This item is added by {props.AddBY}</Text>
                        </View>
                    ):(null)
                    }
                </Card>
            </TouchableNativeFeedback>
        </View>
    )
}

export const styles = StyleSheet.create({
    Main :{
        marginTop:hp('0.5%'),
        flexDirection:'row'
    },
    card:{
        flex:1,
        marginVertical:hp('1%'),
        marginHorizontal : wp('3%'),
        height:hp('12%'),
        borderRadius:wp('4%'),
        elevation:15,
        overflow:'hidden',
    },
    itemName:{
        marginTop:hp('3%'),
        marginLeft:wp('3%'),
        width:wp('45%')
    },
    itemtext:{
        fontSize:wp('3.5%'),
        color : 'black'
    },
    itemQuan :{
        marginTop:hp('1%'),
        marginLeft:wp('3%'),
        width:wp('30%'),
        flexDirection : 'row',
        justifyContent : 'space-between'
    },
    itemRate:{
        marginTop:hp('3%'),
        width:wp('15%')
    },
    Image : {
        height : hp('10%'),
        width : hp('10%'),
        resizeMode : 'contain'
    },
    icon : {
        height : hp('4%'),
        width : wp('4%'),
        resizeMode : 'contain'
    },
})