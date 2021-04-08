import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, ToastAndroid, Dimensions } from 'react-native';
import { Card } from 'react-native-paper';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { FontAwesome, Ionicons } from '../Icons/icons';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { firestore, f, database } from '../config/config';
import Loading from '../Component/Loading';

export default function Pay(props){

const data = props.navigation.getParam('data');
const [ input, setinput ] = useState(0);
const [ process, setprocess ] = useState(0);

const onBack = () => {
    props.navigation.navigate('Transfer');
}

const Checking_Balance = async () => {
    setprocess(1);
    if(input <= 1){
        alert('please enter a valid input');
        setprocess(0);
    }else if((input === ' ' || !input.toString().match(/^[0-9]*$/))){
        alert('Enter valid input and do not include comma and dots');
        setprocess(0);
    }else{
        await Transfer();
        setprocess(0);
        props.navigation.navigate('Transfer');
    }
}

const Transfer = async () => {
    console.log(global.id)
    const uid = f.auth().currentUser.uid;
    const empref = firestore.collection('Orders').doc(global.id).collection('Employees');
    var remaining_balance = null;
    const remaining_balance_ref = await database.ref('Accepted_Employee').child(data.id).child('Remaining_Balance').once('value').then(data => { 
        return data.val();
    });

    if(remaining_balance_ref !== null){
        remaining_balance = remaining_balance_ref.Amount;
    }
    const ref1 = empref.doc(uid);
    const ref2 = empref.doc(data.id)
    try {
        const res = await firestore.runTransaction(async t => {
            const doc = await t.get(ref1);
            const PreBal = doc.data().Extra;
            var Balance;
            if(PreBal > 0){
                Balance = await doc.data().Balance - PreBal;
            }else{
                Balance = await doc.data().Balance
            }
            const wallet = await doc.data().wallet;
            if(Balance > input){
                if(PreBal > 0){
                    Balance = Balance + PreBal;
                }
                const empdoc = await t.get(ref2);
                if(empdoc.exists){
                    const empwallet = empdoc.data().wallet;
                    const pbalance = await empdoc.data().Balance;
                    t.update(ref2, {
                        Balance : parseFloat(pbalance + parseFloat(input)),
                        wallet : empwallet + parseFloat(input)
                    })
                    t.update(ref1, {
                        Balance : parseFloat(Balance - parseFloat(input)),
                        wallet : parseFloat(wallet - parseFloat(input))
                    })
                }else{
                    if(remaining_balance !== null){
                        t.set(ref2, {
                            Balance : parseFloat(input) + parseFloat(remaining_balance),
                            Credit : 0,
                            Debit : 0,
                            Total_Purchased : 0,
                            wallet : parseFloat(input),
                            Extra : parseFloat(remaining_balance)
                        })
                    }else{
                        t.set(ref2, {
                            Balance : parseFloat(input),
                            Credit : 0,
                            Debit : 0,
                            Total_Purchased : 0,
                            wallet : parseFloat(input),
                        })
                    }
                    t.update(ref1, {
                        Balance : parseFloat(Balance - parseFloat(input)),
                        wallet : parseFloat(wallet - parseFloat(input))
                    })
                }
                return true;
            }else{
                alert('Insufficient Balance');
                return false;
            }
        });
            console.log('Transaction success', res);
            if(res === true){
                ToastAndroid.show('Balance Transfered', ToastAndroid.LONG)
            }
    } catch (e) {
        console.log(e)
        alert("Something Bad Happen, Try Again");
    }
}

return(
        <View>
            <View style = {Pay_Style.header}>
                <View style = {{marginTop : hp('4%'),marginLeft : wp('5%')}}>
                    <Ionicons name="ios-arrow-back" size={hp('5%')} color="white" onPress = {() => onBack()}/>
                </View>
                <View style = {{alignItems : 'center'}}>
                    <Image style = {Pay_Style.Image} source = {{uri : data.Image}}/>
                    <Text style = {Pay_Style.headertext}>{data.Name}</Text>
                </View>
            </View>

            <View style = {{alignItems : 'center'}}>
                <View style = {Pay_Style.container}>
                    <FontAwesome name="rupee" size={hp('5%')} color="black" style = {Pay_Style.icon}/>
                    <TextInput 
                        style = {Pay_Style.input}
                        keyboardType = {'numeric'}
                        onChangeText = {(val) => setinput(val)}
                    />
                </View>
            </View>
            
            <View style = {{alignItems : 'center'}}>
                <Card style = {Pay_Style.Pay}>
                    <TouchableNativeFeedback onPress = {() => Checking_Balance()}>
                        <Text style = {{color : 'white',marginLeft : wp('5%'),fontSize : hp('3%'),fontWeight : 'bold',marginTop : hp('0.7%')}}>Pay</Text>
                    </TouchableNativeFeedback>
                </Card>
            </View>

            <Loading 
                isVisible = {process > 0}
                data = "Transfering Wait..."
            />
        </View>
    )
}

const Pay_Style = StyleSheet.create({
    header : {
        height : Dimensions.get('screen').width<400?hp('35%') : hp('38%'),
        backgroundColor : '#154293',
    },
    headertext : {
        fontSize : hp('3%'),
        color : 'white',
        marginTop : hp('2%'),
        fontWeight : 'bold',
    },
    container : {
        marginTop : hp('15%'),
        flexDirection : 'row',
        alignItems : 'center'
    },
    Image: {
        height : Dimensions.get('screen').width<400?hp('17%'): hp('19%'),
        width : wp('33%'),
        marginTop : hp('1%'),
        borderRadius : hp('17%')
    },
    Pay : {
        width : wp('20%'),
        height : hp('6%'),
        elevation : 15,
        backgroundColor : '#154293',
        marginTop : hp('8%')
    },
    icon : {
        //marginLeft : wp('25%')
    },
    input : {
        height:hp('5.5%'),
        borderColor:'black',
        width : wp('50%'),
        borderWidth:1,
        fontSize:hp('2.5%'),
        marginVertical:hp('3%'),
        marginLeft:wp('3%'),
        borderRadius : wp('2%'),
        backgroundColor : '#F5F6FB',
        padding : wp('2%')
    }
})
