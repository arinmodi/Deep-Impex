import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,Dimensions, Image, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { fetch_Order_id  } from '../Component/functions/Order_Details';
import { Order_Status } from '../Component/Order_Status';
import Load from '../Component/loaddata';
import { connect } from 'react-redux';
import { fetch_emp_data } from '../App-Store/Actions/Order_Emp_Data';

function UO(props){

    const [ Orderid, SetOrderid ] = useState('');
    const [ OrderName, SetOrderName ] = useState('');
    const [ WalletAmount, SetWalletAmount ] = useState(0);
    const [ loading, Setloading ] = useState(true);
    const [ remaing_balance, Setremaing_balance ] = useState(0);
    const [ refreshing, setrefreshing ] = useState(false);
    const [ date, setdate ] = useState()
    

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
    }

    if(loading === false){
        return(
            <ScrollView  refreshControl = { <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> } >
                    <View style={{flex:1}}>
                        {Orderid !== '' ? (
                            <View style  = {{flex :1}}>
                                {props.Load === false ? (
                                    <View>
                                        {Object.keys(props.Order_Status).length > 0 ? (
                                            <Order_Status 
                                                OrderName = {OrderName}
                                                date = {date}
                                                colors = {props.Order_Status.colors}
                                                data = {props.Order_Status.maindata}
                                                empdata = {props.Order_Status.empdata}
                                                WalletAmount = {WalletAmount}
                                                remaing_balance = {remaing_balance}
                                                nav = {'user'}
                                            />
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
        
                                <Image source = {require('../assets/no_order.png')} style = {{ marginVertical : hp('2%'), height : hp('30%'), width : wp('55%'), marginHorizontal : wp('22%'), resizeMode : 'contain',marginTop : hp('10%')}}/>
                                <Text style = {{...styles.Title,...{fontWeight : 'normal',color : '#154293'}}}>No Order Today!</Text>
                                <Text style = {{...styles.Title,...{fontWeight : 'bold',marginTop : hp('1%')}}}>Enjoy</Text>
                            </View>
                        )}
                    </View>
            </ScrollView>
        )
    }else {
        return(
            <Load 
                style = {{flex : 1}}
            />
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

export default connect(mapStateToProps , mapDispatchToProps)(UO);