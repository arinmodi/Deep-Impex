import React from 'react';
import { View,Text,StyleSheet,ImageBackground, TouchableNativeFeedback, FlatList, Vibration, ToastAndroid, ScrollView, RefreshControl } from 'react-native';
import { ActivityIndicator, Card } from 'react-native-paper';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Ionicons } from '../../Icons/icons';
import { FontAwesome } from '../../Icons/icons';
import { MaterialIcons } from '../../Icons/icons';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { database } from '../../config/config';
import { Fetch_Emp_Data  } from '../../App-Store/Actions/User_Request';
import {styles as st} from '../Component/styles';
import Load from '../../Component/loaddata';
import Header from '../../Component/Header';

/*registerForPushNotifications = async () => {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let final = status;

    if(status !== 'granted'){
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        final = status;
    }

    if(final !==  'granted'){
        return;
    }
}*/

class Requests extends React.Component{


    constructor(){
        super();
        this.state = {
            modal : false,
            selectedUserData : [],
            loading : true,
            refresh : false
        }

    }

    componentDidMount(){
        this.props.Fetch_Emp_Data();
        this.setState({
            loading : false
        })
    }

    TransferData = async (item) => {

        var empid = item.uid;

        var empObj = {
            ProfileImage : item.ProfileImage,
            UserName : item.UserName,
            Email : item.Email,
            PhoneNumber : item.PhoneNumber,
            Active : true
        }

        await database.ref('/Accepted_Employee/'+empid).set(empObj);
        ToastAndroid.show("Request Accepted", ToastAndroid.LONG);
    }


    Transfer_Deleted_Data = async (item) => {

        var empid = item.uid;

        var empObj = {
            ProfileImage : item.ProfileImage,
            UserName : item.UserName,
            Email : item.Email,
            PhoneNumber : item.PhoneNumber,
            Active : false
        }

        await database.ref('/Deleted_Employee/'+empid).set(empObj);
        ToastAndroid.show("Request Deleted", ToastAndroid.LONG);
    }


    onDelete = () => {
        {this.state.selectedUserData.map(
            async (item , index) => {
                const empid = item.uid;
                const userRef = database.ref('/Requests/' + empid);
                userRef.remove();

                await this.Transfer_Deleted_Data(item)
            }
        )}

        this.setState({
            modal : false,
            selectedUserData : []
        })
    }

    Refresh = () => {
        this.setState({ refresh : true });
        this.props.Fetch_Emp_Data();
        this.setState({ refresh : false });
    }

    render(){

        const ShowModal  = (PhoneNumber) => {
            const data = this.props.Emp_Requests.filter(data => data.PhoneNumber == PhoneNumber);
            this.setState({
                selectedUserData : data,
                modal : true    
            })
        }

        const HideModal  = () => {
            this.setState({
               selectedUserData : [],
               modal : false
            })
        }

        const onAccept = () => {
            {this.state.selectedUserData.map(
                async (item , index) => {
                    const empid = item.uid;
                    const userRef = database.ref('/Requests/' + empid);
                    userRef.remove();
    
                    await this.TransferData(item)
                }
            )}

            this.setState({
                modal : false,
                selectedUserData : []
            })


        }

        if(this.props.Emp_Requests.length === 0){
            return(
                <View style = {{flex : 1}}>
                    {this.props.Load === false ? (
                            <View style={{flex : 1,justifyContent : 'center',alignItems : 'center'}}>
                                <FontAwesome name="users" size={hp('20%')} color="#A9A9B8" />
                                <Text style={st.nodata}> No Request Pending</Text>
                            </View>
                    ):(
                        <Load style = {{flex : 2}}/>
                    )}
                </View>
                
            )
        }else {

        return(
            <View style = {{flex : 1}}>
                <View style={styles.main}>
                    <FlatList 
                        data = {this.props.Emp_Requests}
                        keyExtractor = {(item,index)=>index.toString()}
                        refreshing = {this.state.refresh}
                        onRefresh = {() => this.props.Fetch_Emp_Data()}
                        showsVerticalScrollIndicator = {false}
                        renderItem = { (data) => 
                            <View>
                                <TouchableNativeFeedback onPress = {() => ShowModal(data.item.PhoneNumber)}>
                                    <Card style={styles.Request}>
                                        <View style={{flexDirection : 'row'}}>
                                            <View style={styles.imagecon}>
                                                <ImageBackground source={{uri : data.item.ProfileImage}} style={styles.ImageBackground}>

                                                </ImageBackground>
                                            </View>
                                            <View style={styles.details}>
                                                <View style={{flexDirection:'row'}}>
                                                    <Ionicons name="ios-person" size={hp('4%')} color="black" style={styles.icon} />
                                                    <Text style={styles.Username}>{data.item.UserName}</Text>
                                                </View>
                                                <View style={{flexDirection:'row'}}>
                                                    <FontAwesome name="phone" size={hp('3%')} color="black" style={styles.Phone_icon} />
                                                    <Text style={styles.Phone} numberOfLines = {1} adjustsFontSizeToFit = {true}>{data.item.PhoneNumber}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </Card>
                                </TouchableNativeFeedback>
                            </View>
                        }
                    />

                    <Modal
                        isVisible = {this.state.modal}
                        animationIn = "bounceInUp"
                        onBackButtonPress = {HideModal}
                        onBackdropPress = {HideModal}
                    >
                        {this.state.selectedUserData.map(
                                (item,index) => {
                                    return(
                                        <View style={styles.modal} key={index}>
                                            <ImageBackground source={{uri : item.ProfileImage}} style={styles.modalimage}>

                                            </ImageBackground>

                                            <View style={{flexDirection:'row'}}>
                                                <Ionicons name="ios-person" size={hp('4%')} color="#154293" style={styles.modalicon} />
                                                <Text style={{...styles.Username,...{marginLeft:wp('0%'),color:'black'}}}>{item.UserName}</Text>
                                            </View>

                                            <View style={{flexDirection:'row'}}>
                                                <FontAwesome name="phone" size={hp('4%')} color="#154293" style={styles.modalicon} />
                                                <Text style={{...styles.Username,...{marginLeft:wp('0%'),color:'black'}}}>{item.PhoneNumber}</Text>
                                            </View>

                                            <View style={{flexDirection:'row'}}>
                                                <MaterialIcons name="email" size={hp('4%')} color="#154293" style={styles.modalicon} />
                                                <Text style={{...styles.Username,...{marginLeft:wp('0%'),color:'black',width : wp('75%')}}}>{item.Email}</Text>
                                            </View>

                                            <View style={{flexDirection : 'row',justifyContent : 'space-around'}}>
                                                <TouchableNativeFeedback onPress={onAccept}>
                                                    <Card style={styles.button}>
                                                        <Text style={styles.buttontext}>Accept</Text>
                                                    </Card>
                                                </TouchableNativeFeedback>
                                                <TouchableNativeFeedback onPress={this.onDelete.bind(item.uid)}>
                                                    <Card style={{...styles.button,...{backgroundColor : 'red'}}}>
                                                        <Text style={{...styles.buttontext,...{color : 'white'}}}>Delete</Text>
                                                    </Card>
                                                </TouchableNativeFeedback>
                                            </View>
                                        </View>
                                    )
                                }
                        )}
                    </Modal>
                </View>
            </View>
        )
    }}
}

const styles = StyleSheet.create({
    main : {
        flex:1,
    },
    ImageBackground : {
        width:wp('25%'),
        height:hp('13%'),
        resizeMode : 'contain'
    },
    Request : {
        width:wp('90%'),
        height:hp('13%'),
        marginHorizontal:wp('5%'),
        marginVertical:hp('3%'),
        borderRadius:wp('3%'),
        overflow:'hidden',
        elevation:10,
    },
    imagecon : {
        width:wp('25%'),
    },
    details : {
        width:wp('75%'),
        backgroundColor : 'white'
    },
    Username : {
        marginLeft : wp('4%'),
        fontSize : hp('3%'),
        marginTop : hp('2%'),
        color : '#154293'
    },
    icon : {
        marginTop : hp('2%'),
        marginLeft : wp('4%'),
    },
    Phone: {
        marginLeft : wp('4%'),
        fontSize : hp('2.5%'),
        marginTop : hp('1%'),
        color : '#154293'

    },
    Phone_icon : {
        marginTop : hp('1%'),
        marginLeft : wp('4%'),
    },
    modal : {
        height : hp('70%'),
        backgroundColor : 'white',
        borderRadius : hp('4%'),
        overflow : 'hidden'
    },
    modalimage : {
        height : hp('30%'),
        width : wp('90%'),
        resizeMode : 'contain'
    },
    modalicon : {
        margin : hp('2%')
    },
    button : {
        marginTop : hp('4%'),
        width : wp('30%'),
        height : hp('6%'),
        backgroundColor : '#93F014',
        borderRadius : wp('3%'),
        elevation : 10,
        alignItems:'center'
    },
    buttontext : {
        color : '#154293',
        fontSize : hp('3%'),
        marginTop : hp('0.5%')
    }
})

const mapDispatchToProps = (dispatch) => {
    return {
        Fetch_Emp_Data : () => { dispatch(Fetch_Emp_Data()) },
    }
}

const mapStateToProps = (state) => {
    return {
        Emp_Requests : state.Emp_Request.Emp_Request_Data,
        Load : state.Emp_Request.Load
    }
}

export default connect(mapStateToProps , mapDispatchToProps)(Requests);