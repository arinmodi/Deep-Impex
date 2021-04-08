import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,Dimensions, Image, ActivityIndicator, RefreshControl, ScrollView, ToastAndroid } from 'react-native';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { fetch_Order_id  } from '../../Component/functions/Order_Details';
import { Order_Status } from '../../Component/Order_Status';
import Load from '../../Component/loaddata';
import { connect } from 'react-redux';
import { fetch_emp_data } from '../../App-Store/Actions/Order_Emp_Data';
import Header from '../../Component/Header';
import {  Button } from 'react-native-paper';
import { Ionicons  } from '../../Icons/icons';
import { firestore,database } from '../../config/config';
import { createPDF, Store_Report } from '../Component/Report_functions';
import { htmlContent } from '../Component/pdflayout';

import { PhtmlContent  }  from '../Component/Purchase_Person_Report';
import Loding from '../../Component/Loading';
import moment from 'moment';

function Status(props){

    const [ Orderid, SetOrderid ] = useState('');
    const [ OrderName, SetOrderName ] = useState('');
    const [ WalletAmount, SetWalletAmount ] = useState(0);
    const [ loading, Setloading ] = useState(true);
    const [ remaing_balance, Setremaing_balance ] = useState(0);
    const [ refreshing, setrefreshing ] = useState(false);
    const [ date, setdate ] = useState();
    const [ process, setprocess ] = useState(0);
    

    const fetch_details = async () => {
        const details = await fetch_Order_id();
        global.id = details.id;

        if(details !== false){
            var date = details.Date.toDate();
            props.Fetch_Emp_Data(details.id, details.remaining);
            SetOrderName(details.name);
            SetWalletAmount(details.wallet);
            SetOrderid(details.id);
            Setremaing_balance(details.remaining);
            setdate(date);
            Setloading(false);
        }else {
            Setloading(false);
        }
    }

    useEffect(() => {
        fetch_details();
    }, [])

    const onRefresh = () => {
        setrefreshing(true);
        fetch_details().then(
            () => {
                setrefreshing(false);
            }
        );
    };

    const Generate_Bill = async () => {
        setprocess(2);
        var itemdata = [];
        var reportdata = [];
        const id = Orderid;
        const dbref = database.ref('Accepted_Employee');
        const ref = firestore.collection('Orders').doc(id).collection('Items').doc('All_Items');
        var total_credit = 0;
        var total_debit = 0;

        await ref.get().then(async (data) => {
            const items = data.data();
            var SrNo = 1;
            for(var item in items){
                var obj = items[item];
                var name;
                if(obj.Rate){
                    await dbref.child(obj.empid).once('value').then((data) => name = data.val().UserName);
                    var UserName = name.split(" ");
                    UserName = UserName[0];
                    obj.Credit > 0 ? total_credit += obj.Credit : null;
                    obj.Debit > 0 ? total_debit += obj.Debit : null;
                    itemdata.push({
                        Name :obj.Name,
                        Quantity : obj.Quantity,
                        Rate : obj.Rate,
                        SrNo : SrNo,
                        Total : parseFloat(obj.Rate * obj.Quantity),
                        Unit : obj.Unit,
                        By : UserName,
                        credit : obj.Credit > 0 ? obj.Credit : 0,
                        debit : obj.Debit > 0 ? obj.Debit : 0,
                    })
                    SrNo += 1;
                }

            }
            console.log(itemdata)
        });

        var Date = moment(date).format('DD/MM/YYYY')
        reportdata.push({
            Name : OrderName,
            Date : Date,
            Wallet : WalletAmount,
            Items : itemdata,
            Credit : total_credit,
            Debit : total_debit
        })
        await PDFcreation(reportdata);

    }

    const Generate_PersonBill = async (data) => {
        setprocess(2);
        var person_report_data = [];
        var itemsdata = [];
        const empid = data.empid;
        var credit = 0;
        var debit = 0;
        var rem = 0;
        var PreBal = 0;
        var purchase = 0;
        var wallet = 0;

        const empref = firestore.collection('Orders').doc(Orderid).collection('Employees');
        const ordererf = firestore.collection('Orders').doc(Orderid).collection('Items').doc('All_Items');

        await empref.doc(empid).get().then((ddata) => {
            if(ddata.exists){
                var edata = ddata.data();

                return(
                    credit = edata.Credit,
                    debit = edata.Debit,
                    rem = edata.Balance,
                    PreBal = edata.Extra ? edata.Extra : 0,
                    purchase = edata.Total_Purchased,
                    wallet = edata.wallet
                )
            }
        })

        await ordererf.get().then( async (orderitems) => {
            const items = orderitems.data();
            console.log('Called3')
            var SrNo = 1;
            for(var item in items){
                const obj = items[item];
                if(obj.empid === empid){
                    if(obj.Rate){
                        itemsdata.push({
                            Name :obj.Name,
                            Quantity : obj.Quantity,
                            Rate : obj.Rate,
                            SrNo : SrNo,
                            Total : parseFloat(obj.Rate * obj.Quantity),
                            Unit : obj.Unit,
                            credit : obj.Credit > 0 ? obj.Credit : 0,
                            debit : obj.Debit > 0 ? obj.Debit : 0,
                        });
                        SrNo = SrNo + 1;
                    }
                }
            }
        });

        if(itemsdata.length > 0 ){
            var date = new Date();
            date = moment(date).format('DD/MM/YYYY')
            person_report_data.push({
                Name : OrderName,
                Date : date,
                Items : itemsdata,
                Credit : credit,
                Debit : debit,
                purchase : purchase,
                PreBal : PreBal,
                Rem : rem,
                wallet : wallet,
                UserName : data.name
            })
        }

        await PPDFcreation(person_report_data,data.name);
    }

    const PPDFcreation = async (rdata,name) => {

        if(rdata.length <= 0){
            alert('Data Not found');
            setprocess(0);
        }else{
            const data = await createPDF(rdata,PhtmlContent);
            if(data !== null && data !== false && data){
                PdownloadFile(data,name);
            }else{
                alert('something bad happen, try again');
                setprocess(0);
            }
        }
    }

    const PdownloadFile = async (data,pname) => {
        let fileuri = data.uri;
        const name = pname + '-' + moment(new Date()).format("DD-MM-YYYY");
        await Store_Report(fileuri,name,'Person_Purchase_Reports');
        setprocess(0);
        ToastAndroid.show('Bill Created, Check in Reports', ToastAndroid.LONG);
    }

    const PDFcreation = async (rdata) => {

        if(rdata.length <= 0){
            alert('Data Not found');
            setprocess(0);
        }else{
            const data = await createPDF(rdata,htmlContent);
            if(data !== null && data !== false && data){
                downloadFile(data);
            }else{
                alert('something bad happen, try again');
                setprocess(0);
            }
        }
    }

    const downloadFile = async (data) => {
        let fileuri = data.uri;
        const name = moment(new Date()).format("DD-MM-YYYY");
        await Store_Report(fileuri,name,'Reports');
        setprocess(0);
        ToastAndroid.show('Bill Created, Check in Reports', ToastAndroid.LONG);
    }

    if(loading === false){
        return(
            <View style = {{flex : 1}}>
            
            <Header 
                Name = {'Status'}
                onPress = {() => props.navigation.toggleDrawer()}
            />
            
            <ScrollView  refreshControl = { <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> } >
                <View style={{flex:1}}>
                    {Orderid !== '' ? (
                        <View style  = {{flex :1}}>
                            {props.Load === false ? (
                                <View>
                                    {Object.keys(props.Order_Status).length > 0 ? (
                                        <View>
                                            <Order_Status 
                                                OrderName = {OrderName}
                                                date = {date}
                                                colors = {props.Order_Status.colors}
                                                data = {props.Order_Status.maindata}
                                                empdata = {props.Order_Status.empdata}
                                                WalletAmount = {WalletAmount}
                                                remaing_balance = {remaing_balance}
                                                nav = {'status'}
                                                onPress = {(data) => Generate_PersonBill(data)}
                                            />
                                            <Button 
                                            style = {{backgroundColor : '#154293',marginHorizontal : wp('20%'),marginTop : hp('4%'),marginBottom : hp('2%'),elevation : 5,borderRadius : wp("3%"),height : hp('6%')}}
                                            labelStyle = {{color : 'white'}}
                                            icon = {() => {
                                                return(   <Ionicons name="ios-newspaper-outline" size={hp('2.8%')} color="white" /> );
                                            }}
                                            onPress = {Generate_Bill}
                                            >Generate Bill</Button>

                                            <Loding 
                                                isVisible = {process > 0}
                                                data = "Generating..."
                                            />
                                        </View>
                                    ):(<Load 
                                        style = {{marginTop : hp('20%')}}
                                    />)}
                                </View>
                            ) : (<Load 
                                style = {{flex : 1}}
                            />)}
                        </View>
                    ) : (
                        <View>
                            <Image source = {require('../../assets/no_order.png')} style = {{ marginVertical : hp('2%'), height : hp('30%'), width : wp('55%'), marginHorizontal : wp('22%'), resizeMode : 'contain',marginTop : hp('10%')}}/>
                            <Text style = {{...styles.Title,...{fontWeight : 'normal',color : '#154293'}}}>No Order Today!</Text>
                            <Text style = {{...styles.Title,...{fontWeight : 'bold',marginTop : hp('1%')}}}>Enjoy</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
            </View>
        )
    }else {
        return(
            <View style = {{flex : 1}}>
            <Header 
                    Name = {'Status'}
                    onPress = {() => props.navigation.toggleDrawer()}
                />
            <Load 
                style = {{flex : 1}}
            />
            </View>
        )
    }
    
}

export const styles = StyleSheet.create({
    Title : {
        textAlign:'center',
        fontSize:Dimensions.get('screen').width<400?wp('6%'):wp('5%'),
        marginTop:hp('3%'),
    },
    Order : {
        marginTop:hp('3%'),
        marginHorizontal:wp('3%'),
        height:hp('45%'),
        borderRadius:wp('3%'),
        elevation:15,
        marginBottom : hp('2%')
    },
    OrderText:{
        fontSize:Dimensions.get('screen').width<400?hp('3%'):hp('3%'),
        fontWeight:'bold',
        color:'black',
        textAlign:'left',
        marginHorizontal:wp('5%'),
    },
    OrderDate : {
        fontWeight : 'bold',
        fontSize : hp('2.5%'),
        marginRight : wp('3%'),
        marginTop : hp('0.7%')
    },
    OrderText2:{
        fontSize:Dimensions.get('screen').width<400?hp('3%'):hp('2.5%'),
        color:'red',
        marginHorizontal:wp('2%'),
    },
    ImageBackground:{
        height:Dimensions.get('screen').width<400?hp('30%'):hp('26%'),
        width:Dimensions.get('screen').width<400?wp('60%'):wp('50%'),
        marginTop:hp('1%'),
        marginLeft:wp('1%')
    },
    icon : {
        marginVertical:hp('2.5%'),
        marginLeft:wp('3%')
    },
    wallettext : {
        fontSize:hp('3%'),
        marginVertical:hp('2.5%'),
        color:'white'
    },
    main : {
        flexDirection : 'row',
        marginLeft : wp('3%'),
        marginTop : hp('1.5%')
    },
    squre : {
        height : hp('3.5%'),
        width : wp('10%'),
        marginTop : hp('0.5%')
    },
    empname : {
        marginLeft : wp('3%'),
        marginTop : hp('0.5%'),
        fontSize : hp('2.5%'), 
        fontWeight : 'bold',
        width : wp('25%'),
    },
    image : {
        height : Dimensions.get('screen').width<400?hp('4.5%') : hp('5%'),
        width : wp('9%'),
        borderRadius : Dimensions.get('screen').width<400?hp('4.5%')/2 : hp('5%')/2,
    },
    debited : {
        marginRight : wp('3%'),
        fontSize : hp('2.5%'), 
        color : 'red',
        marginTop : hp('0.5%')
    }
})

const mapDispatchToProps = (dispatch) => {
    return {
        Fetch_Emp_Data : (id, rem) => { dispatch(fetch_emp_data(id, rem)) },
    }
}

const mapStateToProps = (state) => {
    return {
       Order_Status : state.Order_status_reducer.Status_Data,
       Load : state.Order_status_reducer.Load
    }
}

export default connect(mapStateToProps , mapDispatchToProps)(Status);