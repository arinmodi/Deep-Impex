/*import files */
import React from 'react';
import { View,Text,StyleSheet,FlatList,ImageBackground,TouchableNativeFeedback,TextInput,TouchableOpacity, ToastAndroid, BackHandler } from 'react-native';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import BasketItemGrid from '../Component/BasketItemGrid';
import { Entypo, MaterialIcons, Feather, Ionicons } from '../Icons/icons';
import SearchBar from "react-native-dynamic-search-bar";
import { f, firestore } from '../config/config';
import Loading from '../Component/Loading';
import Confirmation from '../Component/ConfirmationModal';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';

class BasketItem extends React.Component{

    /* Constructor and States */
    constructor(props){
        super(props);
        this.state = {
            ModalVisible : false,
            ProductName : '',
            RateModal : false,
            DebitModal : false,
            CreditModal : false,
            AnnotationModal : false,
            CheckBoxSelection : false,
            PersonName : '',
            serchtext : '',
            rate : 0,
            serch : false,
            Process : 0,
            Delete : false,
            Longpress : false,
            selecteditem : [],
            update : false
            
        }
    }

    componentDidMount = () => {
        this.back = BackHandler.addEventListener("hardwareBackPress",this.backAction);
    }

    componentWillUnmount = () => {
        this.back.remove();
    }

    backAction = () => {
        if(this.props.navigation.isFocused()){
            this.props.navigation.navigate({
                routeName : 'Main',
                Params : {
                    update : this.state.update
                }
            })
        }
    };


    /* Basket Item Grid Render function and flatlist render function */
    Render = (data) =>{
        return(
            <BasketItemGrid 
                Name = { data.item.Name }
                Quan = { data.item.Quantity }
                unit = {data.item.Unit}
                uri = {data.item.Image}
                Rate = {data.item.Rate}
                AddBY = {data.item.ADDBY}
                onLong = { 
                    () => { 
                        this.setState({ 
                            selecteditem : data.item,
                            Longpress : true
                        }) 
                    }
                }
                onPress = {() => { !data.item.Rate ? (this.setState({ Longpress : false, selecteditem: [] }),this.props.navigation.navigate({routeName : 'Buy', params : {data : data.item}})) : (null) }} 
                LongPress = {this.state.selecteditem.id === data.item.id}

            />
        )
    }


    onSerch = (text) => {
        var that = this;
        if(text !== ''){
            const data = this.props.Items;
            const newdata = data.filter(item => {
                const itemdata = item.Name;
                return itemdata.indexOf(text) > -1
            })
            that.setState({
                serch : true,
                sercheddata : newdata
            })
        }else{
            this.setState({
                serch : false,
            })
        }
    }

    onCancelPress = () => {
        this.setState({
            serch : false,
            sercheddata :[],
            serchtext : ''
        })
    }

    render(){
        
        /* Navigate to edit screen */
        const Navtoedit = () => {
            if(this.state.selecteditem.Rate){
                if(this.state.selecteditem.empid === global.uid){
                    console.log('Editable');
                    this.setState({ ModalVisible : false })
                    this.props.navigation.navigate({routeName : 'Edit', params : { data : this.state.selecteditem }});
                }else{
                    alert('Can not edit, cause this purchased by someone else');
                }
            }else {
                alert('Item is not Purchased');
            }

            this.setState({ Longpress : false, selecteditem: []  })
        }

        const onYesPress = async () => {
            const ref = firestore.collection('Orders').doc(global.id);
            await ref.collection('Items').doc('All_Items').update({ [this.state.selecteditem.id] : f.firestore.FieldValue.delete()});
            HideDelete();
            ToastAndroid.show('Item deleted' , ToastAndroid.LONG);
            await this.props.navigation.navigate({routeName : 'Basket', params : {update : true}});
        }

        const HideDelete = () => {
            this.setState({Delete : false, Longpress : false, selecteditem: []});
        }

        const onPlus = () => {
            const data = this.props.navigation.getParam('data');
            this.props.navigation.navigate({routeName : 'Items', params : {MainData : data }})
        }

        const onSeletcitemCancel = () => {
            this.setState({
                selecteditem : [],
                Longpress : false
            })
        }

        const onDeleteIconPress = () => {
            if(this.state.selecteditem.Rate){
                alert('Item is Purchased, You Can not delete');
            }else{
                if(this.state.selecteditem.ADDBY === global.PersonName){
                    this.setState({Delete : true});
                }else{
                    alert('Can not delete, this is added by someone else');
                }
            }
        }

        /* UI return finction */
        return(

            /*  Main/Parent View */
            <View>
                <NavigationEvents onDidFocus = {() => this.props.navigation.getParam('update') === true ? (this.setState({ update : true })) : console.log('Not update')}/>
                {/* Header of Basketitem Screen */}

                {this.state.Longpress === true ? (
                <View>
                    <View style = {styles.header}>
                        <Entypo name="cross" size={24} size={hp('4%')} color="white" style = {{marginTop : hp('3%'),marginLeft : wp('5%')}} onPress = {onSeletcitemCancel} />
                        <Text style = {{fontSize : hp('2.5%'), color : 'white',marginTop : hp('3.5%'),marginLeft : wp('5%')}}>{this.state.selecteditem.Name}</Text>
                    </View>
                    <View style={{...styles.Addbutton, ...{top : hp('4%'), flexDirection : 'row',left : wp('75%')}}}>
                        <Feather name="edit" size={hp('3%')} color="white" onPress = { () => Navtoedit()}/>
                        <MaterialIcons name="delete" size={hp('3%')} color="white" onPress = {() => onDeleteIconPress()} style = {{marginLeft : wp('5%')}}/>
                    </View>
                </View>
                ) : (
                <View style={styles.header}>

                    <View style = {{marginTop : hp('1.5%')}}>
                        <SearchBar
                            searchIconImageStyle = {{
                                tintColor : 'blue'
                            }}
                            clearIconImageStyle = {{
                                tintColor : 'red'
                            }}

                            placeholder="Search for item "
                            style = {{
                                height : hp('6%'),
                                width : wp('78%'),
                                marginLeft : wp('3%'),
                                borderRadius : wp('3%'),
                                backgroundColor : "white"
                            }}
                            textInputStyle = {{
                                fontSize : hp('2%'),
                                color : 'black',
                                padding : wp('2%')
                            }}
                            onChangeText = {(text) => this.onSerch(text)}
                            onPress = {() => this.onSerch('')}
                            onClearPress = {this.onCancelPress}

                        />
                    </View>
                    
                    {/* Add Product Button */}
                    <View style={styles.Addbutton}>
                        <TouchableNativeFeedback onPress={() => onPlus()}>
                            <View style={styles.circlebutton}>
                                <Ionicons name="ios-add" size={hp('5%')} color="#154293" />
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                </View>
                )}
                
                {/* Flatlist */}
                <View>

                    <FlatList
                        style={{marginBottom:hp('20%'),marginTop : hp('2%')}}
                        keyExtractor = {(item,index)=>index.toString()}
                        renderItem={this.Render}
                        data={this.state.serch === false ? this.props.Items : this.state.sercheddata}
                    />
                </View>

                <Loading 
                    isVisible = {this.state.Process > 0}
                    data = "Purchasing"
                />
                

                <Confirmation 
                    isVisible = {this.state.Delete}
                    onBackButtonPress = {() => HideDelete()}
                    onBackdropPress = {() => HideDelete()}
                    question = {"Are You Sure, Want To Delete"}
                    onPressYes = {() => onYesPress()}
                    onPressNo = {() => HideDelete()}
                />

            </View>
        )
    }
}

{/* StyleSheet */}
export const styles=StyleSheet.create({
    header:{
        height:hp('10%'),
        backgroundColor:'#154293',
        flexDirection:'row'
    },
    title : {
        marginTop:hp('5%'),
        fontSize:hp('4%'),
        color:'white',
        fontWeight:'bold',
        marginLeft:wp('22%')
    },
    icon:{
        marginTop:hp('5%'),
        marginLeft:wp('3%')
    },
    field:{
        marginTop:wp('2%'),
        width:wp('10%'),
        marginLeft:wp('3%'),
        height:hp('4%'),
        borderRadius:wp('2%'),
        elevation:5,
        alignItems:'center',
        backgroundColor:'#3167C0'
    },
    fieldName:{
        fontSize:wp('4%'),
        fontWeight:'bold',
        color:'white'
    },
    Modal :{
        height:hp('65%'),
        backgroundColor:'white',
        borderRadius:wp('10%'),
        overflow:'hidden'
    },
    Image:{
        width:wp('90%'),
        height:hp('35%'),
    },
    ModalText:{
        fontSize:wp('6%'),
        color:'#154293',
        fontWeight:'bold'
    },
    ModalAmount:{
        fontSize:wp('5%'),
        marginLeft:wp('3%')
    },
    Addbutton : {
        position:"absolute",
        top : hp('1.8%'),
        left:wp('85%')
    },
    circlebutton : {
        height:hp('5%'),
        width:hp('5%'),
        borderRadius : hp('5%'),
        backgroundColor:'white',
        alignItems:'center',
        justifyContent:'center'
    },
    AddModal :{
        height:hp('35%'),
    },
    AddModalheader : {
        alignItems:'center',
        marginTop:hp('1%')
    },
    AddModalheadertitle : {
        fontSize : wp('6%'),
        color: 'black',
        fontWeight:'bold'
    },
    AddModalInputCont : {
        borderWidth:2,
        marginTop:hp('2%'),
        marginHorizontal:wp('3%'),
        borderRadius : wp('3%'),
        height:hp('7%'),
        width:wp('60%'),
        marginLeft :wp('15%')
    },
    AddModalInputContTitle : {
        position: 'absolute',
        top: -hp('1.6%'),
        left: wp('8%'),
        fontWeight: 'bold',
        backgroundColor: 'white',
        color : '#154293',
    },
    Textinput : {
        marginVertical:hp('0.8%'),
        marginLeft:wp('2%'),
        fontSize:hp('2%'),
    },
    ButtonCon : {
        marginTop : hp('3%'),
        alignItems:'center'
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
    },
    General_Modal : {
        backgroundColor:'white',
        borderRadius:wp('5%'),
        overflow:'hidden',
        marginVertical:hp('20%'),
        position:"absolute",width:wp('90%')
    }
})

const mapStateToProps = (state) => {
    return {
        Items: state.Basket.Basket_Item_Data
    }
}

export default connect(mapStateToProps)(BasketItem); 