import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TouchableNativeFeedback, Image, StyleSheet, TextInput, ToastAndroid, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { AntDesign, FontAwesome } from '../Icons/icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Upload_Data_To_All_Items from '../AdminScreens/Component/Upload_To_All_Items';


export default function Additem(props){

    const [Quantity, SetQuantity ] = useState(0);
    const [annonation , setAnnonation] = useState('');
    const data = props.navigation.getParam('data');
    const [ process , setprocess ] = useState(0);

    const ADD = async () => {
        if(annonation === '' || annonation.length === 0){
            setAnnonation('None');
        }
        await Upload_Data_To_All_Items(data.Image, data.Name, parseFloat(Quantity), global.id, annonation, global.PersonName,data.Unit);
        ToastAndroid.show('Item Added' , ToastAndroid.LONG);
        props.navigation.navigate({routeName : 'Items',params : { nav : 'user' }});
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

    const Back = () => {
        props.navigation.navigate('Items')
    }

    return(
        <View style = {{flex : 1, backgroundColor : 'white'}}>
            <View>
                {process > 0 ? (
                    <View style = {ADD_Style.back}>
                        <View style = {{flex : 1,alignItems : 'center', justifyContent : 'center'}}>
                            <View style = {{flexDirection : 'row'}}>
                                <ActivityIndicator size = {'small'} color = "white"/>
                                <Text style = {{marginLeft : wp('5%'), color : 'white',fontSize : hp('2.5%')}}>Adding</Text>
                            </View>
                        </View>
                    </View>
                ) : ( 
                    <View style = {ADD_Style.back}>
                        <AntDesign name="arrowleft" size={hp('3.5%')} color="white" style = {{...ADD_Style.Header,...{}}} onPress = {() => Back()}/>
                        <View style = {{flex : 1,alignItems : 'center'}}>
                            <Text style = {{...ADD_Style.Header, ...{fontSize : hp('2.5%'), color : 'white',marginLeft : -wp('-10%'),marginRight : wp('5%')}}} numberOfLines = {1}>{data.Name}</Text>
                        </View>
                    </View>
                )}
            </View>
            <KeyboardAwareScrollView enableAutomaticScroll = {true}>
            <View style = {ADD_Style.ImageCon}>
                <Image source = {{ uri : data.Image }}  style = {ADD_Style.Image}/>
            </View>
            <Card style = {ADD_Style.Main}>
                <View style= {ADD_Style.NameCon}>
                    <Text style= {{...ADD_Style.Name,...{fontSize : hp('2.5%')}}}>{data.Name}</Text>
                </View>
                <View style = {{flexDirection : 'row', marginTop : hp('5%')}}>
                    <Text style = {{...ADD_Style.label, ...{fontWeight : 'bold'}}}>Quantity :</Text>
                    <TextInput 
                        style = {{height : hp('5.5%'), marginLeft : wp('2%'), fontSize : hp('2.5%'), borderBottomWidth : 1, width : wp('18%'),backgroundColor : '#F5F6FB',borderColor : 'black',borderWidth : 1, borderRadius : wp('2%'),padding : wp('2%')}}
                        placeholder = {'0'}
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
                <TouchableNativeFeedback onPress = {Checking_Inputs}>
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

export const ADD_Style = StyleSheet.create({
    ImageCon : {
        height : hp('42%')
    },
    Image : {
        height : hp('30%'),
        width : wp('100%'),
        resizeMode : 'contain',
        marginTop : hp('4%')
    },
    back : {
        height : hp('10%'),
        backgroundColor : '#154293',
        flexDirection : 'row'
    },
    Main : {
        height : hp('55%'),
        elevation : 25,
        borderTopLeftRadius : wp('15%'),
        borderTopRightRadius : wp('15%'),
        backgroundColor : 'white',
        borderWidth : 1
    },
    NameCon : {
        marginTop : hp('2%'),
        alignItems : 'center'
    },
    Name : {
        fontSize : hp('3.5%'),
        color : '#154293',
        fontWeight : 'bold'
    },
    label : {
        marginHorizontal : wp('5%'),
        fontSize : hp('2.5%'),
        color : 'black',
        marginTop : hp('1%')
    },
    ButtonCon : {
        marginTop : hp('6%'),
        marginHorizontal : wp('10%'),
        height : hp('8%'),
        elevation : 20,
        borderRadius : wp('10%'),
        alignItems : 'center',
        backgroundColor : '#154293'
    },
    Button : {
        flexDirection : 'row', 
        alignItems : 'center', 
        height : hp('8%'), 
    },
    ButtonText : {
        fontSize : hp('3%'),
        color : 'white',
        marginLeft : wp('3%')
    },
    Header : {
        marginTop : hp('4%'),
        marginLeft : wp('5%')
    }
})