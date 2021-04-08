import React , { useState, useEffect } from 'react';
import { View,Text,StyleSheet,TouchableNativeFeedback,TouchableOpacity,Image,TextInput, ToastAndroid, FlatList, ActivityIndicator } from 'react-native';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Card, Button } from 'react-native-paper';
import { Feather,MaterialIcons,FontAwesome, MaterialCommunityIcons, Fontisto,AntDesign } from '../../Icons/icons';
import { styles } from './Manual_Upload';
import Modal from 'react-native-modal';
import { stylesCopy } from './Copy_Items';
import Confirmation from '../../Component/ConfirmationModal';
import {  firestore, f } from '../../config/config';
import { connect } from 'react-redux';
import { Fetch_Basket_Items_Data } from '../../App-Store/Actions/Basket_And_Items';
import moment from 'moment';
import { fetch_emp_data } from '../../Component/functions/fetch_order_empdata';
import { Order_Status } from '../../Component/Order_Status';
import { ScrollView } from 'react-native-gesture-handler';
import Load from '../../Component/loaddata';
import SubHeader from '../../Component/SubScreenHeader';

function BasketItem(props){

    // Data
    const [modal , setmodal] = useState(false);
    const [modalD , setmodalD] = useState(false);
    const [modalw , setmodalw] = useState(false);
    const Name = props.navigation.getParam('Name');
    const Wallet = props.navigation.getParam('Wallet');
    const rem = props.navigation.getParam('Rem');
    const id = props.navigation.getParam('id');
    const date = props.navigation.getParam('Date');
    const nav = props.navigation.getParam('nav');
    const [wallet , setwallet ] = useState(Wallet);
    const [ selecteddata, setselecteddata] = useState([]);
    const [ data, setdata ] = useState([]);
    const [colors, setcolors ] = useState([]);
    const [empdata, setempdata ] = useState([]);
    const [ loading, setloading ] = useState(true);

    //Fetch Existing Items
    const Fetch_Data = async () => {
        if(date.toDate() > new Date() || moment(date.toDate()).format('DD/MM/YYYY') === moment(new Date()).format('DD/MM/YYYY')){
            props.Fetch_Basket_Items_Data(id);
            setloading(false);
        }else{
            var graphdata = [];
            var graphcolors = [];
            setdata([]);  setcolors([]); setempdata([]);
            const data2 = await fetch_emp_data(id);
            props.Fetch_Basket_Items_Data(id);
            graphdata.push ({ y : rem, x : ' ' });
            graphcolors.push('blue');
            if(data2 !== false){
                data2.maindata.forEach(element => {
                    graphdata.push(element)
                });
                data2.colors.forEach(element => {
                    graphcolors.push(element)
                });
                setempdata(data2.empdata)
            }
            setdata(graphdata); setcolors(graphcolors);
            setloading(false);
        }
    }

    // Fetching Data
    useEffect(()=> {
        Fetch_Data();
    }, [])

    // Add Product Click

    const NavToItems = () => {
        props.navigation.navigate({routeName : 'Items', params : {id : id, MainData : props.Items, nav : 'admin'}})
    }

    const Editwallet = async () => {
        if(wallet < 10 || wallet === ' ' || !wallet || !wallet.toString().match(/^[0-9.]*$/) ){
            alert('Plese Enter valid input');
            Hidemodalw();
        }else if(wallet === Wallet){
            alert('Do Not need to change');
            Hidemodalw();
        }else{
            const orderref = firestore.collection("Orders").doc(id);
            try {
                const res = await firestore.runTransaction( async t => {
                    const doc = t.get(orderref);
                    const data = (await doc).data();
                    const wallet_amount = parseFloat(data.Wallet);
                    const remainingamount = parseFloat(data.Remaining_Amount);
                    const Purchase = parseFloat(wallet_amount - remainingamount);
    
                    if(wallet >= Purchase){
                        const new_rem_bal = parseFloat(wallet - Purchase);
                        t.update(orderref, {
                            Wallet : parseFloat(wallet),
                            Remaining_Amount : parseFloat(new_rem_bal)
                        });
                        return true;
                    }else{
                        alert("Invalid Balance");
                        return false;
                    }
                })
    
                if(res === true){
                    ToastAndroid.show("Wallet Changed!" , ToastAndroid.SHORT);
                    Hidemodalw();
                    props.navigation.navigate('order');
                }else{
                    Hidemodalw();
                }
    
            }catch(e) {
                alert('Somthing Bad Try again');
                Hidemodalw();
            }
        }
    }


    // Options Modal 
        // Show
        const showmodal = (data) => {
            setselecteddata(data)
            setmodal(true);
        }

        // Hide
        const Hidemodal = () => {
            setselecteddata([]);
            setmodal(false);
        }

        //Delete Modal Show
        const onDelete = () => {
            if(!selecteddata.Rate){
                setmodalD(true);
            }else {
                alert('Item Purchased, Can not delete')
            }
        }

        const onMore = () => {
            if(selecteddata.Rate){
                Hidemodal()
                props.navigation.navigate({routeName : 'View', params : {data : selecteddata, id : id, Nav : 'admin'} })
            }else{
                alert('No details Found');
            }
        }

        // Delete Modal Hide
        const HidemodalD = () => {
            setmodalD(false);
            setmodal(false);
        }

        //events
        const Delete = async () => {
            HidemodalD();
            const ref = firestore.collection('Orders').doc(id);
            await ref.collection('Items').doc('All_Items').update({ [selecteddata.id] : f.firestore.FieldValue.delete()});
            setselecteddata([]);
            ToastAndroid.show('Item deleted' , ToastAndroid.LONG);
        }

        //events
        const onEditPress = () => {
            if(!selecteddata.Rate){
                Hidemodal()
                props.navigation.navigate({routeName : 'Edit', params : {data : selecteddata, id : id,} })
            }else {
                alert('Item Purchased, Can not edit')
            }
        }



    // Edit wallet modal
        // show
        const showmodalw = () => {
            setmodalw(true);
        }


        //hide
        const Hidemodalw = () => {
            setmodalw(false)
            setwallet(Wallet)
        }

    // Back To home
    const Back = () => {
        if(nav === 'basket'){
            props.navigation.navigate('basket')
        }else{
            props.navigation.navigate('order');
        }
    }

    const onADDList = async () => {
        const ref = firestore.collection('Favorite');
        await ref.get().then(async snapshot => {
            if(snapshot.docs.length < 11){
                await ref.doc(selecteddata.Name).get().then(data => {
                    if(data.exists){
                        alert('Already exist');
                        Hidemodal()
                    }else{
                        ref.doc(selecteddata.Name).set({
                            Image : selecteddata.Image
                        })
                        Hidemodal();
                        ToastAndroid.show('Item Added To list', ToastAndroid.LONG)
                    }
                })
            }
        })
        
    }

    const onPress = (emp) => {
        props.navigation.navigate({ routeName : 'P_D', params : {data : emp, id : id,items : props.Items} });
    }

    return(
        <View style={{flex : 1}}>

            <SubHeader 
                Name = {Name}
                onPress = {Back}
            />

            {props.Items_Load === false || loading === false ? (
                <View style = {{flex : 1}}>
                    {date.toDate() > new Date() || moment(date.toDate()).format('DD/MM/YYYY') === moment(new Date()).format('DD/MM/YYYY') ? (
                        <View>

                            <View style={{flexDirection : 'row',marginTop : hp('2%'),marginHorizontal : wp('5%')}}>
                                <View>
                                    <Text style={{...styles.Created,...{color : 'black'}}}>{moment(date.toDate()).format('DD/MM/YYYY')}</Text>
                                </View>
                                <View style={{flex : 1, alignItems : 'flex-end'}}>
                                    <View style = {{flexDirection : 'row'}}>
                                        <Text style = {{fontSize : hp('2.5%'),fontWeight : 'bold',marginHorizontal: wp('3%'),color : 'black'}}>{Wallet}</Text>
                                        <FontAwesome name="rupee" size={hp('2.5%')} color="black" style={{marginTop : hp('0.5%')}} />
                                        <Feather name="edit" size={hp('3.2%')} color="blue" style={{marginLeft : wp('3%')}} onPress = {showmodalw}/>
                                    </View>
                                </View>
                            </View>


                            <View style={styles.CreateBucketContainer}>
                                <Card style={styles.CreateBucket}>
                                    <TouchableNativeFeedback onPress = {NavToItems}>
                                        <View style={styles.BucketView}>
                                            <View style={styles.ImageCon}>
                                                <Image style = {styles.Image} source = {require('../../assets/basket8.png')}/>
                                            </View>
                                            <View style = {styles.textCon}>
                                                <Text style={styles.text}>Add Product</Text>
                                                <Text style={{width : wp('60%')}} numberOfLines = {1} adjustsFontSizeToFit = {true}>To Add Product , Click Here</Text>
                                            </View>
                                        </View>
                                    </TouchableNativeFeedback>
                                </Card>
                            </View>

                            <View style={{...styles.CreatedCon, ...{flexDirection : 'row'}}}>
                                <View>
                                    <Text style={styles.Created}>Products({props.Items.length})</Text>
                                </View>
                                <View style={{flex : 1, alignItems : 'flex-end'}}>
                                    <Button style = {{backgroundColor :'#154293',borderRadius : wp('2%'),elevation : 5,marginTop : -hp('2%')}} labelStyle = {{color : 'white'}} icon = {() => {
                                            return(   
                                                <AntDesign name="upload" size={hp('2%')} color="white" /> );
                                            }} onPress = {() => props.navigation.navigate({routeName : "File",params : { id : id }})}>File</Button>
                                </View>
                            </View>

                            {props.Items.length === 0 ? 
                        
                            <View style={{justifyContent :'center',alignItems : 'center',marginTop : hp('20%')}}>
                                <MaterialIcons name="add-shopping-cart" size={hp('10%')} color="#A9A9B8" />
                                <Text style={{marginTop : hp('1%'), fontSize : hp('2.5%'),color : "#A9A9B8"}}>No Items found</Text>
                            </View>
                            
                            :

                            <FlatList 
                                data = {props.Items}
                                style = {{marginBottom : hp('32%')}}
                                keyExtractor = {(item,index)=>index.toString()}
                                showsVerticalScrollIndicator = {false}
                                numColumns = {2}
                                renderItem = { (Data) => 
                                    <View style={{...Styles.Main,...{flex : 1}}}>   
                                            <Card style={Styles.card}>
                                                <View style = {{alignSelf : 'flex-end', marginRight : wp('2%'),marginTop : hp('1%') }}>
                                                    <TouchableOpacity onPress = {() => showmodal(Data.item)}>
                                                        <View>
                                                            <Feather name="more-vertical" size={hp('2.8%')} color="#154293" />
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                                <View>
                                                    <Image style = {{height : hp('12%'), width : wp('40%'),resizeMode : 'contain',marginLeft : wp('3%')}} source = {{uri : Data.item.Image }}/>
                                                </View>
                                                <View style={Styles.itemName}>
                                                    <Text style={Styles.itemtext} numberOfLines = {1} adjustsFontSizeToFit = {true}>{Data.item.Name}</Text>
                                                </View>
                                                <View style = {{flexDirection: 'row',marginLeft : wp('3%')}}>
                                                    <View style={Styles.itemRate}>
                                                        <Text style={{...Styles.itemtext, ...{fontWeight : 'normal'}}} numberOfLines = {1} adjustsFontSizeToFit = {true}>{Data.item.Quantity} {Data.item.Unit}</Text>
                                                    </View>
                                                    <View style={Styles.itemRate}>
                                                        {!Data.item.Rate ? ( null) : (
                                                            <Text style={Styles.itemtext} numberOfLines = {1} adjustsFontSizeToFit = {true}>{Data.item.Rate} <FontAwesome name="rupee" size={hp('1.8%')} color="black" /></Text>
                                                        )}
                                                    </View>
                                                    <View style={Styles.itemRate}>
                                                        {!Data.item.Rate ? ( <MaterialCommunityIcons name = "clock-alert" size={hp('2.8%')} color="red" /> ) : (
                                                            <MaterialIcons name="done" size={hp('2.8%')} color="green" />
                                                        )}
                                                    </View>
                                                </View>
                                            </Card>
                                    </View>
                                }
                            />

                        }


                            <Confirmation 
                                isVisible = {modalD}
                                onBackButtonPress = {() => HidemodalD()}
                                onBackdropPress = {() => HidemodalD()}
                                question = {"Are You Sure, Want To Delete"}
                                onPressYes = {() => Delete()}
                                onPressNo = {() => HidemodalD()}
                            />

                            <Modal
                                isVisible = {modal}
                                onBackButtonPress= {Hidemodal}
                                onBackdropPress = {Hidemodal}
                                swipeDirection = {'down'}
                                onSwipeComplete = {Hidemodal}

                            >
                                <View style={{...stylesCopy.Modal,...{height : hp('50%'),marginTop : hp('75%')}}}>
                                    <TouchableOpacity onPress = {() => onEditPress()}>
                                        <View style = {{flexDirection : 'row', marginLeft : wp('10%'), marginTop : hp('4%'), alignItems : 'center'}}>
                                            <Feather name="edit" size={hp('3%')} color="green" />
                                            <Text style = {{marginLeft : wp('5%'), fontSize : hp('2%'),color : 'black'}}>Edit Product</Text>
                                        </View>
                                    </TouchableOpacity>


                                    <TouchableOpacity onPress = {() => onDelete()}>
                                        <View style = {{flexDirection : 'row', marginLeft : wp('10%'), marginTop : hp('4%'), alignItems : 'center'}}>
                                            <MaterialIcons name="delete" size={hp('3%')} color="red" />
                                            <Text style = {{marginLeft : wp('5%'), fontSize : hp('2%'),color : 'black'}}>Delete Product</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress = {() => onADDList()}>
                                        <View style = {{flexDirection : 'row', marginLeft : wp('12%'), marginTop : hp('4%'), alignItems : 'center'}}>
                                            <Fontisto name="favorite"  size={hp('3%')} color="blue" />
                                            <Text style = {{marginLeft : wp('7%'), fontSize : hp('2%'),color : 'black'}}>Add To list</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress = {() => onMore()}>
                                        <View style = {{flexDirection : 'row', marginLeft : wp('10%'), marginTop : hp('4%'), alignItems : 'center'}}>
                                            <Feather name="more-horizontal"  size={hp('3%')} color="black" />
                                            <Text style = {{marginLeft : wp('5%'), fontSize : hp('2%'),color : 'black'}}>Check Details</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </Modal>

                            <Modal
                                isVisible = {modalw}
                                onBackButtonPress= {Hidemodalw}
                                onBackdropPress = {Hidemodalw}
                            >

                                <View style={{backgroundColor : 'white',height : hp('20%'),borderRadius  : hp('3%'),overflow : 'hidden'}}>
                                    <View style = {styles.InputCon}>
                                        <Text style = {styles.InputLabel}>Wallet :</Text>
                                        <TextInput 
                                            style = {{...styles.input,...{width : wp('35%')}}}
                                            keyboardType = {"number-pad"}
                                            value = {String(wallet)}
                                            onChangeText = {(number) => setwallet(number)}
                                            editable = {true}
                                        />
                                        <FontAwesome name="rupee" size={hp('3.5%')} color="black" style={{marginTop : hp('0.5%'),marginLeft : wp('5%')}} />
                                    </View>
                                    <View style={styles.ButtonMainCon}>
                                        <TouchableNativeFeedback onPress = {() => Editwallet()}>
                                            <Card style={styles.Button}>
                                                <Text style={styles.ButtonText}>Save</Text>
                                            </Card>
                                        </TouchableNativeFeedback>
                                    </View>
                                </View>
                            </Modal>
                        </View>
                    ):(

                        <ScrollView 
                            showsVerticalScrollIndicator = {false}
                        >

                            {Wallet > 0 ? (
                                <View>
                                    <Order_Status 
                                        OrderName = {Name}
                                        date = {date.toDate()}
                                        colors = {colors}
                                        data = {data}
                                        empdata = {empdata}
                                        WalletAmount = {Wallet}
                                        remaing_balance = {rem}
                                        nav = {'admin'}
                                        onPress = {(empid) => onPress(empid)}
                                    />

                        
                        <FlatList 
                            data = {props.Items}
                            keyExtractor = {(item,index)=>index.toString()}
                            horizontal = {true}
                            showsHorizontalScrollIndicator={false}
                            renderItem = { (data) => 
                                <View style={Styles.Main}> 
                                {data.item.Rate ? (  
                                    <Card style={{...Styles.card, ...{height : hp('30%'),marginHorizontal : wp('2%')}}}>
                                        <View>
                                            <Image style = {{height : hp('12%'), width : wp('40%'),resizeMode : 'contain',marginLeft : wp('3%')}} source = {{uri : data.item.Image }}/>
                                        </View>
                                        <View style={Styles.itemName}>
                                            <Text style={Styles.itemtext} numberOfLines = {1} adjustsFontSizeToFit = {true}>{data.item.Name}</Text>
                                        </View>
                                        <View style = {{flexDirection: 'row',marginLeft : wp('3%')}}>
                                            <View style={{...Styles.itemRate, ...{width : wp('20%')}}}>
                                                <Text style={{...Styles.itemtext, ...{fontWeight : 'normal'}}} numberOfLines = {1} adjustsFontSizeToFit = {true}>{data.item.Quantity} {data.item.Unit}</Text>
                                            </View>
                                            <View style={Styles.itemRate}>
                                                <Text style={Styles.itemtext} numberOfLines = {1} adjustsFontSizeToFit = {true}>{data.item.Rate} <FontAwesome name="rupee" size={hp('1.8%')} color="black" /></Text>
                                            </View>
                                        </View>

                                    {
                                        data.item.Debit ? (
                                            <View style = {{flexDirection: 'row',marginLeft : wp('3%')}}>
                                                <View style={{...Styles.itemRate, ...{width : wp('20%')}}}>
                                                    <Text style={{...Styles.itemtext, ...{fontWeight : 'bold'}}}>Debit</Text>
                                                </View>
                                                <View style={Styles.itemRate}>
                                                    <Text style={{...Styles.itemtext, ...{fontWeight : 'normal', color : 'green'}}}>{data.item.Debit} <FontAwesome name="rupee" size={hp('1.8%')} color="green" /></Text>
                                                </View>
                                            </View>
                                        ):(null)
                                    }

                                    {
                                        data.item.Credit ? (
                                            <View style = {{flexDirection: 'row',marginLeft : wp('3%')}}>
                                                <View style={{...Styles.itemRate, ...{width : wp('20%')}}}>
                                                    <Text style={{...Styles.itemtext, ...{fontWeight : 'bold'}}}>Credit</Text>
                                                </View>
                                                <View style={Styles.itemRate}>
                                                    <Text style={{...Styles.itemtext, ...{fontWeight : 'normal', color : 'red'}}}>{data.item.Credit} <FontAwesome name="rupee" size={hp('1.8%')} color="red" /></Text>
                                                </View>
                                            </View>
                                        ):(null)
                                    }

                                </Card>
                                ) : (null)}
                                </View>
                            }
                        />
                                </View>
                            ):(
                                <View style = {{flex : 1, alignItems : 'center',justifyContent : 'center'}}>
                                    <Text style = {{fontSize : hp('2.5%')}}>Order Empty</Text>
                                </View>
                            )}
                            
                        </ScrollView>

                    )}
                </View>
            ):(
                <Load style = {{flex : 1}}/>
            )}
        </View>
    )
}

export const Styles = StyleSheet.create({
    Main :{
        marginTop:hp('1%'),
    },
    card:{
        marginHorizontal:wp('3%'),
        marginVertical:hp('1.5%'),
        height:hp('27%'),
        width : wp('43%'),
        borderRadius:wp('2%'),
        alignItems:'center',
        elevation:15,
        overflow:'hidden',
    },
    itemName:{
        marginTop:hp('1.5%'),
        marginLeft:wp('5%'),
        width:wp('35%'),
        alignItems : 'center'
    },
    itemtext:{
        fontSize:hp('1.8%'),
        fontWeight:'bold',
        color : 'black'
    },
    itemQuan :{
        marginTop:hp('1.5%'),
        width:wp('13%'),
        color : 'black'
    },
    itemRate:{
        marginTop:hp('1.5%'),
        width:wp('12%'),
        marginLeft : wp('2%')
    },
    header : {
        height : hp('14%'),
        alignItems:'center',
        flexDirection : 'row',
        backgroundColor : '#154293'
    },
    Title : {
        color : 'white',
        fontSize : hp('3%'),
        fontWeight : 'bold',
        textAlign : 'center',
        marginLeft : wp('10%'),
        marginTop : hp('5%')
    },
})

const mapDispatchToProps = (dispatch) => {
    return {
        Fetch_Basket_Items_Data  : (id) => { dispatch(Fetch_Basket_Items_Data (id)) },
    }
}

const mapStateToProps = (state) => {
    return {
        Items: state.Basket.Basket_Item_Data,
        Items_Load : state.Basket.Load_Items
    }
}

export default connect(mapStateToProps , mapDispatchToProps)(BasketItem); 