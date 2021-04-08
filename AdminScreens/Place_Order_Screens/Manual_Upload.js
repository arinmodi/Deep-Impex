import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableNativeFeedback,TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { ActivityIndicator, Card } from 'react-native-paper';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons,Entypo } from '../../Icons/icons';
import {  functions, firestore } from '../../config/config';
import { connect } from 'react-redux';
import { Fetch_Orders_Basket_Data } from '../../App-Store/Actions/Basket_And_Items';
import   Basket from '../Component/All_Baskets';
import { styles as header } from '../Component/styles';
import Load from '../../Component/loaddata';
import { NavigationEvents } from 'react-navigation';
import Confirmation from '../../Component/ConfirmationModal';
import Header from '../../Component/Header';

function Manual_Upload(props){

    const [modal , setmodal] = useState(false);
    const [name , setname ] = useState('');
    const [wallet , setwallet ] = useState(0);
    const [ show, setshow ] = useState(false); 
    const [ date , setdate ] = useState(new Date());
    const [Process , setProcess ] = useState(0);
    const [ datevalid, setvalid ] = useState(false);
    const [ loading, setloading ] = useState(true);
    const [ showlong, setshowlong ] = useState(false);
    const [ deletedata, setdeletedata ] = useState([]);
    const [ delet, setdelete ] = useState(false);
    const [Process2 , setProcess2 ] = useState(0);

    useEffect(()=> {
        props.Fetch_Orders_Basket_Data(7);
        setloading(false);
    }, [])
    

    const showmodal = () => {
        setmodal(true);
    }

    const Hidemodal = () => {
        setmodal(false);
        setname('');
        setwallet(0);
        setdate(new Date())
    }

    const HideDelete = () => {
        setdeletedata(false);
        setshowlong(false);
        setdelete(false);
    };

    const onYesPress = async () => {
        HideDelete();
        if(deletedata.Date.toDate() > new Date()){
            await firestore.collection('Orders').doc(deletedata.id).collection('Items').doc("All_Items").delete();
            await firestore.collection('Orders').doc(deletedata.id).delete();
            ToastAndroid.show("Order Deleted",ToastAndroid.LONG);
        }else{
            alert("You can't delete this order");
        }
    }


    const s4 = () => {
        return  Math.floor((1+Math.random())* 0x10000).toString(16).substring(1)
    }
      
    const uniqueid = () => {
        return "Basket-" + s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + '-' + s4() + '-' + s4();
    }

    const CheckInputs = () => {
        setProcess(2);
        if(name === '' || !name.match(/^[ A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/)){
            alert('Invalid Name');
            setProcess(0);
        }else if(wallet === '' || !wallet.toString().match(/^[0-9.]*$/) || wallet <= 0){
            alert('Invalid Wallet Input, enter valid input');
            setProcess(0);
        }else if(datevalid === false){
            alert('select proper date');
            setProcess(0);
        }else {
            const check_details = functions.httpsCallable('Check_Details');
            check_details({name : name}).then(
                result => {
                    if(result.data === 1){
                        alert('Basket With this name, already exist , choose different name');
                        setProcess(0);
                    }else {
                        const ref = firestore.collection('Orders');
                        const query = ref.where('Creation_Date' , '==' , date.getDate()).where('Creation_Month', '==' , date.getMonth() + 1).where('Creation_Year', '==', date.getFullYear());
                        query.get().then(
                            result => {
                                console.log(result.docs.length);
                                if(result.docs.length === 1){
                                    alert('Order on Selected date already exist');
                                    setProcess(0);
                                }else {
                                    var u_id = uniqueid();
                                    console.log('reached')
                                    ref.doc(u_id).set({
                                        Name : name,
                                        Wallet : parseInt(wallet),
                                        Date : date,
                                        Creation_Date : date.getDate(),
                                        Creation_Month : date.getMonth() + 1,
                                        Creation_Year : date.getFullYear(),
                                        Remaining_Amount : parseInt(wallet)
                                    })
                                    setProcess(0);
                                    Hidemodal();
                                    ToastAndroid.show("Basket Created" , ToastAndroid.SHORT)
        
                                }
                            }
                        )
                    }
                }
            )
        }
    }

    const onChange = (event, selectedDate) => {
        var newdate = new Date(selectedDate);
        if(newdate.getTime() <= new Date().getTime()){
            alert('Date is passed, select proper date');
            setshow(false);
        }else {
            setshow(false);
            setdate(selectedDate);
            setvalid(true);
        }
    };

    function NavToBasketitem(name , Wallet, id, Date, Rem){
        setdeletedata(false);
        setshowlong(false);
        props.navigation.navigate({routeName : 'BasketItems',
            params : {
                Wallet : Wallet,
                Name : name,
                id : id,
                Date : Date,
                Rem : Rem
            }
        })
    };

    const refresh = () => {
        console.log('refresh');
        props.Fetch_Orders_Basket_Data(7);
        props.navigation.setParams({ update : false });
    };


    const onLongPress = (data) => {
        setshowlong(true);
        setdeletedata(data);
    };

    const onCancel = () => {
        setdeletedata(false);
        setshowlong(false);
    }


    return(
        <View style={styles.Main}>
            <View>
                {showlong === false ? (
                    <Header 
                        Name = {'Orders'}
                        onPress = {() => props.navigation.toggleDrawer()}
                    />
                ):(
                    <View style = {header.header}>
                        <View style = {{flexDirection : 'row',alignItems : 'center'}}>
                            <Entypo name="cross" size={hp('5%')} color="white" style = {{marginLeft : wp('5%')}} onPress = {() => onCancel()} />
                            <Text style = {header.headertext}>{deletedata.Name}</Text>
                        </View>
                        <View style={{...header.Addbutton, ...{top : hp('0%'),alignItems : 'flex-end',right : wp('5%'),flex : 1}}}>
                            <TouchableNativeFeedback onPress = {() => setdelete(true)}>
                                <MaterialIcons name="delete" size={hp('4%')} color="white"/>
                            </TouchableNativeFeedback>
                        </View>
                    </View>
                )}
            </View>

            <View style={styles.CreateBucketContainer}>
                <Card style={styles.CreateBucket}>
                    <TouchableNativeFeedback onPress = {showmodal}>
                        <View style={styles.BucketView}>
                            <View style={styles.ImageCon}>
                                <Image style = {styles.Image} source = {require('../../assets/basket10.png')}/>
                            </View>
                            <View style = {styles.textCon}>
                                <Text style={styles.text}>Create Basket</Text>
                                <Text style={{width : wp('60%')}} numberOfLines = {1} adjustsFontSizeToFit = {true}>To create Basket , Click Here</Text>
                            </View>
                        </View>
                    </TouchableNativeFeedback>
                </Card>
            </View>

            <View style={styles.CreatedCon}>
                <Text style={styles.Created}>Created Baskets</Text>
                <View style={{flex : 1,alignItems : "flex-end"}}>
                    <TouchableOpacity onPress = {() => props.navigation.navigate('Baskets')}>
                        <Text style={{fontSize : hp('2.5%'), color : 'blue', marginRight: wp('5%')}}>More</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {props.Load_Basket === false ?(
                <View style = {{flex : 1}}>
                    <NavigationEvents onDidFocus = {() => props.navigation.getParam('update') === true ? (refresh()) : console.log('Not update')}/>
                    {props.Baskets.length === 0 ? 
                
                        <View style={{flex : 1,justifyContent :'center',alignItems : 'center'}}>
                            <MaterialCommunityIcons name="truck-check" size={hp('12%')} color="#A9A9B8" />
                            <Text style={{marginTop : hp('1%'), fontSize : hp('2.5%'),color : '#A9A9B8'}}>No Order Created! Until Now</Text>
                        </View>
                        
                        :

                        <View style={{flex : 1}}>
                            <Basket 
                                data={props.Baskets}
                                NavToBasketitem = {(Name, Wallet, id, Date,Rem) => {NavToBasketitem(Name, Wallet, id, Date,Rem)}}
                                Long = {(data) => onLongPress(data)}
                                nav = 'admin'
                                selectedorderid = {deletedata.id}
                            />
                        </View>
                    }


                    <Modal
                        isVisible = {modal}
                        onBackButtonPress= {Hidemodal}
                        onBackdropPress = {Hidemodal}
                        animationIn = "fadeIn"

                    >
                        <View style={{...styles.Modal,...{height : hp('50%'),marginHorizontal : -wp('2%')}}}>
                            <View style={styles.title}> 
                                <Text style={styles.ModalTitleText}>Create Basket</Text>
                            </View>

                            <View style = {styles.InputCon}>
                                <Text style = {styles.InputLabel}>Name :</Text>
                                <TextInput 
                                    style={styles.input}
                                    placeholder = {'Basket Name'}
                                    onChangeText = {(text) => setname(text)}
                                />
                            </View>

                            <View style = {styles.InputCon}>
                                <Text style = {styles.InputLabel}>Wallet :</Text>
                                <TextInput 
                                    style = {{...styles.input,...{width : wp('35%'),color : 'black'}}}
                                    placeholder = {'Wallet Amount'}
                                    keyboardType = {"number-pad"}
                                    onChangeText = {(text) => setwallet(text)}
                                />
                                <FontAwesome name="rupee" size={hp('3%')} color="black" style = {{marginLeft : wp('4%')}}/>
                            </View>


                            <View style = {styles.InputCon}>
                                <Text style = {styles.InputLabel}>Date :</Text>
                                <Text style = {{...styles.input,...{width : wp('35%'),marginLeft : wp('7%'),padding : wp('3%'),color : 'black'}}}>{moment(date).format('DD/MM/YYYY')}</Text>
                                <TouchableOpacity onPress = {()=> setshow(true)}>
                                    <MaterialIcons name="date-range" size={hp('4%')} color="black" style={{marginLeft : wp('2%')}}/>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.ButtonMainCon}>
                                <TouchableNativeFeedback onPress = {CheckInputs}>
                                    <Card style={styles.Button}>
                                        <Text style={styles.ButtonText}>Create</Text>
                                    </Card>
                                </TouchableNativeFeedback>
                            </View>

                        </View>

                        {
                            show && (
                                <DateTimePicker 
                                    mode = {'date'}
                                    minimumDate = {new Date().getFullYear(), new Date().getMonth(), new Date().getDate()}
                                    value = {new Date()}
                                    display = {"calendar"}
                                    onChange = {onChange} 
                                    onTouchCancel = { () => setshow(false)}
                                />
                            )
                        }
                        
                    </Modal>

                    <Modal
                        isVisible = { Process > 1}
                        animationIn = "fadeIn"
                    >
                        <View style={{backgroundColor : 'white',height : hp('20%'),marginHorizontal : wp('10%'),borderRadius : wp('5%')}}>
                            <ActivityIndicator color = "blue" size = "large" style ={{marginTop : wp('8%')}}/>
                            <Text style={{textAlign : 'center',marginTop : hp('2%'),fontSize : hp('2.5%')}}>Creating Basket ...</Text>
                        </View>
                    </Modal>

                    <Modal
                        isVisible = { Process2 > 1}
                        animationIn = "fadeIn"
                    >
                        <View style={{backgroundColor : 'white',height : hp('20%'),marginHorizontal : wp('10%'),borderRadius : wp('5%')}}>
                            <ActivityIndicator color = "blue" size = "large" style ={{marginTop : wp('8%')}}/>
                            <Text style={{textAlign : 'center',marginTop : hp('2%'),fontSize : hp('2.5%')}}>Deleteing Basket ...</Text>
                        </View>
                    </Modal>

                    <Confirmation 
                        isVisible = {delet}
                        onBackButtonPress = {() => HideDelete()}
                        onBackdropPress = {() => HideDelete()}
                        question = {"Are You Sure, Want To Delete"}
                        onPressYes = {() => onYesPress()}
                        onPressNo = {() => HideDelete()}
                    />

                </View>
            ):(
                <Load style = {{flex : 2}}/>
            )
        }
    </View>
    )
}

export const styles = StyleSheet.create({
    Main : {
        flex:1,
    },
    CreateBucketContainer : {
        marginTop : hp('3%'),
        marginBottom : hp('1%')
    },
    CreateBucket : {
        height : hp('15%'),
        marginHorizontal : wp('3%'),
        borderRadius : hp('2%'),
        overflow : 'hidden',
        elevation : 5
    },
    BucketView : {
        flexDirection : 'row'
    },
    ImageCon : {
        marginVertical : hp('2%'),
        marginHorizontal : wp('5%'),
        height : hp('12%')
    },
    Image : {
        height : hp('11%'),
        width : wp('20%'),
        resizeMode : 'contain'
    },
    textCon : {
        marginTop : hp('3%'),
        marginLeft : wp('5%')
    },
    text : {
        fontSize : hp('3.5%'),
        color : '#154293',
        fontWeight : 'bold',
    },
    CreatedCon : {
        marginHorizontal : wp('3%'),
        marginTop : hp('4%'),
        flexDirection : 'row'
    },
    Created : {
        fontSize : hp('2.5%'),
        color : '#154293',
        fontWeight : 'bold',
    },
    Modal : {
        height : hp('40%'),
        backgroundColor : 'white',
        borderRadius : hp('2%')
    },
    title : {
        marginTop : hp('3%'),
        alignItems : 'center'
    },
    ModalTitleText : {
        fontSize : hp('3%'),
        color : '#154293',
        fontWeight : 'bold',
    },
    InputCon : {
        marginHorizontal : wp('5%'),
        marginTop : hp('3%'),
        flexDirection : 'row',
        alignItems : 'center'
    },
    InputLabel : {
        fontSize : hp('2.5%'),
        fontWeight : 'bold',
        color : '#154293',
    },
    input : {
        marginLeft : wp('3%'),
        borderWidth : 1,
        width : wp('60%'),
        paddingLeft : 10,
        borderRadius : wp('3%'),
        height : hp('6%')
    },
    ButtonMainCon : {
        marginTop : hp('4%'),
        marginHorizontal : wp('30%')
    },
    Button : {
        height : hp('6%'),
        backgroundColor : '#154293',
        borderRadius : wp('3%'),
        alignItems : 'center',
        elevation : 5
    },
    ButtonText : {
        color : 'white',
        fontSize : hp('3%'),
        fontWeight : 'bold',
        marginTop : hp('0.5%')
    }

})

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

export default connect(mapStateToProps , mapDispatchToProps)(Manual_Upload); 