import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import { Fetch_Pending_Items } from '../../App-Store/Actions/Basket_And_Items';
import { Feather, FontAwesome5 } from '../../Icons/icons';
import { styles } from '../Component/styles';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { styles as item } from '../../Component/BasketItemGrid';
import { Card } from 'react-native-paper';
import Confirmation from '../../Component/ConfirmationModal';
import { firestore } from '../../config/config';
import Load from '../../Component/loaddata';
import Header from '../../Component/Header';

function Pending(props){

    const [modalD , setmodalD] = useState(false);
    const [  id, setid ] = useState('');
    const [ load, setload ] = useState(true);

    const HidemodalD = () => {
        setid('');
        setmodalD(false);
    };

    const Delete = async () => {
        const ref = firestore.collection('Pending_Items').doc(id);
        await ref.delete();
        ToastAndroid.show("Item Deleted!", ToastAndroid.LONG);
        HidemodalD();
        
    };

    const onRemove = (id) => {
        setid(id);
        setmodalD(true);
    }

    useEffect(() =>  {
        props.Fetch_Pending_Items_Data();
        console.log(props.Pending_Items.length)
        setload(false);
    }, []);

    const onPress = (data) => {
        props.navigation.navigate({routeName : 'List',params: { data : data}});
    }


    return(
        <View style = {{flex : 1}}>
            <Header 
                  Name = {'Pending'}
                  onPress = {() => props.navigation.toggleDrawer()}
            />

            {props.Load_Pending_Items === false ? (
                <View style = {{flex : 1}}>
                    {props.Pending_Items.length > 0 ? (
                        <View>
                            <FlatList
                                style={{marginTop : hp('1%'),marginBottom : hp('0.5%')}}
                                keyExtractor = {(item,index)=>index.toString()}
                                data={props.Pending_Items}
                                renderItem={(data) => 
                                    <View style={item.Main}>    
                                        <Card style={{...item.card,...{height : hp('15%')}}}>
                                            <View style={{flexDirection:'row'}}>
                                                <View style = {{alignItems : 'center',marginTop:hp('1%')}}>
                                                    <Image source = {{uri : data.item.Image}} style = {item.Image}/>
                                                </View>

                                                <View>
                                                    <View style={item.itemName}>
                                                        <Text style={{...item.itemtext, ...{fontWeight:'bold'}}}>{data.item.Name}</Text>
                                                    </View>

                                                    <View style={item.itemQuan}>
                                                        <Text style={item.itemtext}>{data.item.Quantity} {data.item.Unit}</Text>
                                                        <Text style={{marginLeft : wp('5%'),color :'red'}}>{data.item.Date}</Text>
                                                    </View>

                                                    <View style = {{marginLeft : wp('3%'),marginTop : hp('1%'),flexDirection : 'row'}}>
                                                        <TouchableOpacity activeOpacity = {0.5} onPress = {() => onPress(data.item)}>
                                                            <View style = {{width : wp('15%'),alignItems : 'center',backgroundColor : 'blue',borderRadius : wp('2%')}}>
                                                                <Text style = {{color : 'white',fontWeight : 'bold'}}>ADD</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity activeOpacity = {0.5} onPress = {() => onRemove(data.item.id)}>
                                                            <View style = {{width : wp('20%'),alignItems : 'center',backgroundColor : 'red',borderRadius : wp('2%'),marginLeft : wp('5%')}}>
                                                                <Text style = {{color : 'white',fontWeight : 'bold'}}>Remove</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        </Card>
                                    </View>
                                
                                }
                            />

                            <Confirmation 
                                isVisible = {modalD}
                                onBackButtonPress = {() => HidemodalD()}
                                onBackdropPress = {() => HidemodalD()}
                                question = {"Are You Sure, Want To Delete"}
                                onPressYes = {() => Delete()}
                                onPressNo = {() => HidemodalD()}
                            />
                        </View>
                    ):(
                        <View style = {{flex : 1, justifyContent : 'center',alignItems : 'center'}}>
                            <FontAwesome5 name="boxes" size={hp('15%')} color="#A9A9B8" />
                            <Text style = {{marginTop : hp('2%'),fontSize : hp('2.5%'),color : '#A9A9B8'}}>Not find any pending Items</Text>
                        </View>
                    )}
                </View>
            ):(
                <Load style = {{flex : 2}}/>
            )}
        </View>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        Fetch_Pending_Items_Data  : () => { dispatch(Fetch_Pending_Items()) },
    }
}

const mapStateToProps = (state) => {
    return {
        Pending_Items: state.Basket.Pending,
        Load_Pending_Items : state.Basket.Load_Pending_Items
    }
}

export default connect(mapStateToProps , mapDispatchToProps)(Pending); 