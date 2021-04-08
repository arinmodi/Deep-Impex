import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TouchableNativeFeedback, Image, StyleSheet, TextInput, ToastAndroid, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { AntDesign, FontAwesome, MaterialIcons } from '../../Icons/icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { firestore } from '../../config/config';
import { ADD_Style } from '../../Purchase Screens/ADD_Item';
import SubHeader from '../../Component/SubScreenHeader';

export default function News_Edit(props){

    const data = props.navigation.getParam('data');
    const [Quantity, SetQuantity ] = useState(data.Quantity);
    const [annonation , setAnnonation] = useState(data.annonation);
    const [show, setshow ] = useState(false);
    const [ process , setprocess ] = useState(0);
    const [ date , setdate ] = useState(data.Date.toDate());
    const [ datevalid, setvalid ] = useState(false)

    const onChange = (event, selectedDate) => {
        var newdate = new Date(selectedDate);
        if(newdate.getTime() <= new Date().getTime()){
            alert('Date is passed, select proper date');
            setshow(false);
        }else {
            setshow(false);
            setdate(selectedDate);
            setvalid(true);
        }
    };


    const ADD = async () => {
        const news_id = data.id;
        console.log(news_id)
        const ref = firestore.collection('News')

        await ref.doc(news_id).update({
            Date : date,
            Quantity : Quantity,
            Name : data.Name,
            Image : data.Image,
            annonation : annonation
        })

        ToastAndroid.show("News Edited", ToastAndroid.LONG);
        props.navigation.navigate('Main');
    }

    const Checking_Inputs = async () => {
        setprocess(1);
        if(Quantity < 0.1 || !Quantity.toString().match(/^[0-9.]*$/)){
            setprocess(0);
            alert('Invalid Input Quantity');
        }else if(datevalid !== true){
            setprocess(0);
            alert('Invalid Date');
        }else if(annonation === '' || annonation === ' '){
            setprocess(0);
            alert('Invalid Annonation');
        }else if(Quantity === data.Quantity && annonation === data.annonation && moment(date).format('DD/MM/YYYY') === moment(data.Date.toDate()).format('DD/MM/YYYY')){
            setprocess(0);
            alert('No Need To Edit');
        }else{
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
                                <Text style = {{marginLeft : wp('5%'), color : 'white',fontSize : hp('2.5%')}}>Editing</Text>
                            </View>
                        </View>
                    </View>
                ) : ( 
                    <SubHeader 
                        Name = {data.Name}
                        onPress = {() => props.navigation.navigate('Main')}
                    />
                )}
                <KeyboardAwareScrollView enableAutomaticScroll = {true}>
                <View style = {{...ADD_Style.ImageCon,...{height : hp('35%')}}}>
                    <Image source = {{ uri : data.Image }}  style = {{...ADD_Style.Image,...{marginTop : hp('1%')}}}/>
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
                            placeholder = {data.annonation.toString()}
                            onChangeText = {(text) => setAnnonation(text)}
                            editable = {true}
                        />
                    </View>
                    <View style = {{flexDirection : 'row', marginTop : hp('5%')}}>
                        <Text style = {{...ADD_Style.label, ...{fontWeight : 'bold'}}}>Date :</Text>
                        <Text style = {{height : hp('5.5%'), marginLeft : wp('2%'), fontSize : hp('2.5%'), borderBottomWidth : 1, width : wp('35%'),backgroundColor : '#F5F6FB',borderColor : 'black',borderWidth : 1, borderRadius : wp('2%'),padding : wp('2%'),color : 'black'}}>{moment(date).format('DD/MM/YYYY')}</Text>
                        <TouchableOpacity onPress = {()=> setshow(true)}>
                            <MaterialIcons name="date-range" size={hp('4%')} color="black" style={{marginLeft : wp('2%')}}/>
                        </TouchableOpacity>
                    </View>
                    <TouchableNativeFeedback onPress = {Checking_Inputs}>
                        <Card style = {ADD_Style.ButtonCon}>
                            <View style = {ADD_Style.Button}>
                                <FontAwesome name="newspaper-o" size={hp('3.5%')} color="white" />
                                <Text style = {ADD_Style.ButtonText}>Upload News</Text>
                            </View>
                        </Card>
                    </TouchableNativeFeedback>
                </Card>
                </KeyboardAwareScrollView>

                {
                    show && (
                        <DateTimePicker 
                            mode = {'date'}
                            minimumDate = {new Date().getFullYear(), new Date().getMonth(), new Date().getDate()}
                            value = {new Date()}
                            display = {"calendar"}
                            onChange = {onChange} 
                            onTouchCancel = {() => setshow(false)}
                        />
                    )
                }
            </View>
    )
}