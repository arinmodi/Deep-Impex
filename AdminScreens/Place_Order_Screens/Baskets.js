import React, { useEffect, useState } from 'react';
import {  View,  Text, BackHandler } from 'react-native';
import { Styles } from './BasketItem';
import { Ionicons,MaterialCommunityIcons } from '../../Icons/icons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import DropDownPicker from 'react-native-dropdown-picker';
import Basket from '../Component/All_Baskets';
import { connect } from 'react-redux';
import { Fetch_Orders_Basket_Data } from '../../App-Store/Actions/Basket_And_Items';
import Load from '../../Component/loaddata';
import SubHeader from '../../Component/SubScreenHeader';

function Baskets(props){
    const [ days, setdays ] = useState( '10' );
    const [ loading, setloading ] = useState(true);

    useEffect(() => {
        setloading(true);
        props.Fetch_Orders_Basket_Data(days);
        setloading(false);
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            Back
        );
    
        return () => backHandler.remove();
    },[days]);

    function NavToBasketitem(name , Wallet, id, Date,Rem){
        props.navigation.navigate({routeName : 'BasketItems',
            params : {
                Wallet : Wallet,
                Name : name,
                id : id,
                Date : Date,
                Rem : Rem,
                nav : 'baskets'
            }
        })
    }

    const Back = () => {
        props.navigation.navigate({routeName : 'order', params : { update : true }})
    }

    return(
        <View style = {{flex : 1}}>
            <SubHeader 
                Name = {'Orders'}
                onPress = {() => Back()}
            />
            <View style = {{flexDirection: 'row',alignItems : 'center',marginTop : hp('2%'),marginLeft : wp('3%')}}>
                <Text style={{...Styles.Title,...{marginLeft : wp('3%'), color : 'black', marginTop : hp('0%')}}}>Select Days</Text>
                <DropDownPicker
                    items={[
                        {label: '1 week', value: '7'},
                        {label: '1 month', value: '30'},
                        {label: '3 month', value: '90'},
                        {label: '6 month', value: '180'},
                        {label: '1 year', value: '365'},
                        {label: 'All', value: '0'},
                    ]}
                    placeholder = "10 Days"
                    containerStyle={{height: hp('5%'),width : wp('30%'),marginLeft : wp('30%')}}
                    style={{backgroundColor: '#fafafa'}}
                    itemStyle={{
                        justifyContent: 'flex-start'
                    }}
                    dropDownStyle={{backgroundColor: '#fafafa'}}
                    onChangeItem={item => { setloading(true),setdays(item.value),setloading(false) }}
                    labelStyle = {{ color : 'black' }}
                />
            </View>

            {props.Load_Basket || loading === false ? (
                <View style={{flex : 1}}>
                    {props.Baskets.length < 0 ? (
                        <View style={{flex : 1,justifyContent :'center',alignItems : 'center'}}>
                            <MaterialCommunityIcons name="truck-check" size={hp('12%')} color="#A9A9B8" />
                            <Text style={{marginTop : hp('1%'), fontSize : hp('2.5%'),color : '#A9A9B8'}}>No Orders Found</Text>
                        </View>
                    ):(
                        <Basket 
                            data={props.Baskets}
                            NavToBasketitem = {(Name, Wallet, id, Date,Rem) => {NavToBasketitem(Name, Wallet, id, Date,Rem)}}
                        />
                    )}
                </View>
            ):(
                <Load style = {{flex : 1}}/>
            )}
        </View>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        Fetch_Orders_Basket_Data : (days) => { dispatch(Fetch_Orders_Basket_Data(days)) },
    }
}

const mapStateToProps = (state) => {
    return {
        Baskets: state.Basket.Basket_Data,
        Load_Basket : state.Basket.Load_Basket
    }
}

export default connect(mapStateToProps , mapDispatchToProps)(Baskets); 