import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TouchableNativeFeedback, Image, StyleSheet, TextInput, ToastAndroid, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { AntDesign, FontAwesome } from '../../Icons/icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Upload_Data_To_All_Items from '../Component/Upload_To_All_Items';
import { ADD_Style } from '../Place_Order_Screens/ADDItem';
import { firestore } from '../../config/config';
import SubHeader from '../../Component/SubScreenHeader';

export default function Add_Pending_item(props){

    const data = props.navigation.getParam('data');
    const basket = props.navigation.getParam('Basket_data');
    const [Quantity, SetQuantity ] = useState(0);
    const [annonation , setAnnonation] = useState('');
    const [ process , setprocess ] = useState(0);

    const ADD = async () => {
        var id = basket.id;
        if(annonation === '' || annonation.length === 0){
            await Upload_Data_To_All_Items(data.Image, data.Name, parseFloat(Quantity), id, 'None', 'admin',data.Unit);
        }else{
            await Upload_Data_To_All_Items(data.Image, data.Name, parseFloat(Quantity), id, annonation, 'admin',data.Unit);
        }
        const ref = firestore.collection('Pending_Items').doc(data.id);
        await ref.delete();
        ToastAndroid.show('Item Added' , ToastAndroid.LONG);
        props.navigation.navigate('Main');
    }

    const Checking_Inputs = async () => {
        setprocess(1);
        if(Quantity < 0.1 || !Quantity.toString().match(/^[0-9.]*$/)){
            setprocess(0);
            alert('Invalid Input Quantity');
        }else {
            await ADD();
            setprocess(0);
        }
    }

    return(
            <View style = {{flex : 1, backgroundColor : 'white'}}>
                {process > 0 ? (
                    <View style = {{...ADD_Style.back, ...{}}}>
                        <View style = {{flex : 1,alignItems : 'center', marginRight : wp('5%'), justifyContent : 'center'}}>
                            <View style = {{flexDirection : 'row'}}>
                                <ActivityIndicator size = {'small'} color = "white"/>
                                <Text style = {{marginLeft : wp('5%'), color : 'white',fontSize : hp('2.5%')}}>Adding</Text>
                            </View>
                        </View>
                    </View>
                ) : ( 
                    <SubHeader 
                        Name = {basket.Name}
                        onPress = {() => props.navigation.navigate('List')}
                    />
                )}
                <KeyboardAwareScrollView enableAutomaticScroll = {true}>
                <View style = {ADD_Style.ImageCon}>
                    <Image source = {{ uri : data.Image }}  style = {ADD_Style.Image}/>
                </View>
                <Card style = {ADD_Style.Main}>
                    <View style= {ADD_Style.NameCon}>
                        <Text style= {ADD_Style.Name}>{data.Name}</Text>
                    </View>
                    <View style = {{flexDirection : 'row', marginTop : hp('5%')}}>
                        <Text style = {{...ADD_Style.label, ...{fontWeight : 'bold'}}}>Quantity :</Text>
                        <TextInput 
                            style = {{height : hp('5.5%'), marginLeft : wp('2%'), fontSize : hp('2.5%'), borderBottomWidth : 1, width : wp('18%'),backgroundColor : '#F5F6FB',borderColor : 'black',borderWidth : 1, borderRadius : wp('2%'),padding : wp('2%')}}
                            placeholder = {data.Quantity.toString()}
                            onChangeText = {(num) => SetQuantity(num)}
                            keyboardType = {"number-pad"}
                            editable = {true}
                        />
                        <Text style = {ADD_Style.label}>{data.Unit}</Text>
                    </View>
                    <View style = {{flexDirection : 'row', marginTop : hp('5%')}}>
                        <Text style = {{...ADD_Style.label, ...{fontWeight : 'bold'}}}>Annonation:</Text>
                        <TextInput 
                            style = {{height : hp('5.5%'), marginLeft : wp('2%'), fontSize : hp('2.5%'), borderBottomWidth : 1, width : wp('50%'),backgroundColor : '#F5F6FB',borderColor : 'black',borderWidth : 1, borderRadius : wp('2%'),padding : wp('2%')}}
                            placeholder = {'None'}
                            onChangeText = {(text) => setAnnonation(text)}
                            editable = {true}
                        />
                    </View>
                    <TouchableNativeFeedback onPress = {Checking_Inputs} disabled = {process > 0}>
                        <Card style = {ADD_Style.ButtonCon}>
                            <View style = {ADD_Style.Button}>
                                <FontAwesome name="shopping-basket" size={hp('3.5%')} color="white" />
                                <Text style = {ADD_Style.ButtonText}>ADD TO BAG</Text>
                            </View>
                        </Card>
                    </TouchableNativeFeedback>
                </Card>
                </KeyboardAwareScrollView>
            </View>
    )
}