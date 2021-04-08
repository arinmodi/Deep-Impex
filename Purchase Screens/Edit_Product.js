import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TouchableNativeFeedback, Image, StyleSheet, TextInput, ToastAndroid, ActivityIndicator, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Card } from 'react-native-paper';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { AntDesign, FontAwesome, MaterialCommunityIcons } from '../Icons/icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ADD_Style } from '../AdminScreens/Place_Order_Screens/ADDItem';
import CheckBox from '@react-native-community/checkbox';
import { firestore,f } from '../config/config';
import Modal from 'react-native-modal';
import { RadioButton } from 'react-native-paper';

export default function Purchase_Product(props){

    const data = props.navigation.getParam('data');
    const [ process , setprocess ] = useState(0);
    const [ CheckBoxvalue, setCheckBox ] = useState(false);
    const [ rate, setrate ] = useState(data.Rate);
    const [personname, setpersonname] = useState(data.Credit ? data.PersonName : '') ;
    const [Quantity, SetQuantity ] = useState(data.Quantity);
    const [ Credit, setcredit ] = useState(data.Credit ? data.Credit.toFixed(1) : 0);
    const [Debit, setDebit ] = useState(data.Debit ? data.Debit.toFixed(1) : 0);
    const [ balance, setbalance ] = useState(0);
    const [ creditoption, setcreditoption ] = useState(false);
    const [ creditamount, setcreditamount ] = useState(0);
    const [ radio, setradio ] = useState('full');
    const [debitcheckbox, setdebitcheckbox] = useState(false);

    // Edit Process
    // 1. Checking Item
    const Checking_Inputs = async () => {
        setprocess(1);
        if(data.Debit && !data.Credit){
            await Checking_Inputs_For_Debit();
        }else if(!data.Debit && data.Credit){
            await Checking_Inputs_For_Credit();
        }else if(data.Debit && data.Credit){
            await Checking_Inputs_For_Debit_Credit();
        }
    }

    //2 Edit for Debit 

    //fetch user balance
    const fetch_user_balance = async () => {
        const empref = firestore.collection('Orders').doc(global.id).collection('Employees').doc(global.uid);
        var balance;

        await empref.get().then((data) => {
            balance = data.data().Balance;
            setbalance(data.data().Balance);
        })

        return balance;

    }

    // Checking Inputs
    const Checking_Inputs_For_Debit = async () => {
        if(Quantity < 0.1 || !Quantity.toString().match(/^[0-9.]*$/)){
            alert('Invalid Input Quantity');
            setprocess(0);
        }else if(rate <= 0 || rate === ' ' || !rate.toString().match(/^[0-9.]*$/)){
            alert('Enter Valid Input, You can not add comma and alphabates and negative values');
            setprocess(0);
        }else if(CheckBoxvalue === true){
            setprocess(0);
            if(!personname || !personname.match(/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/) || personname === ' '){
                alert('Invalid Person Name, Enter Name of the Person from whom you take credits');
            }else{
                const data = await fetch_user_balance();
                setcreditoption(true);
            }
        }else if(data.Quantity * data.Rate === Quantity * rate){
            alert('do not need to edit');
        }else{
            await Edit_Debit();
        }
    }

    // simple debit edit 
    const Edit_Debit = async () => {
        const empref = firestore.collection('Orders').doc(global.id).collection('Employees').doc(global.uid);
        const itemref = firestore.collection('Orders').doc(global.id).collection('Items').doc('All_Items');
        const ItemRate = parseFloat(Quantity * rate);
        try {
            const res = await firestore.runTransaction(async t => {
                const doc = await t.get(empref);
                const Balance = await doc.data().Balance + (data.Quantity * data.Rate);
                const debit = await doc.data().Debit - (data.Quantity * data.Rate);
                const T_P = await doc.data().Total_Purchased - (data.Quantity * data.Rate);
                if (Balance > ItemRate) {
                    t.update(empref, { 
                        Balance : parseFloat(Balance - ItemRate), 
                        Debit : parseFloat(debit + ItemRate), 
                        Total_Purchased : parseFloat(T_P + ItemRate) 
                    });
                    t.update(itemref, { 
                        [data.id + '.Rate'] : parseFloat(rate), 
                        [data.id + '.Debit'] : parseFloat(ItemRate), 
                        [data.id + '.Quantity'] : parseFloat(Quantity)
                    });
                    ToastAndroid.show("Product Succesfully Edited!", ToastAndroid.LONG);
                }else {
                    alert('Not Suffcient Balance');
                    return false;
                }
            });
                console.log('Transaction success', res);
                setprocess(0);
                if(res !== false){
                    global.update = true;
                    props.navigation.navigate({ routeName : 'Basket'})
                }
        } catch (e) {
            alert("Something Bad Happen, Try Again");
            console.log(e);
        }
    }

    // Converting a debit to a credit 

    // checking selected option
    const Checking_Options = async () => {
        if(radio === 'full'){
            await ADD_TO_Credit()
        }else if(radio === "custom"){
            const itemrate = Quantity * rate;
            if(creditamount <= 0 || creditamount > itemrate - 10 || creditamount === ''){
                alert('Invalid amount');
                setcreditoption(false);
            }else if((parseInt((data.Debit)) + parseInt(balance) + parseInt(creditamount)) < itemrate){
                alert('Not Sufficient Balance');
                setcreditoption(false);
            }else {
                await ADD_TO_Credit_Debit();
            }
        }
    }

    // full debit to credit
    const ADD_TO_Credit = async () => {
        setcreditoption(false)
        setprocess(1);
        const empref = firestore.collection('Orders').doc(global.id).collection('Employees').doc(global.uid);
        const itemref = firestore.collection('Orders').doc(global.id).collection('Items').doc('All_Items');
        const ItemRate = parseFloat(Quantity * rate);
        console.log(ItemRate);
        try {
            const res = await firestore.runTransaction(async t => {
                const doc = await t.get(empref);
                const T_P = await doc.data().Total_Purchased - (data.Quantity * data.Rate);
                const credit = await doc.data().Credit;
                const Balance = await doc.data().Balance + (data.Quantity * data.Rate);
                const debit = await doc.data().Debit - (data.Quantity * data.Rate);
                t.update(empref, { 
                    Total_Purchased : parseFloat(T_P + ItemRate), 
                    Credit : parseFloat(credit + ItemRate),
                    Balance : parseFloat(Balance),
                    Debit : parseFloat(debit)
                });
                t.update(itemref, { 
                    [data.id + '.Rate'] : parseFloat(rate), 
                    [data.id + '.Credit'] : parseFloat(ItemRate),
                    [data.id + '.Quantity'] : parseFloat(Quantity),
                    [data.id + '.PersonName'] : personname,
                    [data.id + '.Debit'] : f.firestore.FieldValue.delete()
                });
                ToastAndroid.show("Product Succesfully Edited!", ToastAndroid.LONG);
            });
                console.log('Transaction success', res);
                setprocess(0);
                global.update = true;
                props.navigation.navigate({ routeName : 'Basket'})
        } catch (e) {
            alert("Something Bad Happen, Try Again");
        }
    }

    //custom debit to credit

    const ADD_TO_Credit_Debit = async () => {
        setcreditoption(false)
        setprocess(1);
        const itemrate = parseFloat(Quantity * rate);
        const creditvalue = parseFloat(creditamount);
        const Debitamount = parseFloat(itemrate - creditvalue);
        const empref = firestore.collection('Orders').doc(global.id).collection('Employees').doc(global.uid);
        const itemref = firestore.collection('Orders').doc(global.id).collection('Items').doc('All_Items');
        try {
            const res = await firestore.runTransaction(async t => {
                const doc = await t.get(empref);
                const T_P = await doc.data().Total_Purchased - (data.Quantity * data.Rate);
                const credit = await doc.data().Credit;
                const debit = await doc.data().Debit - (data.Quantity * data.Rate);
                const Balance = await doc.data().Balance + (data.Quantity * data.Rate);
                t.update(empref, { Total_Purchased : T_P + itemrate, Credit : credit + creditvalue, Debit : debit + Debitamount, Balance : Balance - Debitamount });
                t.update(itemref, { 
                    [data.id + '.Rate'] : parseFloat(rate), 
                    [data.id + '.Credit'] : parseFloat(creditamount), 
                    [data.id + '.Debit'] : parseFloat(Debitamount), 
                    [data.id + '.PersonName'] : personname,
                    [data.id + '.Quantity'] : parseFloat(Quantity)
                });
                ToastAndroid.show("Product Succesfully Edited!", ToastAndroid.LONG);
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

    // 2. Edit for credit 

    // Checking inputs for credit edit
    const Checking_Inputs_For_Credit = async () => {
        if(Quantity < 0.1 || !Quantity.toString().match(/^[0-9.]*$/)){
            alert('Invalid Input Quantity');
            setprocess(0);
        }else if(rate <= 0 || rate === ' ' || !rate.toString().match(/^[0-9.]*$/)){
            alert('Enter Valid Input, You can not add comma and alphabates and negative values');
            setprocess(0);
        }else if(debitcheckbox === true){
            await credit_to_debit();
        }else if(data.Quantity * data.Rate === Quantity * rate && personname === data.PersonName){
            alert('do not need to edit');
            setprocess(0);
        }else if(!personname || !personname.match(/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/) || personname === ' '){
            alert('Invalid Inputs Person Name');
            setprocess(0);
        }else{
            await Edit_Credit();
        }
    }


    // simple credit edit
    const Edit_Credit = async () => {
        const empref = firestore.collection('Orders').doc(global.id).collection('Employees').doc(global.uid);
        const itemref = firestore.collection('Orders').doc(global.id).collection('Items').doc('All_Items');
        const ItemRate = parseFloat(Quantity * rate);
        try {
            const res = await firestore.runTransaction(async t => {
                const doc = await t.get(empref);
                const T_P = await doc.data().Total_Purchased - (data.Quantity * data.Rate);
                const credit = await doc.data().Credit - (data.Quantity * data.Rate);
                t.update(empref, { 
                    Credit : parseFloat(credit + ItemRate), 
                    Total_Purchased : parseFloat(T_P + ItemRate) 
                });
                t.update(itemref, { 
                    [data.id + '.Rate'] : parseFloat(rate), 
                    [data.id + '.Credit'] : parseFloat(ItemRate), 
                    [data.id + '.Quantity'] : parseFloat(Quantity)
                });
                ToastAndroid.show("Product Succesfully Edited!", ToastAndroid.LONG);
            });
                console.log('Transaction success', res);
                setprocess(0);
                global.update = true;
                props.navigation.navigate({ routeName : 'Basket'})
        } catch (e) {
            alert("Something Bad Happen, Try Again");
            console.log(e);
        }
    }

    // convert full credit to debit
    const credit_to_debit = async () => {
        const empref = firestore.collection('Orders').doc(global.id).collection('Employees').doc(global.uid);
        const itemref = firestore.collection('Orders').doc(global.id).collection('Items').doc('All_Items');
        const ItemRate = parseFloat(Quantity * rate);
        try {
            const res = await firestore.runTransaction(async t => {
                const doc = await t.get(empref);
                const T_P = await doc.data().Total_Purchased - (data.Quantity * data.Rate);
                const credit = await doc.data().Credit - (data.Quantity * data.Rate);
                const Debit = await doc.data().Debit;
                const Balance = await doc.data().Balance;
                if(Balance > ItemRate){
                    t.update(empref, { 
                        Credit : parseFloat(credit), 
                        Total_Purchased : parseFloat(T_P + ItemRate) ,
                        Debit : parseFloat(Debit + ItemRate),
                        Balance : Balance - ItemRate
                    });
                    t.update(itemref, { 
                        [data.id + '.Rate'] : parseFloat(rate), 
                        [data.id + '.Credit'] : f.firestore.FieldValue.delete(), 
                        [data.id + '.PersonName'] : f.firestore.FieldValue.delete(), 
                        [data.id + '.Debit'] : parseFloat(ItemRate),
                        [data.id + '.Quantity'] : parseFloat(Quantity)
                    });
                    ToastAndroid.show("Product Succesfully Edited!", ToastAndroid.LONG);
                }else {
                    alert('Not Suffcient Balance');
                    return false;
                }
            });
                console.log('Transaction success', res);
                setprocess(0);
                if(res !== false){
                    global.update = true;
                    props.navigation.navigate({ routeName : 'Basket'})
                }
        } catch (e) {
            alert("Something Bad Happen, Try Again");
            console.log(e);
        }
    }

    // 3 edit for debit and credit

    const Checking_Inputs_For_Debit_Credit = async () => {
        if(Quantity < 0.1 || !Quantity.toString().match(/^[0-9.]*$/)){
            alert('Invalid Input Quantity');
            setprocess(0);
        }else if(rate <= 0 || rate === ' ' || !rate.toString().match(/^[0-9.]*$/)){
            alert('Enter Valid Input Rate, You can not add comma and alphabates and negative values');
            setprocess(0);
        }else if( Credit === '' || !Credit.toString().match(/^[0-9.]*$/)){
            alert('Invalid Input Credit');
            setprocess(0);
        }else if(Debit === '' || !Debit.toString().match(/^[0-9.]*$/)){
            alert('Invalid Input Debit');
            setprocess(0);
        }else if(data.Quantity * data.Rate === Quantity * rate && personname === data.PersonName){
            alert('do not need to edit');
            setprocess(0);
        }else if((parseFloat(Debit) + parseFloat(Credit)) != Quantity * rate){
            console.log((parseFloat(Debit) + parseFloat(Credit)))
            alert('Invalid Inputs Credit and Debit');
            setprocess(0);
        }else if(!personname || !personname.match(/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/) || personname === ' '){
            alert('Invalid Inputs Person Name');
            setprocess(0);
        }else{
            await Edit_Debit_Credit();
        }
    }

    const Edit_Debit_Credit = async () => {
        console.log('Called')
        if(Credit == 0){
            await ADD_TO_Debit();
        }else if(Debit == 0){
            await ADD_To_Credit_For_Custom()
        }else if(Debit > 0 && Credit > 0){
            await Edit_To_Credit_Debit_For_Custom();                                                             
        }
    }

    // ADD_TO_debit 

    const ADD_TO_Debit = async () => {
        const empref = firestore.collection('Orders').doc(global.id).collection('Employees').doc(global.uid);
        const itemref = firestore.collection('Orders').doc(global.id).collection('Items').doc('All_Items');
        const ItemRate = Quantity * rate;
        try {
            const res = await firestore.runTransaction(async t => {
                const doc = await t.get(empref);
                const T_P = await doc.data().Total_Purchased;
                const credit = await doc.data().Credit;
                const Debit = await doc.data().Debit;
                const Balance = await doc.data().Balance;
                if((Balance + (data.Debit)) > ItemRate){
                    t.update(empref, { 
                        Credit : parseFloat((credit - (data.Credit))), 
                        Total_Purchased : parseFloat((T_P - (data.Quantity * data.Rate)) + parseFloat(ItemRate)),
                        Debit : parseFloat((Debit - (data.Debit))  + parseFloat(ItemRate)),
                        Balance : parseFloat((Balance + (data.Debit))  - parseFloat(ItemRate))
                    });
                    t.update(itemref, { 
                        [data.id + '.Rate'] : parseFloat(rate), 
                        [data.id + '.Credit'] : f.firestore.FieldValue.delete(), 
                        [data.id + '.PersonName'] : f.firestore.FieldValue.delete(), 
                        [data.id + '.Debit'] : parseFloat(ItemRate),
                        [data.id + '.Quantity'] : parseFloat(Quantity)
                    });
                    ToastAndroid.show("Product Succesfully Edited!", ToastAndroid.LONG);
                }else{
                    console.log('alert')
                    alert("Not Sufficcient Balance");
                    return false;
                }
            });
    
                setprocess(0);
                if(res !== false){
                    global.update = true;
                    props.navigation.navigate({ routeName : 'Basket'})
                }

        } catch (e) {
            alert("Something Bad Happen, Try Again");
            console.log(e);
        }
    }
    
    const ADD_To_Credit_For_Custom = async () => {
        const empref = firestore.collection('Orders').doc(global.id).collection('Employees').doc(global.uid);
        const itemref = firestore.collection('Orders').doc(global.id).collection('Items').doc('All_Items');
        const ItemRate = Quantity * rate;
        try {
            const res = await firestore.runTransaction(async t => {
                const doc = await t.get(empref);
                const T_P = await doc.data().Total_Purchased;
                const credit = await doc.data().Credit;
                const Debit = await doc.data().Debit;
                const Balance = await doc.data().Balance;
                t.update(empref, { 
                    Credit : parseFloat((credit - (data.Credit)) + parseFloat(Credit)), 
                    Total_Purchased : parseFloat((T_P - (data.Quantity * data.Rate)) + parseFloat(ItemRate)),
                    Debit : parseFloat((Debit - (data.Debit))),
                    Balance : parseFloat((Balance + (data.Debit)))
                });
                t.update(itemref, { 
                    [data.id + '.Rate'] : parseFloat(rate), 
                    [data.id + '.Debit'] : f.firestore.FieldValue.delete(), 
                    [data.id + '.PersonName'] : personname, 
                    [data.id + '.Credit'] : parseFloat(ItemRate),
                    [data.id + '.Quantity'] : parseFloat(Quantity)
                });
                ToastAndroid.show("Product Succesfully Edited!", ToastAndroid.LONG);
            });

                setprocess(0);
                global.update = true;
                props.navigation.navigate({ routeName : 'Basket'})
                ToastAndroid.show("Product Succesfully Edited!", ToastAndroid.LONG);

        } catch (e) {
            alert("Something Bad Happen, Try Again");
            console.log(e);
        }
    }


    const Edit_To_Credit_Debit_For_Custom = async () => {
        const empref = firestore.collection('Orders').doc(global.id).collection('Employees').doc(global.uid);
        const itemref = firestore.collection('Orders').doc(global.id).collection('Items').doc('All_Items');
        const ItemRate = Quantity * rate;
        try {
            const res = await firestore.runTransaction(async t => {
                const doc = await t.get(empref);
                const T_P = await doc.data().Total_Purchased;
                const credit = await doc.data().Credit;
                const debit = await doc.data().Debit;
                const Balance = await doc.data().Balance;
                t.update(empref, { 
                    Credit : parseFloat((credit - (data.Credit)) + parseFloat(Credit)), 
                    Total_Purchased : parseFloat((T_P - (data.Quantity * data.Rate)) + ItemRate) ,
                    Debit : parseFloat((debit - (data.Debit)) + parseFloat(Debit)),
                    Balance : parseFloat((Balance + (data.Debit)) - parseFloat(Debit))
                });
                t.update(itemref, { 
                    [data.id + '.Rate'] : parseFloat(rate), 
                    [data.id + '.Debit'] : parseFloat(Debit), 
                    [data.id + '.PersonName'] : personname, 
                    [data.id + '.Credit'] : parseFloat(Credit),
                    [data.id + '.Quantity'] : parseFloat(Quantity)
                });
                ToastAndroid.show("Product Succesfully Edited!", ToastAndroid.LONG);
            });

                setprocess(0);
                global.update = true;
                props.navigation.navigate({ routeName : 'Basket'})
                ToastAndroid.show("Product Succesfully Edited!", ToastAndroid.LONG);

        } catch (e) {
            alert("Something Bad Happen, Try Again");
            console.log(e);
        }
    }


    const HideModal = () => {
        setcreditoption(false); 
        ToastAndroid.show('Product is not edited', ToastAndroid.LONG)
    }

    return(
        <View style = {{flex : 1, backgroundColor : 'white'}}>
            <View>
                {process > 0 ? (
                    <View style = {{...ADD_Style.back,...{}}}>
                        <View style = {{flex : 1,alignItems : 'center', marginRight : wp('5%'), justifyContent : 'center'}}>
                            <View style = {{flexDirection : 'row'}}>
                                <ActivityIndicator size = {'small'} color = "white"/>
                                <Text style = {{marginLeft : wp('5%'), color : 'white',fontSize : hp('2%')}}>Editing</Text>
                            </View>
                        </View>
                    </View>
                ) : ( 
                    <View style = {{...ADD_Style.back,...{}}}>
                        <View style = {{flexDirection : 'row'}}>
                            <AntDesign name="arrowleft" size={hp('4%')} color="white" style = {ADD_Style.Header} onPress = {() => props.navigation.navigate('Basket')}/>
                            <View style = {{flex : 1, alignItems : 'center',marginLeft : -wp('15%'),justifyContent : 'center'}}>
                                <Text style = {{...ADD_Style.Header, ...{fontSize : hp('2.5%'), color : 'white'}}}>{data.Name}</Text>
                            </View>
                        </View>
                    </View>
                )}
            </View>

            <KeyboardAwareScrollView enableAutomaticScroll = {true}>
            <View style = {{...ADD_Style.ImageCon,...{height : hp('30%')}}}>
                <Image source = {{ uri : data.Image }}  style = {{...ADD_Style.Image,...{height : hp('20%')}}}/>
            </View>
            <Card style = {{...ADD_Style.Main, ...{overflow : 'hidden',height :data.Credit && data.Debit ? hp('74%') : hp('60%')}}}>
            <View style = {{flex : 1}}>
                    <View style= {ADD_Style.NameCon}>
                        <Text style= {ADD_Style.Name}>{data.Name}</Text>
                    </View>
                    <View style = {{flexDirection : 'row', marginTop : hp('3%')}}>
                        <Text style = {{...ADD_Style.label,...{marginLeft : wp('5%'),fontSize : hp('2.5%'),width : wp('93%'),marginTop : hp('0.5%'),color : 'gray'}}}>{data.Annonation}</Text>
                    </View>
                    <View style = {{flexDirection : 'row', marginTop : hp('2%')}}>
                        <Text style = {{...ADD_Style.label, ...{fontWeight : 'bold',fontSize : hp('2.5%'),marginTop : hp('1.2%')}}}>Rate : </Text>
                        <TextInput 
                            style = {{height : hp('5.5%'), marginLeft : wp('2%'), fontSize : hp('2.5%'), width : wp('18%'),borderColor : 'black',borderWidth : 1,borderRadius : wp('2%'), padding : wp('2%'),backgroundColor : '#F5F6FB'}}
                            value = {rate.toString()}
                            onChangeText = {(num) => setrate(num)}
                            keyboardType = {"number-pad"}
                            editable = {true}
                        />
                        <Text style = {ADD_Style.label}><FontAwesome name="rupee" size={hp('2.5%')} color="black" style={{marginTop:hp('1%')}} />/{data.Unit}</Text>
                    </View>
                    <View style = {{flexDirection : 'row', marginTop : hp('2%')}}>
                        <Text style = {{...ADD_Style.label, ...{fontWeight : 'bold',fontSize : hp('2.5%'),marginTop : hp('1.2%')}}}>Quantity : </Text>
                        <TextInput 
                            style = {{height : hp('5.5%'), marginLeft : wp('2%'), fontSize : hp('2.5%'), width : wp('13%'),borderColor : 'black',borderWidth : 1,borderRadius : wp('2%'), padding : wp('2%'),backgroundColor : '#F5F6FB'}}
                            value = {Quantity.toString()}
                            onChangeText = {(num) => SetQuantity(num)}
                            keyboardType = {"number-pad"}
                            editable = {true}
                        />
                        <Text style = {ADD_Style.label}>{data.Unit}</Text>
                    </View>
                    {data.Debit && !data.Credit ? (
                        <View style = {{flexDirection : 'row', marginTop : hp('3%')}}>
                            <Text style = {{...ADD_Style.label, ...{fontWeight : 'bold',fontSize : hp('2.5%')}}}>Debit :</Text>
                            <Text style = {{...ADD_Style.label, ...{fontSize : hp('2.5%'),marginLeft : wp('0%'),marginRight : wp('1%')}}}>{(Quantity * rate).toFixed(1)}</Text>
                            <FontAwesome name="rupee" size={hp('2.5%')} color="black" style={{marginTop:hp('1.5%')}} />
                            <View style = {{flex : 1, alignSelf : 'flex-end'}}>
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
                    ) : (null)}
                    {CheckBoxvalue === true ? (
                        <View style = {{flexDirection : 'row', marginTop : hp('2%')}}>
                            <Text style = {{...ADD_Style.label, ...{fontWeight : 'bold',fontSize : hp('2.5%'),marginTop : hp('1.2%')}}}>Person Name :</Text>
                            <TextInput 
                                style = {{height : hp('5.5%'), marginLeft : wp('2%'), fontSize : hp('2.5%'), width : wp('50%'),borderColor : 'black',borderWidth : 1,borderRadius : wp('2%'), padding : wp('2%'),backgroundColor : '#F5F6FB'}}
                                placeholder = {'Person Name'}
                                onChangeText = {(text) => setpersonname(text)}
                                editable = {true}
                            />
                        </View>
                    ) : (null)}
                    {!data.Debit && data.Credit ? (
                        <View>
                            <View style = {{flexDirection : 'row', marginTop : hp('2%')}}>
                                <Text style = {{...ADD_Style.label, ...{fontWeight : 'bold',fontSize : hp('2.5%'),marginTop : hp('1.2%')}}}>Person Name :</Text>
                                <TextInput 
                                    style = {{height : hp('5.5%'),fontSize : hp('2.5%'), width : wp('50%'),borderColor : 'black',borderWidth : 1,borderRadius : wp('2%'), padding : wp('2%'),backgroundColor : '#F5F6FB'}}
                                    value = {personname.toString()}
                                    onChangeText = {(name) => setpersonname(name)}
                                    editable = {true}
                                />
                            </View>
                            <View  style = {{flexDirection : 'row', marginTop : hp('3%')}}>
                                <Text style = {{...ADD_Style.label, ...{fontWeight : 'bold',fontSize : hp('2.5%')}}}>Credit :</Text>
                                <Text style = {{...ADD_Style.label, ...{fontSize : hp('2.5%'),marginLeft : wp('0%'),marginRight : wp('1%')}}}>{(Quantity * rate).toFixed(1)}</Text>
                                <FontAwesome name="rupee" size={hp('2.5%')} color="black" style={{marginTop:hp('1.5%')}} />
                                <View style = {{flex : 1, alignSelf : 'flex-end'}}>
                                    <View style={{alignItems:'center',flexDirection:'row',justifyContent:'center'}}>
                                        <CheckBox
                                            value={debitcheckbox}
                                            onValueChange={()=> {
                                                if(debitcheckbox == false){
                                                    setdebitcheckbox(true);
                                                }else {
                                                    setdebitcheckbox(false);
                                                }
                                            }}
                                        />
                                        <Text style={{color:'blue'}}>Debit</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ) : (null)}
                    {data.Debit && data.Credit ? (
                        <View>
                            <View style = {{flexDirection : 'row', marginTop : hp('2%')}}>
                                <Text style = {{...ADD_Style.label, ...{fontWeight : 'bold',fontSize : hp('2.5%'),marginTop : hp('1.2%')}}}>Person Name :</Text>
                                <TextInput 
                                    style = {{height : hp('5.5%'), marginLeft : wp('2%'), fontSize : hp('2.5%'), width : wp('50%'),borderColor : 'black',borderWidth : 1,borderRadius : wp('2%'), padding : wp('2%'),backgroundColor : '#F5F6FB'}}
                                    value = {personname.toString()}
                                    onChangeText = {(name) => setpersonname(name)}
                                    editable = {true}
                                />
                            </View>
                            <View  style = {{flexDirection : 'row', marginTop : hp('3%')}}>
                                <Text style = {{...ADD_Style.label, ...{fontWeight : 'bold',fontSize : hp('2.5%')}}}>Total :</Text>
                                <Text style = {{...ADD_Style.label, ...{fontSize : hp('2.5%'),marginLeft : wp('0%'),marginRight : wp('1%')}}}>{(Quantity * rate).toFixed(1)}</Text>
                                <FontAwesome name="rupee" size={hp('2.5%')} color="black" style={{marginTop:hp('1.5%')}} />
                            </View>
                            <View style = {{flexDirection : 'row', marginTop : hp('2%')}}>
                                <Text style = {{...ADD_Style.label, ...{fontWeight : 'bold',fontSize : hp('2.5%'),marginTop : hp('0.5%')}}}>Credit :</Text>
                                <TextInput 
                                    style = {{height : hp('5.5%'), marginLeft : wp('2%'), fontSize : hp('2.5%'), width : wp('18%'),borderColor : 'black',borderWidth : 1,borderRadius : wp('2%'), padding : wp('2%'),backgroundColor : '#F5F6FB'}}
                                    value = {Credit}
                                    onChangeText = {(value) => setcredit(value)}
                                    keyboardType = {"number-pad"}
                                    editable = {true}
                                />
                                <FontAwesome name="rupee" size={hp('3.5%')} color="black" style={{marginTop:hp('1%'),marginLeft : wp('3%')}} />
                            </View>
                            <View style = {{flexDirection : 'row', marginTop : hp('2%')}}>
                                <Text style = {{...ADD_Style.label, ...{fontWeight : 'bold',fontSize : hp('2.5%'),marginTop : hp('0.5%')}}}>Debit:</Text>
                                <TextInput 
                                    style = {{height : hp('5.5%'), marginLeft : wp('2%'), fontSize : hp('2.5%'), width : wp('18%'),borderColor : 'black',borderWidth : 1,borderRadius : wp('2%'), padding : wp('2%'),backgroundColor : '#F5F6FB'}}
                                    value = {Debit}
                                    onChangeText = {(value) => setDebit(value)}
                                    keyboardType = {"number-pad"}
                                    editable = {true}
                                />
                                <FontAwesome name="rupee" size={hp('3.5%')} color="black" style={{marginTop:hp('1%'),marginLeft : wp('3%')}} />
                            </View>
                        </View>
                    ) : (null)}
                    <TouchableNativeFeedback onPress = {Checking_Inputs} disabled = {process > 0}>
                        <Card style = {{...ADD_Style.ButtonCon, ...{marginBottom : hp('6%')}}}>
                            <View style = {ADD_Style.Button}>
                                <MaterialCommunityIcons name="cloud-upload" size={hp('3.5%')} color="white" />
                                <Text style = {ADD_Style.ButtonText}>Save</Text>
                            </View>
                        </Card>
                    </TouchableNativeFeedback>
                </View>
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
                    <View style = {{height : hp('45%'), backgroundColor : 'white', borderRadius : wp('5%')}}>
                        <View style = {{marginTop : hp('1%'),alignItems : 'center'}}>
                            <Text style = {{fontSize : hp('3%'),color : 'blue'}}>Select One Option</Text>
                        </View>
                        <View style = {{marginTop : hp('2%'),flexDirection : 'row',marginLeft : wp('5%')}}>
                            <RadioButton 
                                value = "full"
                                status = {radio === 'full' ? "checked" : 'unchecked'}
                                onPress = {() => setradio('full')}
                            />
                            <Text style = {{fontSize : hp('2.5%'),marginTop : hp('0.5%'),fontWeight : 'bold',marginRight : wp('2%'),color : 'black'}}>Take Credit of {Quantity * rate}</Text>
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
                                        style = {{height : hp('5.5%'), marginLeft : wp('2%'), fontSize : hp('2.5%'), width : wp('20%'),borderColor : 'black',borderWidth : 1,borderRadius : wp('2%'), padding : wp('2%'),backgroundColor : '#F5F6FB'}}
                                        placeholder = {'0'}
                                        onChangeText = {(value) => setcreditamount(value)}
                                        keyboardType = {"number-pad"}
                                        editable = {true}
                                    />
                                    <FontAwesome name="rupee" size={hp('3.5%')} color="black" style={{marginTop:hp('1%'),marginLeft : wp('3%')}} />
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