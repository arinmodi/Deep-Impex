import React from 'react';
import { View, Text, StyleSheet,Dimensions, Image, TouchableOpacity, FlatList } from 'react-native';
import { Card, Button } from 'react-native-paper';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import moment from 'moment';
import { VictoryPie } from 'victory-native';
import { FontAwesome } from '../Icons/icons';

export function Order_Status(props)
{
    return(
        <View>
            <Card style={{...styles.Order,...{height : props.nav === 'admin'? hp('40%') : hp('45%')}}}>
                {props.nav !== 'admin'? (
                    <View style = {{flexDirection : 'row'}}>
                        <View>
                            <Text style={{...styles.OrderText,...{width : wp('50%')}}} numberOfLines = {1} allowFontScaling = {true} adjustsFontSizeToFit = {true}>{props.OrderName}</Text>
                        </View>
                        <View style = {{flex : 1,alignItems : 'flex-end'}}>
                            <Text style = {styles.OrderDate} numberOfLines = {1} allowFontScaling = {true} adjustsFontSizeToFit = {true}>{moment(props.date).format('DD/MM/YYYY')}</Text>
                        </View>
                    </View>
                ):(null)}
                <View>
                    <VictoryPie
                        colorScale = {props.colors}
                        data={props.data}
                        width={Dimensions.get('screen').width<400?wp('80%') : wp('66%')}
                        height={Dimensions.get('screen').width<400?hp('60%') : hp('50%')}
                        innerRadius={Dimensions.get('screen').width<400?hp('12%') : hp('10%')}
                        padAngle = {wp('1%')}
                        style={{
                            labels: {
                                fill: 'black', fontSize: hp('2%'), padding: 5,fillOpacity : 0.5
                            },
                            parent  : {
                                marginTop : Dimensions.get('screen').width<400?-hp('13%') : -hp('9%'),
                                alignItems : 'center',
                                resizeMode : 'contain'
                            }
                        }}
                        /> 
                </View>

                <View style = {{position : 'absolute', top : props.nav !== 'admin' ? hp('18%'):hp('12.5%'), left : wp('37%')}}>
                    <Text style = {{fontSize : hp('3.5%'), color : '#154293', fontWeight :'bold'}}>{props.WalletAmount} <FontAwesome name="rupee" size={hp('3.2%')} color="#154293"  /></Text>
                </View>

                <View style = {{marginTop : Dimensions.get('screen').width<400?-hp('12%') : -hp('7%'),marginLeft : wp('5%'),flexDirection : 'row'}}>
                    <View style = {{flexDirection : 'row'}}>
                        <Card style = {{height : hp('2.5%'),width : wp('5%'),backgroundColor : 'blue',marginTop : hp('0.5%')}}>
                        </Card>
                        <Text style = {{marginLeft : wp('3%'),fontSize : hp('2.5%'), color : 'black'}}>Remaining</Text>
                        <Text style = {{marginLeft : wp('1%'),fontSize : hp('2.5%'), color : 'blue'}}>({((props.remaing_balance* 100)/props.WalletAmount).toFixed(0)}%)</Text>
                    </View>
                    <View style = {{flex : 1,alignItems : 'flex-end'}}>
                        <Text style = {{marginRight : wp('3%'),fontSize : hp('2.5%'), color : '#154293'}}>{props.remaing_balance} <FontAwesome name="rupee" size={hp('2.5%')} color="#154293"  /></Text>
                    </View>
                </View>
            </Card>

            {
                props.empdata.map((data,key) => {
                    return (
                        <View key = {key}>
                            <Card style={{...styles.Order, ...{height : hp('8%'),marginVertical : hp('1%'),marginTop : hp('0.5%')}}}>
                                <View style = {styles.main}>
                                    <View style = {{flexDirection : 'row'}}>
                                        <Card style = {{...styles.squre, ...{backgroundColor : data.color}}}>
                                            <View style = {{alignItems : 'center'}}>
                                                <Text style = {{fontSize : hp('2%'),fontWeight : 'bold', marginTop : hp('0.2%'),color : 'black'}}>{((data.y* 100)/props.WalletAmount).toFixed(0)}%</Text>
                                            </View>
                                        </Card>
                                        <Text style = {styles.empname}>{data.name}</Text>
                                        <Image style = {styles.image} source = {{uri : data.image}}/>
                                    </View>
                                    {props.nav === 'admin' ? (
                                    <TouchableOpacity style = {{flex : 1,alignItems : 'flex-end'}} onPress = {() => props.onPress(data)}>
                                        <Text style = {{...styles.debited,...{color : 'blue'}}}>More</Text>
                                    </TouchableOpacity>
                                    ):(
                                    <View style = {{flex : 1,alignItems : 'flex-end'}}>
                                        {props.nav === 'status' ?(
                                            <TouchableOpacity style = {{flex : 1,alignItems : 'flex-end'}} onPress = {() => props.onPress(data)}>
                                                <Text style = {{...styles.debited,...{color : 'blue'}}}>Report</Text>
                                            </TouchableOpacity>
                                        ):(
                                            <View style = {{flex : 1,alignItems : 'flex-end'}}>
                                                <Text style = {styles.debited}>{data.y} <FontAwesome name="rupee" size={hp('2.5%')} color="red"  /></Text>
                                            </View>
                                        )}
                                    </View>
                                    )}
                                </View>
                            </Card>
                        </View>
                    )
                })
            }

        </View>
    )
}

export const styles = StyleSheet.create({
    Title : {
        textAlign:'center',
        fontSize:Dimensions.get('screen').width<400?wp('6%'):wp('5%'),
        marginTop:hp('3%'),
    },
    Order : {
        marginTop:hp('3%'),
        marginHorizontal:wp('3%'),
        height:hp('45%'),
        borderRadius:wp('3%'),
        elevation:15,
        marginBottom : hp('2%')
    },
    OrderText:{
        fontSize:hp('2.5%'),
        color:'black',
        textAlign:'left',
        marginHorizontal:wp('5%'),
        fontWeight : 'bold',
        marginTop : hp('0.7%'),
    },
    OrderDate : {
        fontWeight : 'bold',
        fontSize : hp('2.5%'),
        marginRight : wp('3%'),
        marginTop : hp('0.7%'),
        color:'black',
    },
    OrderText2:{
        fontSize:Dimensions.get('screen').width<400?hp('3%'):hp('2.5%'),
        color:'red',
        marginHorizontal:wp('2%'),
    },
    ImageBackground:{
        height:Dimensions.get('screen').width<400?hp('30%'):hp('26%'),
        width:Dimensions.get('screen').width<400?wp('60%'):wp('50%'),
        marginTop:hp('1%'),
        marginLeft:wp('1%')
    },
    icon : {
        marginVertical:hp('2.5%'),
        marginLeft:wp('3%')
    },
    wallettext : {
        fontSize:hp('3%'),
        marginVertical:hp('2.5%'),
        color:'white'
    },
    main : {
        flexDirection : 'row',
        marginLeft : wp('3%'),
        marginTop : hp('1.5%')
    },
    squre : {
        height : hp('3.5%'),
        width : wp('10%'),
        marginTop : hp('0.5%')
    },
    empname : {
        marginLeft : wp('3%'),
        marginTop : hp('0.5%'),
        fontSize : hp('2.5%'), 
        color : 'black',
        width : wp('25%'),
    },
    image : {
        height : hp('5%'),
        width : hp('5%'),
        borderRadius : hp('5%'),
        borderColor : 'black',
        borderWidth : 1
    },
    debited : {
        marginRight : wp('3%'),
        fontSize : hp('2.5%'), 
        color : 'red',
        marginTop : hp('0.5%')
    }
})