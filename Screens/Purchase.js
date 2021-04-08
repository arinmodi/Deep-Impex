import React from 'react';
import { View, Text, StyleSheet,Image,TextInput,ImageBackground,TouchableNativeFeedback,Dimensions, ActivityIndicator, RefreshControl, ScrollView, ToastAndroid } from 'react-native';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { FontAwesome, MaterialCommunityIcons, AntDesign } from '../Icons/icons';
import Modal from 'react-native-modal';
import { Card } from 'react-native-paper';
import { connect } from 'react-redux';
import { fetch_Order_id  } from '../Component/functions/Order_Details';
import { Fetch_Basket_Items_Data } from '../App-Store/Actions/Basket_And_Items';
import { firestore, f, database } from '../config/config';
import Loading from '../Component/Loading';
import { NavigationEvents } from 'react-navigation';
import { VictoryPie } from 'victory-native';
import Load from '../Component/loaddata';
import moment from 'moment';

class Purchase extends React.Component{

    constructor(props){
        super(props);
        this.state={
            Balance:0,
            TotalPurchased : 0,
            DebitAmount : 0,
            CreaditAmount: 0,
            BalanceModalVisible:false,
            AmountModal:false,
            OrderName : '',
            Orderid : '',
            loading : true,
            remaing_balance : 0,
            Pending_Items : [],
            Purchased_Items : [],
            refereshing : false,
            Process : 0,
            DB_Balance : 0,
            wallet : 0,
            open : false,
            date : ''
        }
    }

    fetch_details = async () => {
        const details = await fetch_Order_id();
        console.log('Called')
        if(details !== false){
            this.props.Fetch_Basket_Items_Data(details.id);
            var date = details.Date.toDate();
            this.setState({
                OrderName : details.name,
                Orderid : details.id,
                remaing_balance : details.remaining,
                date : date
            })
        }
    }

    filterdata = async () => {
        const Pending_Items = this.props.Items.filter(items => { return !items.Rate });
        const Purchased_Items = this.props.Items.filter(items => { return items.Rate });
        this.setState({
            Pending_Items : Pending_Items,
            Purchased_Items : Purchased_Items
        })
    }

    fetch_user_Data = async () => {
        const ref = firestore.collection('Orders').doc(this.state.Orderid).collection('Employees').doc(global.uid);
        await ref.get().then(
            data => {
                var item = data.data();
                this.setState({
                    DB_Balance : item.Balance,
                    TotalPurchased : item.Total_Purchased,
                    CreaditAmount : item.Credit,
                    DebitAmount : item.Debit,
                    loading : false,
                    wallet : item.wallet,
                    Extra : item.Extra,
                    Credit_Paid : item.Credit_Paid
                })
                if(item.Extra){
                    this.setState({
                        wallet : item.wallet + item.Extra,
                        DB_Balance : item.Balance
                    })
                }
            }
        )
    }

    componentDidMount = async () =>{
        await this.fetch_details();
        var that = this;
        console.log('Called')
        if(this.state.Orderid !== ''){
            const uid = f.auth().currentUser.uid;
            const ref = firestore.collection('Orders').doc(this.state.Orderid).collection('Employees').doc(uid);
            global.uid = uid;
            if((await ref.get()).exists){
                this.fetch_user_Data();
            }else {
                await database.ref('Accepted_Employee').child(uid).child('Remaining_Balance').once('value').then(data => {
                    if(data.val() !== null){
                        that.setState({
                            Previous_Balance : data.val().Amount
                        })
                    }
                })
                that.setState({
                    loading : false,
                    BalanceModalVisible:true
                })
            }
            await this.filterdata()
        }else {
            that.setState({
                loading : false,
            })
        }
    }

    onRefresh = () => {
        this.setState({
            refereshing : true
        })
        console.log('Refreshed')
        this.filterdata().then(() => {
            this.fetch_user_Data().then(() => {
                this.setState({refereshing : false})
            })
        })
    }

    render(){

        const NavigatetoBasket=()=>{
            this.props.navigation.navigate({routeName : 'Basket', params : {data : this.props.Items, P_I_L : this.state.Purchased_Items.length}})
        }

        const NavToPending = () => {
            this.props.navigation.navigate({routeName : 'Pending', params : {Data : this.state.Pending_Items , OrderName : this.state.OrderName}})
        }

        const NavToPurchased = () => {
            this.props.navigation.navigate({routeName : 'Purchased', params : {Data : this.state.Purchased_Items, OrderName : this.state.OrderName, AllData : this.props.Items, P_I_L : this.state.Purchased_Items.length}})
        }

        const onAdd = async () => {
            this.setState({
                Process : 1
            })
            if(!this.state.Balance || this.state.Balance === 0 || this.state.Balance <= 0 || this.state.Balance === ' '){
                alert('Enter the Amount');
                this.setState({
                    Process : 0
                })
            }else {
                const OrderRef = firestore.collection('Orders').doc(this.state.Orderid);
                const ref = firestore.collection('Orders').doc(this.state.Orderid).collection('Employees').doc(global.uid);
                try {
                const res = await firestore.runTransaction(async t => {
                    const doc = await t.get(OrderRef);
                    const Amount = doc.data().Remaining_Amount;
                    if (Amount >= this.state.Balance) {
                        t.update(OrderRef, { Remaining_Amount: Amount - this.state.Balance });
                        if(this.state.Previous_Balance){
                            t.set(ref, { 
                                Balance :  parseFloat(this.state.Balance) + parseFloat(this.state.Previous_Balance), 
                                Total_Purchased : 0, 
                                Debit : 0, 
                                Credit : 0, 
                                wallet : parseFloat(this.state.Balance),
                                Extra :  parseFloat(this.state.Previous_Balance)
                            });
                        }else{
                            t.set(ref, { 
                                Balance :  parseFloat(this.state.Balance), 
                                Total_Purchased : 0, 
                                Debit : 0, 
                                Credit : 0, 
                                wallet : parseFloat(this.state.Balance) 
                            });
                        }
                        this.setState({BalanceModalVisible : false, Process : 0});
                        ToastAndroid.show("Balance Successfully Taken!", ToastAndroid.LONG);

                        return true;
                    } else {
                        alert('Sorry! Not Suffcient Balance');
                        this.setState({
                            Process : 0,
                            BalanceModalVisible : true
                        })
                        return false
                    }
                });
                    console.log('Transaction success');
                    if(res === true){
                        this.fetch_user_Data();
                    }
                } catch (e) {
                    this.setState({
                        Process : 0,
                        BalanceModalVisible : true
                    })
                }
            }
        }

        const onDataRefresh = () => {
            this.filterdata().then(() => {
                this.fetch_user_Data();
            })
            global.update = false;
        }

        return(
            <View style={{flex:1}}>
                <View style={styles.header}>
                    <Text style={styles.title}>Purchase</Text>
                </View> 
                {this.state.loading === false ? 
                    (
                        this.state.Orderid !== '' ? 
                            (
                                <ScrollView  refreshControl = { <RefreshControl refreshing={this.state.refereshing} onRefresh={this.onRefresh} /> } >
                                    <View style={{flex:1}}>
                                        <NavigationEvents onDidFocus = {() => global.update === true ? (onDataRefresh()) : console.log('Not update')}/>

                                        <View style = {{marginTop : -hp('3%')}}>
                                            <TouchableNativeFeedback onPress={NavigatetoBasket}>
                                                <Card style={styles.basketContainer}>
                                                    <View style={{flexDirection:'row'}}>
                                                        <ImageBackground source = {require('../assets/basket2.png')} style={styles.basketImage} />
                                                        <View>
                                                            <Text style={{...styles.baskettext,...{width : wp('50%')}}} numberOfLines = {1} allowFontScaling = {true} adjustsFontSizeToFit = {true}>{this.state.OrderName}</Text>
                                                            <Text style={{...styles.baskettext,...{marginTop : hp('1%'),fontSize : hp('2.3%'),color : 'black'}}}>{moment(this.state.date).format('DD/MM/YYYY')}</Text>
                                                        </View>
                                                    </View>
                                                </Card>
                                            </TouchableNativeFeedback>
                                        </View>

                                        <View style={styles.Activities}>
                                            <TouchableNativeFeedback onPress = {NavToPending}>                    
                                                <Card style={styles.Activity}>
                                                    <View style={styles.iconCon}>
                                                        <ImageBackground source = {require('../assets/pending.png')} style={styles.icon2} />
                                                    </View>
                                                    <Text style={styles.Text2}>{this.state.Pending_Items.length}</Text>
                                                    <Text style={styles.Text3}>Item</Text>
                                                    <Text style={styles.Text3}>Pending</Text>
                                                </Card>
                                            </TouchableNativeFeedback>
                                            <TouchableNativeFeedback onPress = {NavToPurchased}>  
                                            <Card style={styles.Activity}>
                                                <View style={{...styles.iconCon,...{marginLeft:wp('2%')}}}>
                                                    <ImageBackground source = {require('../assets/Purchased.png')} style={styles.icon2} />
                                                </View>
                                                <Text style={styles.Text2}>{this.state.Purchased_Items.length}</Text>
                                                <Text style={styles.Text3}>Item</Text>
                                                <Text style={styles.Text3}>Purchased</Text>
                                            </Card>
                                            </TouchableNativeFeedback>
                                        </View>

                                        <View style = {{marginBottom : hp('1%')}}>
                                            <Card style = {{...styles.analytics, ...{height : this.state.open ? hp('38%') : hp('30%')}}}>
                                                <View style = {{flexDirection : 'row'}}>
                                                    <View>
                                                        <View style = {{marginLeft : wp('5%'), marginTop : hp('2%'),flexDirection : 'row'}}>
                                                            <Text style = {{fontSize : hp('2%'), color : 'black',fontWeight : 'bold'}}>Wallet :</Text>
                                                            <Text style = {{fontSize : hp('2%'),marginLeft : wp('2%'),fontWeight : 'bold', color : 'black'}}>{this.state.wallet.toFixed(1)}</Text>   
                                                            <FontAwesome name="rupee" size={hp('2%')} color="black" style={styles.icon} />
                                                        </View> 
                                                        <View>
                                                            <VictoryPie
                                                                colorScale = {
                                                                    this.state.Credit_Paid? (['blue', 'green','#F62178']):(['blue','green'])}
                                                                data={
                                                                    this.state.Credit_Paid? (
                                                                        [
                                                                            { 
                                                                                y: this.state.DB_Balance, 
                                                                                x: ((this.state.DB_Balance * 100)/this.state.wallet).toFixed(0)+'%'
                                                                            },
                                                                            { 
                                                                                y: this.state.DebitAmount, 
                                                                                x: ((this.state.DebitAmount * 100)/this.state.wallet).toFixed(0)+'%'
                                                                            },
                                                                            {
                                                                                y : this.state.Credit_Paid,
                                                                                x : ((this.state.Credit_Paid * 100)/this.state.wallet).toFixed(0)+'%'
                                                                            }
                                                                        ]
                                                                    ):(
                                                                    [
                                                                    { 
                                                                        y: this.state.DB_Balance, 
                                                                        x: ((this.state.DB_Balance * 100)/this.state.wallet).toFixed(0)+'%'
                                                                    },
                                                                    { 
                                                                        y: this.state.DebitAmount, 
                                                                        x: ((this.state.DebitAmount * 100)/this.state.wallet).toFixed(0)+'%'
                                                                    }
                                                                ])}
                                                                width={Dimensions.get('screen').width<400?wp('60%') : wp('60%')}
                                                                height={hp('30%')}
                                                                innerRadius={hp('6%')}
                                                                padAngle = {wp('0.5%')}
                                                                style={{
                                                                labels: {
                                                                fill: 'black', fontSize: hp('1.5%'), padding: 5,fillOpacity : 0.5
                                                                },
                                                                parent  : {
                                                                    marginTop : -hp('4%'),
                                                                    marginLeft : -wp('7%')
                                                                }
                                                            }}
                                                            /> 
                                                        </View>
                                                    </View>
                                                    <View style = {{marginLeft : -wp('3%'),marginTop : hp('3%')}}>
                                                        <View style = {{flexDirection : 'row'}}>
                                                            <View style = {{flexDirection : 'row', marginTop : hp('2%')}}>
                                                                <MaterialCommunityIcons name="record-circle" size={hp('2.5%')} color="green" />
                                                                <Text style = {{marginLeft : wp('1%'),color : 'black'}}>Debit</Text>
                                                            </View>
                                                            <View style = {{flexDirection : 'row', marginTop : hp('2%'),marginLeft : wp('3%')}}>
                                                                <MaterialCommunityIcons name="record-circle" size={hp('2.5%')} color="blue" />
                                                                <Text style = {{marginLeft : wp('1%'),color : 'black'}}>Balance</Text>
                                                            </View>
                                                        </View>
                                                        <View style = {{marginTop : hp('2%'),flexDirection : 'row'}}>
                                                            <Text style = {{fontSize : hp('2%'), fontWeight : 'bold',color : 'black'}}>Debit:</Text>
                                                            <Text style = {{fontSize : hp('2%'),marginLeft : wp('1%'),fontWeight : 'bold',color : 'black'}}>{this.state.DebitAmount.toFixed(1)}</Text>   
                                                            <FontAwesome name="rupee" size={hp('2%')} color="black" style={styles.icon} />
                                                        </View>
                                                        <View style = {{marginTop : hp('1%'),flexDirection : 'row'}}>
                                                            <Text style = {{fontSize : hp('2%'), fontWeight : 'bold',color : 'black'}}>Balance:</Text>
                                                            <Text style = {{fontSize : hp('2%'),marginLeft : wp('1%'),fontWeight : 'bold',color : 'black'}}>{this.state.DB_Balance.toFixed(1)}</Text>   
                                                            <FontAwesome name="rupee" size={hp('2%')} color="black" style={styles.icon} />
                                                        </View>
                                                        {this.state.Extra ? (
                                                            <View style = {{marginTop : hp('1%'),flexDirection : 'row'}}>
                                                                <Text style = {{fontSize : hp('2%'), fontWeight : 'bold',color : 'black'}}>Pr.Bal:</Text>
                                                                <Text style = {{fontSize : hp('2%'),marginLeft : wp('1%'),fontWeight : 'bold',color : 'black'}}>{this.state.Extra.toFixed(1)}</Text>   
                                                                <FontAwesome name="rupee" size={hp('2%')} color="black" style={styles.icon} />
                                                            </View>
                                                        ) : (null)}
                                                        {this.state.Credit_Paid ? (
                                                        <View style = {{alignSelf : 'flex-end', marginTop : hp('4%')}}>
                                                            <View style = {{flexDirection : 'row'}}>
                                                                <Text style = {{fontSize : hp('2%'), color : 'blue',marginRight : wp('3%')}}>More</Text>
                                                                {this.state.open ? (
                                                                    <AntDesign name="caretup" size={hp('2%')} color="blue" onPress = {() => this.setState({open : false})} style = {{marginTop : hp('0.5%')}}/>
                                                                ):(
                                                                    <AntDesign name="caretdown" size={hp('2%')} color="blue" onPress = {() => this.setState({open : true})} style = {{marginTop : hp('0.5%')}}/>
                                                                )}
                                                            </View>
                                                        </View>
                                                        ): (null)}
                                                    </View>
                                                </View>
                                                {this.state.Credit_Paid && this.state.open ? (
                                                    <View>
                                                        <View style = {{flexDirection : 'row', marginLeft : wp('5%')}}>
                                                            <MaterialCommunityIcons name="record-circle" size={hp('3%')} color="#F62178" />
                                                            <Text style = {{fontSize : hp('2%'), fontWeight : 'bold',marginLeft : wp('2%'),color : 'black'}}>Credit Paid : </Text>
                                                            <Text style = {{fontSize : hp('2%'),marginLeft : wp('2%'),fontWeight : 'bold',color : 'black'}}>{this.state.Credit_Paid.toFixed(1)}</Text>   
                                                            <FontAwesome name="rupee" size={hp('2%')} color="black" style={styles.icon} />
                                                        </View>
                                                    </View>
                                                ):(
                                                    null
                                                )}
                                            </Card>
                                        </View>
                                        {
                                            this.state.TotalPurchased > 0 ? (
                                                <View style = {{marginBottom : hp('2%')}}>
                                                <Card style = {styles.analytics}>
                                                    <View style = {{flexDirection : 'row'}}>
                                                        <View>
                                                            <View style = {{marginLeft : wp('5%'), marginTop : hp('2%'),flexDirection : 'row'}}>
                                                                <Text style = {{fontSize : hp('2%'), color : 'black',fontWeight : 'bold'}}>Purchase :</Text>
                                                                <Text style = {{fontSize : hp('2%'),marginLeft : wp('2%'),color : 'black',fontWeight : 'bold'}}>{(this.state.TotalPurchased.toFixed(1))}</Text>   
                                                                <FontAwesome name="rupee" size={hp('2%')} color="black" style={styles.icon} />
                                                            </View> 
                                                            <View>
                                                                <VictoryPie
                                                                    colorScale = {['red', 'green']}
                                                                    data={[
                                                                        { 
                                                                            y: this.state.CreaditAmount, 
                                                                            x: ((this.state.CreaditAmount * 100)/this.state.TotalPurchased).toFixed(0)+'%'
                                                                        },
                                                                        { 
                                                                            y: this.state.DebitAmount, 
                                                                            x: ((this.state.DebitAmount * 100)/this.state.TotalPurchased).toFixed(0)+'%'
                                                                        }
                                                                    ]}
                                                                    width={wp('60%')}
                                                                    height={hp('30%')}
                                                                    innerRadius={hp('6%')}
                                                                    padAngle = {wp('0.5%')}
                                                                    style={{
                                                                    labels: {
                                                                    fill: 'black', fontSize: hp('1.5%'), padding: 5,fillOpacity : 0.5
                                                                    },
                                                                    parent  : {
                                                                        marginTop : -hp('4%'),
                                                                        marginLeft : -wp('7%')
                                                                    }
                                                                }}
                                                                /> 
                                                            </View>
                                                        </View>
                                                        <View style = {{marginLeft : -wp('3%'),marginTop : hp('3%')}}>
                                                            <View style = {{flexDirection : 'row'}}>
                                                                <View style = {{flexDirection : 'row', marginTop : hp('2%')}}>
                                                                    <MaterialCommunityIcons name="record-circle" size={hp('2.5%')} color="green" />
                                                                    <Text style = {{marginLeft : wp('1%'),color : 'black'}}>Debit</Text>
                                                                </View>
                                                                <View style = {{flexDirection : 'row', marginTop : hp('2%'),marginLeft : wp('3%')}}>
                                                                    <MaterialCommunityIcons name="record-circle" size={hp('2.5%')} color="red" />
                                                                    <Text style = {{marginLeft : wp('1%'),color : 'black'}}>Credit</Text>
                                                                </View>
                                                            </View>
                                                            <View style = {{marginTop : hp('2%'),flexDirection : 'row'}}>
                                                                <Text style = {{fontSize : hp('2%'), fontWeight : 'bold',color : 'black'}}>Debit:</Text>
                                                                <Text style = {{fontSize : hp('2%'),marginLeft : wp('1%'),fontWeight : 'bold',color : 'black'}}>{this.state.DebitAmount.toFixed(1)}</Text>   
                                                                <FontAwesome name="rupee" size={hp('2.5%')} color="black" style={styles.icon} />
                                                            </View>
                                                            <View style = {{marginTop : hp('1%'),flexDirection : 'row'}}>
                                                                <Text style = {{fontSize : hp('2%'), fontWeight : 'bold',color : 'black'}}>Credit:</Text>
                                                                <Text style = {{fontSize : hp('2%'),marginLeft : wp('1%'),fontWeight : 'bold',color : 'black'}}>{this.state.CreaditAmount.toFixed(1)}</Text>   
                                                                <FontAwesome name="rupee" size={hp('2.5%')} color="black" style={styles.icon} />
                                                            </View>
                                                        </View>
                                                    </View>
                                                </Card>
                                            </View>
                                            ) : (null)
                                        }

                                        <Modal
                                            isVisible={this.state.BalanceModalVisible}
                                            animationIn="swing"
                                        >
                                            <View style={{...styles.Modal, ...{height : hp('58%')}}}>
                                                <Image source={require('../assets/balance.png')} style={styles.ImageBackground}/>
                                                <Text style={styles.Text}>Enter Your Invoice</Text>
                                                <View style={{flexDirection:'row',alignItems : 'center'}}>
                                                    <FontAwesome name="rupee" size={hp('3.5%')} color="black" style={{}}/>
                                                    <TextInput
                                                        style={styles.NumberInput}
                                                        editable={true}
                                                        keyboardType='number-pad'
                                                        onChangeText={(text) => this.setState({Balance: parseFloat(text)})}
                                                    
                                                    />
                                                </View>
                                                <TouchableNativeFeedback onPress = {onAdd}>
                                                    <View style = {{marginTop : hp('2%'), backgroundColor : '#154293', width : wp('15%'),height : hp('4%'), borderRadius : wp('3%')}}>
                                                        <Text style = {{color : 'white',fontSize : hp('2.5%'),marginLeft : wp('2%')}}> ADD </Text>
                                                    </View>
                                                </TouchableNativeFeedback>
                                                {this.state.Previous_Balance ? (
                                                    <View style = {{marginTop : hp('1%')}}>
                                                        <Text style = {{color : 'blue'}}>Previous Balance : {this.state.Previous_Balance} <FontAwesome name="rupee" size={hp('2%')} color="blue" style={{marginTop:Dimensions.get('screen').width<400?hp('3%'):hp('4%')}}/></Text>
                                                    </View>
                                                ) : (null)}
                                            </View>
                                        </Modal>

                                        <Loading 
                                            isVisible = {this.state.Process > 0}
                                            data = "Please Wait"
                                        />

                                    </View>
                                </ScrollView>
                        ) : 
                        
                        (
                            <View style = {{alignItems : 'center'}}>
                                <MaterialCommunityIcons name="emoticon-sad-outline" size={hp('23%')} color="#A9A9B8" style = {styles.sad} />
                                <View style = {{alignItems : 'center'}}>
                                    <Text style = {{...styles.Text2, ... {color : '#A9A9B8', fontSize : hp('3.5%'), marginTop : hp('2%')}}}> Sorry! No Order Yet!</Text>
                                    <Text style = {{...styles.Text3, ... {fontSize : hp('2.5%'),marginTop : hp('1%')}}}>Till New Order</Text>
                                    <Text style = {{...styles.Text3, ... {color : 'blue', fontSize : hp('2.5%'),marginTop : hp('1%')}}}>Check Your History</Text>
                                </View>
                            </View>
                        )   
                    ) : 
                
                    (
                        <Load 
                            style = {{flex : 1}}
                        />
                    )
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    header:{
        height:hp('10%'),
        backgroundColor:'#154293',
        alignItems:'center',
        justifyContent : 'center'
    },
    title : {
        fontSize:hp('3%'),
        color:'white',
    },
    Activity:{
        width:wp('45.5%'),
        height:hp('23%'),
        backgroundColor:'white',
        borderRadius:wp('5%'),
        marginHorizontal:wp('1%'),
        elevation:10,
        alignItems:'center',
    },
    Activities:{
        flexDirection:'row',
        marginTop:Dimensions.get('screen').width<400?hp('3%'):hp('2%'),
        marginHorizontal:wp('1.5%'),
    },
    iconCon:{
        width: hp('12%'),
        height: hp('12%'),
        borderRadius: hp('12%'),
        backgroundColor: '#6aa7f9',
        marginTop:Dimensions.get('screen').width<400?hp('2%'):hp('1%'),
        overflow:'hidden',
        alignItems : 'center',
        justifyContent : 'center',
        elevation :  5
    },
    icon2:{
        width:hp('6%'),
        height:hp('6%'),
        resizeMode : 'contain'
    },
    Text2:{
        textAlign:'center',
        fontSize:hp('2.5%'),
        marginBottom:hp('0.8%'),
        color : 'black',
        fontWeight : 'bold'
    },
    Text3:{
        textAlign:'center',
        fontSize:Dimensions.get('screen').width<400?wp('4%'):wp('4%'),
        marginTop:-hp('1%'),
        color : 'black'
    },
    basketContainer : {
        marginTop:Dimensions.get('screen').width<400?hp('5%'):hp('4%'),
        marginHorizontal:wp('4%'),
        height:hp('15%'),
        borderRadius:wp('5%'),
        elevation:10,
    },
    basketImage : {
        width:hp('10%'),
        height:hp('10%'),
        marginHorizontal:wp('5%'),
        marginVertical : hp('2.5%'),
        resizeMode : 'contain'
    },
    baskettext:{
       fontSize:hp('2.5%'),
       marginTop:hp('3%'),
       marginHorizontal:wp('8%'),
       color:'#154293',
    },
    Balance:{
        flexDirection:'row',
        marginTop:hp('4%'),
        marginLeft:wp('5%')
    },
    Text:{
        fontSize:hp('3%'),
        fontWeight:'bold',
        textAlign : 'center',
        color : 'black',
        marginTop : hp('3%')
    },
    Amount:{
        fontSize:Dimensions.get('screen').width<400?wp('6%'):wp('5%'),
        color:'white',
        marginHorizontal:wp('2.5%')
    },
    AmountCon:{
        backgroundColor:'#154293',
        flexDirection:'row',
        height:hp('5%'),
        borderRadius:wp('5%'),
        overflow:'hidden',
    },
    icon:{
        marginVertical:wp('1%'),
        marginLeft:wp('1%')
    },
    More:{
        marginHorizontal:wp('34%'),
        marginVertical:hp('5%'),
        backgroundColor:'#154293',
        flexDirection:'row',
        height:hp('5.5%'),
        borderRadius:wp('5%'),
        overflow:'hidden',
    },
    MoreText:{
        fontSize:wp('6.5%'),
        color:'white',
        marginHorizontal:wp('1%')
    },
    MoreIcon :{
        marginLeft:wp('1%'),
        marginTop:Dimensions.get('screen').width<400?wp('1.5%'):wp('2.5%')
    },
    MoreIcon2 :{
        marginRight:wp('1%'),
        marginTop:Dimensions.get('screen').width<400?wp('1.5%'):wp('2.5%')
    },
    Modal:{
        height:hp('55%'),
        backgroundColor:'white',
        borderRadius:wp('10%'),
        marginHorizontal:wp('5%'),
        overflow:'hidden',
        alignItems:'center'
    },
    ImageBackground:{
        height:hp('20%'),
        width:hp('20%'),
        marginTop:hp('2%'),
        resizeMode : 'contain'
    },
    NumberInput:{
        height:hp('5%'),
        borderColor:'black',
        width : wp('40%'),
        borderWidth:1,
        fontSize:hp('2.5%'),
        marginVertical:hp('3%'),
        marginLeft:wp('3%'),
        borderRadius : wp('2%'),
        backgroundColor : '#F5F6FB',
        padding : wp('2%')
    },
    Modal2:{
        height:hp('45%'),
        backgroundColor:'#6aa7f9',
        borderRadius:wp('10%'),
        marginHorizontal:wp('-5%'),
        overflow:'hidden',
        alignItems:'center',
        marginTop:hp('60%')
    },
    Modal2Amount:{
        fontSize:Dimensions.get('screen').width<400?wp('6%'):wp('5%'),
        color:'white',
        marginHorizontal:wp('2.5%'),
        color:'#154293'
    },
    Modal2Text:{
        fontSize:Dimensions.get('screen').width<400?wp('6%'):wp('5%'),
        fontWeight:'bold',
        marginRight:wp('4%'),
    },
    Modal2AmountCon:{
        backgroundColor:'white',
        flexDirection:'row',
        height:hp('5%'),
        borderRadius:wp('4%'),
        overflow:'hidden',
    },
    sad : {
        marginTop : hp('15%'),
    },
    analytics : {
        height : hp('30%'),
        marginTop : hp('2%'),
        marginHorizontal : wp('3%'),
        elevation : 25,
        borderRadius : wp('5%'),
        flexDirection : 'row',
        overflow : 'hidden'
    }
})

const mapDispatchToProps = (dispatch) => {
    return {
        Fetch_Basket_Items_Data  : (id) => { console.log('called'), dispatch(Fetch_Basket_Items_Data (id)) }
    }
}

const mapStateToProps = (state) => {
    return {
        Items: state.Basket.Basket_Item_Data
    }
}

export default connect(mapStateToProps , mapDispatchToProps)(Purchase); 