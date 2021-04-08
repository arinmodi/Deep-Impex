import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableNativeFeedback, ToastAndroid } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card } from 'react-native-paper';
import { FontAwesome } from '../Icons/icons';
import { Transfer_Style } from './Transfer';
import { firestore, f } from '../config/config';
import { Styles } from '../User_HistoryScreens/Analytics';
import Modal from 'react-native-modal';
import Loading from '../Component/Loading';
import SubHeader from '../Component/SubScreenHeader';

export default function Person_Credits(props){

    const name = props.navigation.getParam('Name');
    const data = props.navigation.getParam('data');
    const id = props.navigation.getParam('id');
    const [ visible, setvisible ] = useState(false);
    const [ selectedcredit, setselectedcredit ] = useState([]);
    const [ process, setprocess ] = useState(0);

    const hideModal = () => {
        setselectedcredit([]);
        setvisible(false);
    }

    const onPay = async (data) => {
        if(global.id){
            const uid = f.auth().currentUser.uid;
            const ref = firestore.collection('Orders').doc(global.id).collection('Employees').doc(uid);
            console.log(await ref.get().then(data => { return data.exists }))
            if(await ref.get().then(data => { return data.exists })){
                setselectedcredit(data);
                setvisible(true);
            }else{
                alert("Not have any Balance");
            }
        }else{
            alert("Not have any Balance");
        }
    }

    const onYesPress = async () => {
        setprocess(2);
        const uid = f.auth().currentUser.uid;
        const empref = firestore.collection('Orders').doc(global.id).collection('Employees').doc(uid);
        const empref2 = firestore.collection('Credits').doc(id).collection('Employees_Credits').doc(uid);
        const credit = selectedcredit.Amount;
        try {
            const res = await firestore.runTransaction(async t => {
                const doc = await t.get(empref);
                const doc2 = await t.get(empref2);
                const Balance = await doc.data().Balance - parseFloat(credit);
                const Credit_Paid = await doc.data().Credit_Paid
                const Total = await doc2.data().Total - parseFloat(credit);
                console.log(Balance)
                if(Balance > 0){
                    if(Credit_Paid){
                        t.update(empref, {
                            Balance : Balance,
                            Credit_Paid : parseFloat(Credit_Paid) + parseFloat(credit)
                        })
                    }else{
                        t.update(empref, {
                            Balance : Balance,
                            Credit_Paid : parseFloat(credit)
                        })
                    }

                    if(Total > 0){
                        t.update(empref2,{
                            Total : Total,
                            [selectedcredit.id] : f.firestore.FieldValue.delete()
                        })
                    }else if(Total === 0){
                        t.delete(empref2);
                    }

                    return true;
                }else{
                    alert('Not Sufficient Balance');
                    return false;
                }
            });

            if(res === true){
                hideModal();
                ToastAndroid.show('Credit Succesfully Transfered!', ToastAndroid.LONG);
                props.navigation.navigate({routeName : 'MainC', params : {update : true}});
                global.update = true;
                setprocess(0);
            }else{
                hideModal();
                setprocess(0);
            }

        } catch (e) {
            alert("Something Bad Happen, Try Again");
            setprocess(0);
            console.log(e);
        }
    }

    return(
        <View style = {{flex : 1}}>

            <SubHeader 
                Name = {name}
                onPress = {() => props.navigation.navigate('Credit_Ana')}
            />

            <FlatList 
                style = {{height : hp('90%')}}
                data = {data}
                showsVerticalScrollIndicator = {false}
                keyExtractor = {(item,index)=>index.toString()}
                renderItem = {(data) => 
                    <Card style = {{height : hp('5%'),marginVertical : hp('1.5%'), height : hp('7%'),elevation : 10,marginHorizontal : wp('2.5%'),flex : 1}}>
                        <View style = {{flexDirection : 'row'}}>
                            <View style = {{marginLeft : wp('1%'), flexDirection : 'row',marginTop : hp('1.8%'),width : wp('50%')}}>
                                <Text style = {{fontSize : hp('2.2%'), fontWeight : 'bold',marginLeft : wp('3%'),color : 'black'}}>{data.item.ItemName}</Text>
                            </View> 
                            <View style = {{marginTop : hp('1.8%'),marginLeft : wp('3%')}}>
                                <View style = {{flexDirection : 'row',marginRight : wp('3%')}}>
                                    <Text style = {{fontSize : hp('2.2%'),color : 'red',marginRight : wp('1%'),color : 'red'}}>{data.item.Amount}</Text>
                                    <FontAwesome name="rupee" size={hp('2.2%')} color="red" style={Styles.icon} />
                                </View>
                            </View>
                            <TouchableNativeFeedback onPress = {() => onPay(data.item)}>
                                <Card style = {{...Transfer_Style.Pay, ...{marginLeft : wp('5%'), marginTop : hp('1%')}}}>
                                    <Text style = {{color : 'white',marginLeft : wp('5%'),fontSize : hp('2.5%'),fontWeight : 'bold',marginTop : hp('0.7%')}}>Pay</Text>
                                </Card>
                            </TouchableNativeFeedback>
                        </View>
                    </Card>
                }
            />

            <Modal
                animationIn = 'fadeIn'
                isVisible = {visible}
                onBackButtonPress= {hideModal}
                onBackdropPress = {hideModal}
            >

                <View style={{backgroundColor : 'white',height : hp('25%'),borderRadius  : hp('3%'),overflow : 'hidden'}}>
                    <Text style={{marginTop : hp('2%'),marginLeft : wp('5%'),fontSize : hp('2.5%'),color : 'black'}}>Are You Sure about giving {selectedcredit.Amount} <FontAwesome name="rupee" size={hp('2.5%')} color="black" style={Styles.icon} /> to {name} </Text>

                    <View style={{flexDirection : 'row',justifyContent : 'space-around'}}>
                        <View style={{...Credit_styles.ButtonMainCon,...{marginHorizontal : wp('0%')}}}>
                            <TouchableNativeFeedback onPress = {() => onYesPress()}>
                                <Card style={{...Credit_styles.Button,...{width : wp('25%'),backgroundColor : 'red'}}}>
                                    <Text style={Credit_styles.Button_text}>Yes</Text>
                                </Card>
                            </TouchableNativeFeedback>
                        </View>
                        <View style={{...Credit_styles.ButtonMainCon,...{marginHorizontal : wp('0%')}}}>
                            <TouchableNativeFeedback onPress = {() => hideModal()}>
                                <Card style={{...Credit_styles.Button,...{width : wp('25%')}}}>
                                    <Text style={Credit_styles.Button_text}>No</Text>
                                </Card>
                            </TouchableNativeFeedback>
                        </View>
                    </View>
                </View>
            </Modal>

            <Loading 
                isVisible = {process > 0}
                data = "Paying Wait..."
            />

        </View>
    )
}

const Credit_styles = StyleSheet.create({
    ButtonMainCon : {
        marginTop : hp('4%'),
        marginHorizontal : wp('30%')
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
    }
})