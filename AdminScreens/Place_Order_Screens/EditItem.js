import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TouchableNativeFeedback, Image, StyleSheet, TextInput, ToastAndroid, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { AntDesign, FontAwesome } from '../../Icons/icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ADD_Style } from './ADDItem';
import { firestore } from '../../config/config';
import SubHeader from '../../Component/SubScreenHeader';

export default function Edititem(props){

    const data = props.navigation.getParam('data');
    const [Quantity, SetQuantity ] = useState(data.Quantity);
    const [annonation , setAnnonation] = useState(data.Annonation);
    const id = props.navigation.getParam('id');
    const [ process , setprocess ] = useState(0);

    const Edit = async () => {
        const itemid = data.id;
        const ref = firestore.collection('Orders').doc(id).collection('Items');
        if(annonation === '' || annonation.length === 0){
            await ref.doc('All_Items').update({ [itemid + '.Quantity' ] : parseFloat(Quantity), [itemid + '.Annonation'] : 'None' });
            setprocess(0);
        }else{
            await ref.doc('All_Items').update({ [itemid + '.Quantity' ] : parseFloat(Quantity), [itemid + '.Annonation'] : annonation });
            setprocess(0);
        }
        props.navigation.navigate('BasketItems');
        ToastAndroid.show('Item Edited' , ToastAndroid.LONG);
    }

    const Checking_Inputs = async () => {
        setprocess(1);
        if(Quantity < 0.1 || !Quantity.toString().match(/^[0-9.]*$/)){
            setprocess(0);
            alert('Invalid Input Quantity');
        }else if(annonation === data.Annonation && Quantity === data.Quantity){
            setprocess(0);
            alert('Do not Need To Edit');
        }else {
            await Edit();
        }
    }

    return(
        <KeyboardAwareScrollView enableAutomaticScroll = {true}>
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
                        onPress = {() => props.navigation.navigate('BasketItems')}
                    />
                )}
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
                            value = {Quantity.toString()}
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
                            value = {annonation.toString()}
                            onChangeText = {(text) => setAnnonation(text)}
                            editable = {true}
                        />
                    </View>
                    <TouchableNativeFeedback onPress = {Checking_Inputs}>
                        <Card style = {ADD_Style.ButtonCon}>
                            <View style = {ADD_Style.Button}>
                                <FontAwesome name="shopping-basket" size={hp('3.5%')} color="white" />
                                <Text style = {ADD_Style.ButtonText}>Save</Text>
                            </View>
                        </Card>
                    </TouchableNativeFeedback>
                </Card>
            </View>
        </KeyboardAwareScrollView>
    )
}