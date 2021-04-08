import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { AntDesign, FontAwesome, MaterialCommunityIcons } from '../Icons/icons';
import { ADD_Style } from '../AdminScreens/Place_Order_Screens/ADDItem';
import { database } from '../config/config';
import Load from '../Component/loaddata';

export default function View_Product(props){

    const data = props.navigation.getParam('data');
    const nav = props.navigation.getParam('Nav');
    const [ image, setimage ] = useState('');
    const [ name, setname ] = useState('');
    const [load, setload] = useState(true);

    useEffect(() => {
        Fetch_Emp_Details();
    });

    const Fetch_Emp_Details = async () => {
        await database.ref('Accepted_Employee').child(data.empid).child('ProfileImage').once('value').then((data) => {
            setimage(data.val())
        });

        await database.ref('Accepted_Employee').child(data.empid).child('UserName').once('value').then((data) => {
            setname(data.val())
        });

        setload(false);
    };

    const Back = () => {
        if(nav === 'admin'){
            props.navigation.navigate('BasketItems');
        }else{
            props.navigation.navigate('Purchased');
        }
    }

    return(
        <View style = {{flex : 1, backgroundColor : 'white'}}>
            <View style = {ADD_Style.back}>
                <View style = {{flexDirection : 'row'}}>
                    <AntDesign name="arrowleft" size={hp('4%')} color="white" style = {ADD_Style.Header} onPress = {() => Back()}/>
                    <View style = {{flex : 1, alignItems : 'center',justifyContent : 'center',marginLeft : -wp('10%')}}>
                        <Text style = {{...ADD_Style.Header, ...{fontSize : hp('2.5%'), color : 'white'}}}>{data.Name}</Text>
                    </View>
                </View>
            </View>
            {load === false ? (
                <View>
                    <View style = {ADD_Style.ImageCon}>
                        <Image source = {{ uri : data.Image }}  style = {{...ADD_Style.Image,...{marginTop : hp('6%')}}}/>
                    </View>

                    <Card style = {{...ADD_Style.Main, ...{overflow : 'hidden',height :data.Credit && data.Debit ? hp('65%') : hp('55%')}}}>
                        <View style = {{flex : 1}}>
                            <View style= {ADD_Style.NameCon}>
                                <Text style= {ADD_Style.Name}>{data.Name}</Text>
                            </View>
                            <View style = {View_Styles.Main_Con}>
                                <Text style = {{...ADD_Style.label,...{marginLeft : wp('5%'),fontSize : hp('2.5%'),width : wp('93%'),marginTop : hp('0.5%'),color : 'gray'}}}>{data.Annonation}</Text>
                            </View>

                            <View style = {{...View_Styles.Main_Con, ...{marginLeft : wp('5%')}}}>
                                <Image source = {{uri : image}} style = {{height : hp('6%'),width : hp('6%'),borderRadius : hp('6%')}}/>
                                <Text style = {{marginTop : hp('0.5%'),marginLeft : wp('3%'),fontSize : hp('2.5%'),fontWeight : 'bold',color : 'black'}}>{name}</Text>
                            </View>

                            <View style = {View_Styles.Main_Con}>
                                <View style = {{flexDirection : 'row',width : wp('50%')}}>
                                    <Text style = {{...ADD_Style.label, ...{fontWeight : 'bold',fontSize : hp('2.5%')}}}>Rate :</Text>
                                    <Text style = {{...ADD_Style.label, ...{fontSize : hp('2.5%'),marginLeft : wp('0%'),marginRight : wp('1%')}}}>{( data.Rate).toFixed(1)}</Text>
                                    <FontAwesome name="rupee" size={hp('2.5%')} color="black" style={{marginTop:hp('1.5%')}} />
                                </View>
                                <View style = {{flexDirection : 'row'}}>
                                    <Text style = {{...ADD_Style.label, ...{fontWeight : 'bold',fontSize : hp('2.5%')}}}>Total :</Text>
                                    <Text style = {{...ADD_Style.label, ...{fontSize : hp('2.5%'),marginLeft : wp('0%'),marginRight : wp('1%')}}}>{(data.Quantity * data.Rate).toFixed(1)}</Text>
                                    <FontAwesome name="rupee" size={hp('2.5%')} color="black" style={{marginTop:hp('1.5%')}} />
                                </View>
                            </View>

                            {nav === 'admin' ? (
                            <View style = {View_Styles.Main_Con}>
                                <View style = {{flexDirection : 'row',width : wp('50%')}}>
                                    <Text style = {{...ADD_Style.label, ...{fontWeight : 'bold',fontSize : hp('2.5%')}}}>Credit :</Text>
                                    <Text style = {{...ADD_Style.label, ...{fontSize : hp('2.5%'),marginLeft : wp('0%'),marginRight : wp('1%')}}}>{data.Credit ? ( data.Credit).toFixed(1) : ((0).toFixed(1))}</Text>
                                    <FontAwesome name="rupee" size={hp('2.5%')} color="black" style={{marginTop:hp('1.5%')}} />
                                </View>
                                <View style = {{flexDirection : 'row'}}>
                                    <Text style = {{...ADD_Style.label, ...{fontWeight : 'bold',fontSize : hp('2.5%')}}}>Debit :</Text>
                                    <Text style = {{...ADD_Style.label, ...{fontSize : hp('2.5%'),marginLeft : wp('0%'),marginRight : wp('1%')}}}>{data.Debit ? ( data.Debit).toFixed(1) : (0).toFixed(1)}</Text>
                                    <FontAwesome name="rupee" size={hp('2.5%')} color="black" style={{marginTop:hp('1.5%')}} />
                                </View>
                            </View>

                            ) : (null)}

                        </View>
                    </Card>

                    <View style = {{position : 'absolute',top : hp('2%'),left : wp('3%')}}>
                        <View style = {{height : hp('8%'), width : hp('8%'), borderRadius : hp('8%'), backgroundColor : '#154293',overflow : 'hidden',alignItems : 'center'}}>
                            <Text style = {{color : 'white',marginTop : hp('1%'), fontSize : hp('3%'), fontWeight : 'bold'}}>{data.Quantity}</Text>
                            <Text style = {{color : 'white',marginTop : -hp('0.5%')}}>{data.Unit}</Text>
                        </View>
                    </View>
                </View>
            ) : (

                <Load 
                    style = {{flex : 1}}
                />
            )}
        </View>
    )
}

const View_Styles = StyleSheet.create({
    Main_Con : {
        flexDirection : 'row',
        marginTop : hp('3%')
    }
})