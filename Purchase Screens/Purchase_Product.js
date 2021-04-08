import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TouchableNativeFeedback, Image, StyleSheet, TextInput, ToastAndroid, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { AntDesign, FontAwesome } from '../Icons/icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ADD_Style } from '../AdminScreens/Place_Order_Screens/ADDItem';
import CheckBox from '@react-native-community/checkbox';
import { firestore } from '../config/config';
import Modal from 'react-native-modal';
import { RadioButton } from 'react-native-paper';

export default function Purchase_Product(props){

    const data = props.navigation.getParam('data');
    const [ process , setprocess ] = useState(0);
    const [ CheckBoxvalue, setCheckBox ] = useState(false);
    const [ rate, setrate ] = useState(false);
    const [personname, setpersonname] = useState('');
    const [ radio, setradio ] = useState('full');
    const [ balance, setbalance ] = useState(0);
    const [ creditoption, setcreditoption ] = useState(false);
    const [ creditamount, setcreditamount ] = useState(0);

    const fetch_user_balance = async () => {
        const empref = firestore.collection('Orders').doc(global.id).collection('Employees').doc(global.uid);
        var balance;

        await empref.get().then((data) => {
            balance = data.data().Balance;
            setbalance(data.data().Balance);
        })

        return balance;

    }

    const ADD_From_Debit = async () => {
        const empref = firestore.collection('Orders').doc(global.id).collection('Employees').doc(global.uid);
        const itemref = firestore.collection('Orders').doc(global.id).collection('Items').doc('All_Items');
        const ItemRate = data.Quantity * rate;
        console.log(ItemRate);
        try {
            const res = await firestore.runTransaction(async t => {
                const doc = await t.get(empref);
                const Balance = await doc.data().Balance;
                const Debit = await doc.data().Debit;
                const T_P = await doc.data().Total_Purchased;
                if (Balance >= ItemRate) {
                    t.update(empref, { Balance : Balance - ItemRate, Debit : Debit + ItemRate, Total_Purchased : T_P + ItemRate });
                    t.update(itemref, { [data.id + '.Rate'] : parseFloat(rate), [data.id + '.empid'] : global.uid, [data.id + '.Debit'] : parseFloat(ItemRate)});
                    ToastAndroid.show("Product Succesfully Purchased!", ToastAndroid.LONG);
                }else {
                    alert('Not Suffcient Balance');
                    setprocess(0);
                    return false;
                }
            });
                console.log('Transaction success', res);
                if(res !== false){
                    global.update = true;
                    props.navigation.navigate({ routeName : 'Basket'});
                    setprocess(0);
                }
        } catch (e) {
            alert("Something Bad Happen, Try Again");
            etprocess(0);
            console.log(e);
        }
    }

    const ADD_TO_Credit = async () => {
        setprocess(1);
        setcreditoption(false);
        const empref = firestore.collection('Orders').doc(global.id).collection('Employees').doc(global.uid);
        const itemref = firestore.collection('Orders').doc(global.id).collection('Items').doc('All_Items');
        const ItemRate = data.Quantity * rate;
        console.log(ItemRate);
        try {
            const res = await firestore.runTransaction(async t => {
                const doc = await t.get(empref);
                const T_P = await doc.data().Total_Purchased;
                const credit = await doc.data().Credit;
                t.update(empref, { Total_Purchased : T_P + ItemRate, Credit : credit + ItemRate });
                t.update(itemref, { [data.id + '.Rate'] : parseFloat(rate), [data.id + '.empid'] : global.uid, [data.id + '.Credit'] : parseFloat(ItemRate), [data.id + '.PersonName'] : personname });
                ToastAndroid.show("Product Succesfully Purchased!", ToastAndroid.LONG);
            });
                console.log('Transaction success', res);
                setprocess(0);
                global.update = true;
                props.navigation.navigate({ routeName : 'Basket'})
        } catch (e) {
            alert("Something Bad Happen, Try Again");
        }
    }

    const Checking_Options = async () => {
        if(radio === 'full'){
            await ADD_TO_Credit();
        }else if(radio === "custom"){
            const itemrate = data.Quantity * rate;
            if(creditamount <= 0 || creditamount > itemrate - 10 || creditamount === ''){
                alert('Invalid amount');
                setcreditoption(false);
            }else if((parseInt(creditamount) + parseInt(balance)) < itemrate){
                alert('Not Sufficient Balance');
                setcreditoption(false);
            }else {
                await ADD_TO_Credit_Debit();
            }
        }
    }

    const ADD_TO_Credit_Debit = async () => {
        setprocess(1);
        const itemrate = data.Quantity * rate;
        const creditvalue = parseFloat(creditamount);
        const Debitamount = parseFloat(itemrate - creditvalue);
        const empref = firestore.collection('Orders').doc(global.id).collection('Employees').doc(global.uid);
        const itemref = firestore.collection('Orders').doc(global.id).collection('Items').doc('All_Items');
        try {
            const res = await firestore.runTransaction(async t => {
                const doc = await t.get(empref);
                const T_P = await doc.data().Total_Purchased;
                const credit = await doc.data().Credit;
                const Debit = await doc.data().Debit;
                const Balance = await doc.data().Balance;
                t.update(empref, { Total_Purchased : T_P + itemrate, Credit : credit + creditvalue, Debit : Debit + Debitamount, Balance : Balance - Debitamount });
                t.update(itemref, { [data.id + '.Rate'] : parseFloat(rate), [data.id + '.empid'] : global.uid, [data.id + '.Credit'] : parseFloat(creditamount), [data.id + '.Debit'] : parseFloat(Debitamount), [data.id + '.PersonName'] : personname});
                ToastAndroid.show("Product Succesfully Purchased!", ToastAndroid.LONG);
            });
                console.log('Transaction success', res);
                setprocess(0);
                global.update = true;
                props.navigation.navigate({ routeName : 'Basket'})
        } catch (e) {
            console.log(e)
            alert("Something Bad Happen, Try Again");
        }
    }

    const Checking_Inputs = async () => {
        setprocess(1);
        if(rate <= 1 || rate === ''){
            alert('Enter the Proper Rate');
            setprocess(0);
        }else if(rate <= 0 || rate === ' ' || !rate.toString().match(/^[0-9.]*$/)){
            alert('Enter Valid Input, You can not add comma and alphabates and negative values');
            setprocess(0);
        }else if(CheckBoxvalue === true){
            if(!personname || !personname.match(/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/)){
                alert('Invalid Person Name, Enter Name of the Person from whom you take credits');
                setprocess(0);
            }else{
                setprocess(0);
                const data = await fetch_user_balance();
                setcreditoption(true);
            }
        }else{
            await ADD_From_Debit();
            setprocess(0);
        }
    }

    const HideModal = () => {
        setcreditoption(false); 
        ToastAndroid.show('Product is not Purchased', ToastAndroid.LONG)
    }

    const Back = () => {
        props.navigation.navigate('Basket')
    } 

    return(
            <View style = {{flex : 1, backgroundColor : 'white'}}>
                <View>
                    {process > 0 ? (
                        <View style = {ADD_Style.back}>
                            <View style = {{flex : 1,alignItems : 'center', justifyContent : 'center'}}>
                                <View style = {{flexDirection : 'row'}}>
                                    <ActivityIndicator size = {'small'} color = "white"/>
                                    <Text style = {{marginLeft : wp('5%'), color : 'white'}}>Purchasing</Text>
                                </View>
                            </View>
                        </View>
                    ) : ( 
                    
                    <View style = {ADD_Style.back}>
                        <AntDesign name="arrowleft" size={hp('4%')} color="white" style = {ADD_Style.Header} onPress = {() => Back()}/>
                        <View style = {{flex : 1,alignItems : 'center'}}>
                            <Text style = {{...ADD_Style.Header, ...{fontSize : hp('3%'), color : 'white',marginLeft : -wp('10%')}}}>{data.Name}</Text>
                        </View>
                    </View> )}
                </View>

                <KeyboardAwareScrollView enableAutomaticScroll = {true}>
                <View style = {ADD_Style.ImageCon}>
                    <Image source = {{ uri : data.Image }}  style = {ADD_Style.Image}/>
                </View>
                <Card style = {{...ADD_Style.Main, ...{}}}>
                    <View style= {ADD_Style.NameCon}>
                        <Text style= {ADD_Style.Name}>{data.Name}</Text>
                    </View>
                    <View style = {{flexDirection : 'row', marginTop : hp('3%')}}>
                        <Text style = {{...ADD_Style.label,...{marginLeft : wp('5%'),fontSize : hp('2.5%'),width : wp('93%'),marginTop : hp('0.5%'),color : 'gray'}}}>{data.Annonation}</Text>
                    </View>
                    <View style = {{flexDirection : 'row', marginTop : hp('3%')}}>
                        <Text style = {{...ADD_Style.label, ...{fontWeight : 'bold'}}}>Rate:</Text>
                        <TextInput 
                            style = {{height : hp('5.5%'), marginLeft : wp('2%'), fontSize : hp('2.5%'), width : wp('18%'),borderColor : 'black',borderWidth : 1,borderRadius : wp('2%'), padding : wp('2%'),backgroundColor : '#F5F6FB'}}
                            placeholder = {'0'}
                            onChangeText = {(num) => setrate(num)}
                            keyboardType = {"number-pad"}
                            editable = {true}
                        />
                        <Text style = {ADD_Style.label}><FontAwesome name="rupee" size={hp('3%')} color="black" style={{marginTop:hp('1%')}} />/{data.Unit}</Text>
                        <View style = {{flex : 1, alignSelf : 'flex-end',marginLeft : -wp('5%')}}>
                            <View style={{alignItems:'center',flexDirection:'row',justifyContent:'center'}}>
                                <CheckBox
                                    value={CheckBoxvalue}
                                    onValueChange={()=> {
                                        if(CheckBoxvalue == false){
                                            setCheckBox(true);
                                        }else {
                                            setCheckBox(false);
                                        }
                                    }}
                                />
                                <Text style={{color:'blue'}}>Credit</Text>
                            </View>
                        </View>
                    </View>
                    {CheckBoxvalue === true ? (
                        <View style = {{flexDirection : 'row', marginTop : hp('3%')}}>
                            <Text style = {{...ADD_Style.label, ...{fontWeight : 'bold'}}}>Person Name :</Text>
                            <TextInput 
                                style = {{height : hp('5.5%'), fontSize : hp('2.5%'), width : wp('50%'),borderColor : 'black',borderWidth : 1,borderRadius : wp('2%'), padding : wp('2%'),backgroundColor : '#F5F6FB'}}
                                placeholder = {'Person Name'}
                                onChangeText = {(text) => setpersonname(text)}
                                editable = {true}
                            />
                        </View>
                    ) : (null)}
                    <TouchableNativeFeedback onPress = {Checking_Inputs} disabled = {process > 0}>
                        <Card style = {ADD_Style.ButtonCon}>
                            <View style = {ADD_Style.Button}>
                                <FontAwesome name="cart-plus" size={hp('3.5%')} color="white" />
                                <Text style = {ADD_Style.ButtonText}>Purchase</Text>
                            </View>
                        </Card>
                    </TouchableNativeFeedback>
                </Card>
                <View style = {{position : 'absolute',top : hp('2%'),left : wp('3%')}}>
                    <View style = {{height : hp('8%'), width : wp('15%'), borderRadius : hp('16%')/2, backgroundColor : '#154293',overflow : 'hidden',alignItems : 'center'}}>
                        <Text style = {{color : 'white',marginTop : hp('1%'), fontSize : hp('3%'), fontWeight : 'bold'}}>{data.Quantity}</Text>
                        <Text style = {{color : 'white',marginTop : -hp('0.5%')}}>{data.Unit}</Text>
                    </View>
                </View>

                </KeyboardAwareScrollView>
                
                <Modal
                    isVisible = {creditoption}
                    onBackButtonPress = {() => HideModal()}
                >
                        <View style = {{height : hp('50%'), backgroundColor : 'white', borderRadius : wp('5%')}}>
                            <View style = {{marginTop : hp('1%'),alignItems : 'center'}}>
                                <Text style = {{fontSize : hp('3%'),color : 'blue'}}>Select One Option</Text>
                            </View>
                            <View style = {{marginTop : hp('2%'),flexDirection : 'row',marginLeft : wp('5%')}}>
                                <RadioButton 
                                    value = "full"
                                    status = {radio === 'full' ? "checked" : 'unchecked'}
                                    onPress = {() => setradio('full')}
                                />
                                <Text style = {{fontSize : hp('2.5%'),marginTop : hp('0.5%'),fontWeight : 'bold',marginRight : wp('2%'),color : 'black'}}>Take Credit of {data.Quantity * rate}</Text>
                                <FontAwesome name="rupee" size={hp('2.5%')} color="black" style={{marginTop:hp('1.2%')}} />
                            </View>

                            <View style = {{marginTop : hp('1%'),flexDirection : 'row',marginLeft : wp('5%')}}>
                                <RadioButton 
                                    value = "custom"
                                    status = {radio === 'custom' ? "checked" : 'unchecked'}
                                    onPress = {() => setradio('custom')}
                                />
                                <Text style = {{fontSize : hp('2.5%'),marginTop : hp('0.5%'),fontWeight : 'bold',marginRight : wp('2%'),color : 'black'}}>Custom</Text>
                            </View>

                            {
                                radio === "custom" ? (
                                    <View style = {{flexDirection : 'row', marginTop : hp('3%')}}>
                                        <Text style = {{...ADD_Style.label, ...{fontWeight : 'bold'}}}>Credit :</Text>
                                        <TextInput 
                                            style = {{height : hp('5.5%'), marginLeft : wp('2%'), fontSize : hp('2.5%'), width : wp('18%'),borderColor : 'black',borderWidth : 1,borderRadius : wp('2%'), padding : wp('2%'),backgroundColor : '#F5F6FB'}}
                                            placeholder = {'0'}
                                            onChangeText = {(value) => setcreditamount(value)}
                                            keyboardType = {"number-pad"}
                                            editable = {true}
                                        />
                                        <FontAwesome name="rupee" size={hp('3%')} color="black" style={{marginTop:hp('1.2%'),marginLeft : wp('3%')}} />
                                    </View>
                                ) : (null)
                            }

                            <TouchableNativeFeedback onPress = { () => Checking_Options() } disabled = {process > 0}>
                                <Card style = {{...ADD_Style.ButtonCon, ...{marginTop : hp('2%'),borderRadius : wp('5%'),width : wp('50%')}}}>
                                    <View style = {ADD_Style.Button}>
                                        <Text style = {ADD_Style.ButtonText}>Processed</Text>
                                    </View>
                                </Card>
                            </TouchableNativeFeedback>

                            <View>
                                <Text style = {{marginTop : hp('2%'), fontSize : hp('2.5%'),marginLeft : wp('10%'),fontWeight : 'bold',color : 'blue'}}>Balance : {balance} <FontAwesome name="rupee" size={hp('2.5%')} color="blue" style={{marginTop:hp('1.2%')}} /></Text>
                            </View>
                
                        </View>

                </Modal>
            </View>
    )
}