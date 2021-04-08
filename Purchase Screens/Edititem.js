import React, { useState } from 'react';
import { View,StyleSheet,Text,TouchableNativeFeedback,TextInput, Image, ToastAndroid } from 'react-native';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { FontAwesome } from '../Icons/icons';
import { Card } from 'react-native-paper';
import { Ionicons } from '../Icons/icons';
import  Modal from 'react-native-modal';
import { firestore } from '../config/config';
import Loading from '../Component/Loading';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as B_S from './BasketItems';
import Confirmation from '../Component/ConfirmationModal';

export default function Edit(props){

    const Back = () => {
        props.navigation.navigate('Basket')
    }
    const data = props.navigation.getParam('data');
    const [quan , setquan ] = useState(0);
    const [rate , setrate ] = useState(0);
    const [ Pname, SetPname ] = useState('');
    const [ modalE, setmodalE ] = useState(false);
    const [ modalE_C, setmodalE_C ] = useState(false);
    const [ modalC, setmodalC ] = useState(false);
    const [ Process, setProcess ] = useState(0);

    const onSave = () => {
        if(quan <= 0 || !quan.toString().match(/^[0-9.]*$/)){
            alert('Invalid Quantity, Enter valid input')
        }else if(rate <= 0  || !rate.toString().match(/^[0-9.]*$/)){
            alert('Invalid Rate, Enter valid input')
        }else if(quan * rate === data.Quantity * data.Rate){
            alert('Item Rate is same as you entered, did not need to edit')
        }else {
            if(data.Credit > 0){
                if(Pname === '' || !Pname.match(/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/)){
                    console.log('Hello')
                    alert('Invalid Name, Enter the Person Name, If you want to edit')
                }else {
                    setmodalE(true);
                }
            }else {
                setmodalE(true);
            }
        }
    }

    const HidemodalE = () => {
        setmodalE(false);
    }

    const HidemodalE_C = () => {
        setmodalE_C(false);
    }

    const HidemodalC = () => {
        setmodalC(false);
    }

    const empref = firestore.collection('Orders').doc(global.id).collection('Employees').doc(global.uid);
    const itemref = firestore.collection('Orders').doc(global.id).collection('All_Items').doc('Purchased_Items');

    const onYes = async () => {
        HidemodalE();
        setProcess(2);
        const ItemRate = quan * rate;
        const doc = await empref.get();
        const T_P = await doc.data().Total_Purchased - (data.Quantity * data.Rate);
        if(data.Credit > 0){
            console.log('Credit')
            const Credit = await doc.data().Credit - (data.Quantity * data.Rate);
            const itemdata2 = {
                Name : data.Name,
                Image : data.Image,
                Quantity : parseInt(quan),
                Annonation : data.Annonation,
                Button_Color : 'green',
                Rate : parseFloat(rate),
                empid : global.uid,
                Debit : 0, 
                Credit : parseFloat(ItemRate),
                PersonName : Pname
            }
            await empref.update({ Total_Purchased : T_P + ItemRate, Credit : Credit + ItemRate });
            await itemref.update({ [data.id] :  itemdata2});
            setProcess(0);
            HidemodalE();
            ToastAndroid.show('Item edited', ToastAndroid.LONG);
            Back();
        }else {
            const Balance = await doc.data().Balance + (data.Quantity * data.Rate);
            const Debit = await doc.data().Debit - (data.Quantity * data.Rate);
            if(Balance > ItemRate){
                console.log('Debit')
                const itemdata = {
                    Name : data.Name,
                    Image : data.Image,
                    Quantity : parseInt(quan),
                    Annonation : data.Annonation,
                    Button_Color : 'green',
                    Rate : parseFloat(rate),
                    empid : global.uid,
                    Debit : parseFloat(ItemRate), 
                    Credit : 0
                }
                await empref.update({ Balance : Balance - ItemRate, Debit : Debit + ItemRate, Total_Purchased : T_P + ItemRate });
                await itemref.update({ [data.id] :  itemdata});
                setProcess(0);
                HidemodalE();
                ToastAndroid.show('Item edited', ToastAndroid.LONG);
                Back();
            }else {
                setProcess(0);
                HidemodalE();
                setmodalE_C(true);
            }
        }
    }

    const onCreditYes = () => {
        setmodalC(true);
    }

    const onCreditAdd = async () => {
        setProcess(2);
        if(Pname === '' || !Pname.match(/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/)){
            alert('Invalid Name, Enter the Person Name, If you want to edit')
        }else {
           HidemodalE_C();
           const ItemRate = quan * rate;
           const doc = await empref.get();
           const T_P = await doc.data().Total_Purchased - (data.Quantity * data.Rate);
           const Balance = await doc.data().Balance + (data.Quantity * data.Rate);
           const Debit = await doc.data().Debit - (data.Quantity * data.Rate);
           const Credit = await doc.data().Credit - (data.Quantity * data.Rate); 
           const itemdata = {
                Name : data.Name,
                Image : data.Image,
                Quantity : parseInt(quan),
                Annonation : data.Annonation,
                Button_Color : 'green',
                Rate : parseFloat(rate),
                empid : global.uid,
                Debit : 0, 
                Credit : parseFloat(ItemRate),
                PersonName : Pname
            }
            await empref.update({ Balance : Balance, Debit : Debit, Total_Purchased : T_P + ItemRate, Credit : Credit + ItemRate });
            await itemref.update({ [data.id] :  itemdata});
            setProcess(0);
            HidemodalC();
            ToastAndroid.show('Item edited', ToastAndroid.LONG);
            Back();
        }
    }

    return(
        <View style={{flex:1,backgroundColor:'white'}}>
            <KeyboardAwareScrollView enableAutomaticScroll = {true}>
                <View style={styles.header}>
                    <Ionicons style={styles.icon} name="ios-arrow-round-back" size={hp('6%')} color="white" onPress={Back} style={styles.icon}/>
                    <Text style={styles.title}>{data.Name}</Text>
                </View>

                <View>
                    <Image source = {{uri : data.Image}} style = {styles.Image}/>
                </View>

                <View>
                    <Text style = {{marginLeft : hp('4%'), marginTop : hp('2%'), fontSize : hp('2.5')}}>Current Item Rate : {data.Quantity * data.Rate} <FontAwesome name="rupee" size={hp('2.5%')} color="#154293" style={{marginTop:wp('1.2%')}}/></Text>
                </View>

                <View style={{flexDirection:'row'}}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{...styles.AddModalInputCont,...{width:wp('20%'),flexDirection:'row', marginLeft :wp('8%')}}}>
                            <Text style={styles.AddModalInputContTitle}>Quantity</Text>
                            <TextInput
                                style={styles.Textinput}
                                placeholder = {data.Quantity.toString()}
                                keyboardType={"number-pad"}
                                onChangeText = {(val) => setquan(val)}
                            />
                        </View>
                        <View style={{marginTop:wp('10%')}}>
                            <Text style={{fontSize:hp('3.5%'),fontWeight:'bold',color:'#154293'}}>Kg</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <View style={{...styles.AddModalInputCont,...{width:wp('20%'),flexDirection:'row', marginLeft :wp('18%'),marginTop:hp('4%')}}}>
                            <Text style={styles.AddModalInputContTitle}>Rate</Text>
                            <TextInput
                                style={styles.Textinput}
                                placeholder = {data.Rate.toString()}
                                onChangeText = {val => setrate(val)}
                                keyboardType={"number-pad"}
                            />
                        </View>
                        <View style={{flexDirection:'row',marginTop:wp('10%')}}>
                            <FontAwesome name="rupee" size={hp('3.5%')} color="#154293" style={{marginTop:wp('1.2%')}}/>
                            <Text style={{fontSize:hp('3.5%'),fontWeight:'bold',color:'#154293'}}>/kg</Text>
                        </View>
                    </View>
                </View>

                {data.Credit > 0 ? (
                    <View style={{...styles.AddModalInputCont,...{marginTop:hp('3%'),marginLeft : wp('8%')}}}>
                        <Text style={styles.AddModalInputContTitle}>Person Name</Text>
                        <TextInput
                            style={styles.Textinput}
                            placeholder = {data.PersonName}
                            onChangeText = {(text) => SetPname(text)}
                        />
                    </View>
                ): null}

                {rate > 0 && quan > 0 ? (
                    <View>
                        <Text style = {{marginLeft : hp('4%'), marginTop : hp('2%'), fontSize : hp('2.5')}}>Latest Item Rate : {quan * rate} <FontAwesome name="rupee" size={hp('2.5%')} color="#154293" style={{marginTop:wp('1.2%')}}/></Text>
                    </View>
                ): null}

                <View style={{...styles.ButtonCon, ...{marginBottom : hp('3%')}}}>
                    <TouchableNativeFeedback onPress = {onSave}>
                        <Card style={styles.Button}>
                            <Text style={styles.Button_text}>Save</Text>
                        </Card>
                    </TouchableNativeFeedback>
                </View>

                <Loading 
                    isVisible = {Process > 0}
                    data = "Editing"
                />

                <Confirmation 
                    isVisible = {modalE}
                    onBackButtonPress = {() => HidemodalE()}
                    onBackdropPress = {() => HidemodalE()}
                    question = {"Are You Sure , Want To Edit ?"}
                    onPressYes = {() => onYes()}
                    onPressNo = {() => HidemodalE()}
                />

                <Modal
                    isVisible = {modalE_C}
                    onBackButtonPress = {HidemodalE_C}
                    onBackdropPress = {HidemodalE_C}
                >
                    <View style = {{backgroundColor : 'white',height : hp('25%'),borderRadius  : hp('3%'),overflow : 'hidden'}}>
                        <Text style= {{marginTop : hp('3%'),marginLeft : wp('5%'),fontSize : hp('2.8%')}}>Don't Have Enough Balance To Edit </Text>
                        <Text style = {{marginTop : hp('1%'), fontSize : hp('2.5%'), textAlign : 'center', color : 'blue'}}>Do you want to take credits ??</Text>

                        <View style={{flexDirection : 'row',justifyContent : 'space-around'}}>
                            <View style={{...styles.ButtonMainCon,...{marginHorizontal : wp('0%')}}}>
                                <TouchableNativeFeedback onPress = {onCreditYes}>
                                    <Card style={{...styles.Button,...{width : wp('25%'),backgroundColor : 'red'}}}>
                                        <Text style={styles.Button_text}>Yes</Text>
                                    </Card>
                                </TouchableNativeFeedback>
                            </View>
                            <View style={{...styles.ButtonMainCon,...{marginHorizontal : wp('0%')}}}>
                                <TouchableNativeFeedback onPress = {HidemodalE_C}>
                                    <Card style={{...styles.Button,...{width : wp('25%')}}}>
                                        <Text style={styles.Button_text}>No</Text>
                                    </Card>
                                </TouchableNativeFeedback>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal
                    animationIn='fadeIn'
                    isVisible = {modalC}
                    onBackButtonPress = {HidemodalC}
                    onBackdropPress = {HidemodalC}
                >
                    <View style = {{...B_S.styles.Modal, ...{height : hp('30%')}}}>
                        <View style={B_S.styles.AddModalheader}>
                            <Text style={B_S.styles.AddModalheadertitle}>Person Name</Text>
                        </View>
                        <View style={{...B_S.styles.AddModalInputCont,...{marginTop:hp('3%')}}}>
                            <Text style={B_S.styles.AddModalInputContTitle}>Person Name</Text>
                            <TextInput
                                style={B_S.styles.Textinput}
                                placeholder = {"Enter Person Name"}
                                onChangeText = {(text) => SetPname(text)}
                            />
                        </View>
                        <View style={B_S.styles.ButtonCon}>
                            <TouchableNativeFeedback onPress = {onCreditAdd}>
                                <Card style={B_S.styles.Button}>
                                    <Text style={B_S.styles.Button_text}>Add</Text>
                                </Card>
                            </TouchableNativeFeedback>
                        </View>
                    </View>
                </Modal>

            </KeyboardAwareScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    header:{
        height:hp('13%'),
        backgroundColor:'#154293',
        alignItems:'center',
        flexDirection:'row'
    },
    title : {
        marginTop:hp('5%'),
        fontSize:hp('4%'),
        color:'white',
        fontWeight:'bold',
        marginLeft:wp('5%')
    },
    AddModalInputCont : {
        borderWidth:2,
        marginTop:hp('4%'),
        marginHorizontal:wp('3%'),
        borderRadius : wp('3%'),
        height:hp('7%'),
        width:wp('40%'),
        marginLeft :wp('15%')
    },
    AddModalInputContTitle : {
        position: 'absolute',
        top: -hp('1.6%'),
        left: wp('3%'),
        fontWeight: 'bold',
        backgroundColor: 'white',
        color : '#154293',
    },
    Textinput : {
        marginVertical:hp('0.8%'),
        marginLeft:wp('2%'),
        fontSize:hp('2%'),
    },
    ButtonCon : {
        marginTop : hp('5%'),
        alignItems:'center'
    },
    Button : {
        width:wp('25%'),
        height:hp('6%'),
        backgroundColor : '#154293',
        alignItems:'center',
        elevation:10,
        borderWidth : 1
    },
    Button_text : {
        color : 'white',
        fontSize:hp('4%')
    },
    icon:{
        marginTop:hp('5%'),
        marginLeft:wp('3%')
    },
    Image : {
        height : hp('37.5%'),
        width : wp('100%'),
    },
    ButtonMainCon : {
        marginTop : hp('4%'),
        marginHorizontal : wp('30%')
    }
})