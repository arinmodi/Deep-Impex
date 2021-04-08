import React from 'react';
import { View, Text, StyleSheet,ImageBackground,Dimensions,Image, ToastAndroid,TouchableNativeFeedback } from 'react-native';
import { ActivityIndicator, Card,ProgressBar } from 'react-native-paper';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { f, database,auth } from '../config/config';
import App from '../Nevigations/MainNavigation';
import { SimpleLineIcons, MaterialIcons, Feather } from '../Icons/icons';
import { Restart } from 'fiction-expo-restart';
import RNRestart from 'react-native-restart'; 

export default class  Wait extends React.Component {

    constructor(){
        super()
        this.state = {
            UserName : '',
            ProfileImage : '',
            Email : '',
            Phone: '',
            PendingRequest : false,
            Authenticated : false,
            UnauthorizedPerson : false,
            progress : 0
        }
    }

    CheckUnAuthorized = () => {
        var that = this;
        const userid = auth.currentUser.uid;

        that.setState({
            progress : 0.9
        })

        database.ref('Deleted_Employee/').child(userid).once('value').then(
            function(snapshot){
                const exists = (snapshot.val() !== null);
                if(exists){
                    that.setState({
                        UnauthorizedPerson : true,
                    })
                    alert('Your Request is Deleted By Admin, So please Contact Admin')
                }
        }).catch(error => console.log(error));

    }

    CheckAuthorized = () => {
        
        this.setState({
            progress : 0.6
        })
        var that = this;

        const userid = auth.currentUser.uid;

        database.ref('/Accepted_Employee/').child(userid).once('value').then(
            function(snapshot){
                const exists = (snapshot.val() !== null);
                if(exists){
                    console.log(snapshot.val().Active)
                    if(snapshot.val().Active === true){
                        that.setState({
                            Authenticated : true
                        })
                    }else{
                        that.setState({
                            UnauthorizedPerson : true
                        })
                    }
                }
        }).catch(error => console.log(error));
    }


    CheckUser = () => {
        this.setState({
            progress : 0.3
        })
        const userid = auth.currentUser.uid;
        var that = this
        database.ref('/Requests/').child(userid).once('value').then(
            function(snapshot){
                const exists = (snapshot.val() !== null);
                if(exists){
                    console.log('exist');
                    that.setState({
                        PendingRequest : true,
                        UserName : snapshot.val().UserName,
                        ProfileImage : snapshot.val().ProfileImage,
                        Email : snapshot.val().Email,
                        Phone: snapshot.val().PhoneNumber,
                    })
                }
            }
        ).catch(error => console.log(error));
    }

    componentDidMount = () => {
        this.setState({
            progress : 0.1
        })
        this.CheckUser();
        this.CheckAuthorized();
        this.CheckUnAuthorized();
        console.log('Checking')
        this.setState({
            progress : 1
        })
    }

    onRefresh = () => {
        RNRestart.Restart();
    }

    Logout = () => {
        f.auth().signOut().then(
            ToastAndroid.show('Signed Out', ToastAndroid.SHORT)
        )
        this.props.navigation.navigate({routeName : 'Welcome',params : {Restart : true}})
    }


 
    render(){

        if(this.state.PendingRequest === true){
            return(
                <View style={styles.main}>
                    <View style={styles.ImageBackground}>
                        <Text style = {styles.title}> Profile </Text>
                    </View>

                    <View style = {{marginTop : -hp('15%'),backgroundColor : 'white',borderTopLeftRadius : wp('15%')}}>
                    <View style={styles.profile}>
                        <Image source={{uri:this.state.ProfileImage}} style={styles.image}/> 
                    </View>

                    <View style={styles.UserName}>
                        <Text style={styles.text}>{this.state.UserName}</Text>
                    </View>

                    <View style={styles.email}>
                        <View style = {styles.iconcon}>
                            <MaterialIcons name="email" size={hp('3.5%')} color="white" style = {{marginTop : hp('1.25%')}} />
                        </View>
                        <Text style={styles.value}>{this.state.Email}</Text>
                    </View>

                    <View style={styles.email}>
                        <View style = {styles.iconcon}>
                            <MaterialIcons name="phone" size={hp('3.5%')} color="white" style = {{marginTop : hp('1.25%')}} />
                        </View>
                        <Text style={styles.value}>{this.state.Phone}</Text>
                    </View>

                    <View style={{marginTop:hp('7%'),alignItems:'center',marginHorizontal:wp('3%')}}>
                        <Text style={{...styles.text,...{fontSize:hp('2.5%'),color : 'red'}}}>Please Wait Untill Admin Accept</Text>
                        <Text style={{...styles.text,...{fontSize:hp('2.5%'),color : 'red'}}} >Your Request</Text>
                    </View>

                    <View style={{marginTop: hp('7%'),flexDirection : 'row',justifyContent : 'space-around'}}>
                        <TouchableNativeFeedback onPress = {this.Logout}>
                        <Card style={{height:hp('6%'),width: wp('35%'),backgroundColor:'red',borderRadius : wp('2%')}}>
                            <View style={{flexDirection : 'row',alignItems:'center'}}>
                                <SimpleLineIcons name="logout" size={hp('3.5%')} color="white"  style = {{marginTop : hp('0.5%'),marginLeft : wp('2%')}}/>
                                <Text style={{color : 'white',fontSize : hp('3%'),marginTop : hp('0.5%'),marginLeft : wp('3%')}}>Logout</Text>
                            </View>
                        </Card>
                        </TouchableNativeFeedback>
   
                        <TouchableNativeFeedback onPress = {this.onRefresh}>
                        <Card style={{height:hp('6%'),width: wp('35%'),backgroundColor:'#14D2F0',borderRadius : wp('2%')}}>
                            <View style={{flexDirection : 'row',alignItems:'center'}}>
                                <Feather name="refresh-ccw" size={hp('3.5%')} color="white"  style = {{marginTop : hp('0.5%'),marginLeft : wp('2%')}}/>
                                <Text style={{color : 'white',fontSize : hp('3%'),marginTop : hp('0.5%'),marginLeft : wp('3%')}}>Refresh</Text>
                            </View>
                        </Card>
                        </TouchableNativeFeedback>
                    </View>
                    </View>
                </View>
            )
        }else if(this.state.Authenticated === true){
            return(
                <App />
            )
        }else if(this.state.UnauthorizedPerson === true){
            return(
                <View style={{flex:1,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:hp('4%'),color:'#154293'}}>Error : 404</Text>
                    <Text style={{fontSize:hp('3%'),color:'#154293'}}>You can not Access this App! Sorry</Text>
                    <Text style={{fontSize:hp('3%'),color:'#154293'}}>Talk With Your Admin</Text>
                </View>
            )
        }else {

            this.componentDidMount = () => {
                this.CheckUser();
                this.CheckAuthorized();
                this.CheckUnAuthorized();
                console.log('Checking')
            }

            return(
                <View style={{flex:1}}>
                    <View style = {{height : hp('50%'),width : wp('100%'),alignItems : 'center',justifyContent : 'flex-end'}}>
                        <ImageBackground style={{height : hp('10%'),width:hp('10%'),resizeMode : 'contain'}} source={require('../assets/Logo.png')}>
                        
                        </ImageBackground>
                    </View>
                    <Text style = {{textAlign : 'center',marginTop : hp('10%'),fontSize : hp('6%'),fontWeight : 'bold',color  : '#595a5a'}}>Deep</Text>
                    <Text style = {{textAlign : 'center',marginTop : hp('0%'),fontSize : hp('6%'),fontWeight : 'bold',color  : '#39c6f4'}}>Impex</Text>
                    <ProgressBar progress = {this.state.progress} color = {"#154293"} style = {{marginTop : hp('20%'),height : hp('4%')}}/>
                </View>
            )
        }
    }
}

    const styles = StyleSheet.create({
        main : {
            flex : 1,
            backgroundColor : 'white'
        },
        ImageBackground:{
            height:hp('40%'),
            width:wp('100%'),
            backgroundColor: '#154293',
        },
        image:{
            width:hp('15%'),
            height:hp('15%'),
            borderRadius:hp('15%')    
        },
        profile:{
            marginTop:-hp('10%'),
            alignItems:'center'
        },
        UserName : {
            alignItems:'center',
            marginTop:hp('2%')
        },
        text : {
            fontSize:hp('3%'),
            color : '#154293',
        },
        email : {
            flexDirection:'row',
            marginTop : hp('4%'),
            marginLeft:wp('5%')
        },
        value : {
            fontSize:hp('2.5%'),
            width : wp('75%'),
            marginLeft:wp('4%'),
            marginTop : hp('1%')
        },
        iconcon : {
            alignItems : 'center',
            height : hp('6%'),
            width : hp('6%'),
            borderRadius : hp('6%'),
            backgroundColor : '#154293'
        },
        title:{
            color:'white',
            fontSize:hp('2.5%'),
            marginTop:hp('4%'),
            textAlign : 'center'
        },
    })