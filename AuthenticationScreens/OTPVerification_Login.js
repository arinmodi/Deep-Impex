import React, { useState, useEffect } from 'react';
import { 
    View,
    Text,
    Image,
    TouchableNativeFeedback,
    StyleSheet,
    ToastAndroid
} from 'react-native';
import OtpInputs from './OTPInputs'
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Ionicons } from '../Icons/icons';
import { Card } from 'react-native-paper';
import { f } from '../config/config';
import Loading from '../Component/Loading';
import RNOtpVerify from 'react-native-otp-verify';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


export default function OTP_Login (props){

    const result = props.navigation.getParam('result');
    const nav = props.navigation.getParam('nav');
    const [code, setCode] = useState('');
    const [ Process, setprocess ] = useState(0);
    const [ otp, setotp ] = useState([]);
    const [ auto, setauto ] = useState(false);


    async function confirmCode(){
        setprocess(2);
        try{
            const user = f.auth().currentUser;
            if(user){
                setprocess(0);
                if(nav === 'admin'){
                    props.navigation.navigate('Admin');
                }else{
                    props.navigation.navigate('Wait');
                }
            }else{
                await result.confirm(code).then((result) => {
                    setprocess(0);
                    if(nav === 'admin'){
                        props.navigation.navigate('Admin');
                    }else{
                        props.navigation.navigate('Wait');
                    }
                });
            }
        } catch(error){
            setprocess(0);
            alert("Invalid OTP");
            console.log(error);
            props.navigation.navigate('login');
        }
    };

    const Welcome=()=>{
        props.navigation.navigate('Welcome')
    }

    useEffect(() => {
        if(f.auth.PhoneAuthState.CODE_SENT){
            ToastAndroid.show("OTP Sent!", ToastAndroid.LONG);
            RNOtpVerify.getOtp()
            .then((p) => {
                RNOtpVerify.addListener((message) => {
                    console.log("Listener Added");
                    try {
                        if (message && message !== 'Timeout Error') {
                            console.log("Message Found", message)
                            const otp = new RegExp(/(\d{6})/g.exec(message)[1]);
                            console.log("OTP Found",otp.source,otp.source.length)
                            if (otp.source.length >= 6) {
                                console.log("setting otp...");
                                var otpnumbers = [];
                                for(var i = 0; i <= otp.source.length; i++){
                                    var num = otp.source.charAt(i);
                                    console.log('Setting',num)
                                    otpnumbers[i] = num;
                                }
                                setotp(otpnumbers);
                                setauto(true);
                            }else{
                                console.log("Not otp...")
                            }
                        } else {
                            console.log( 'OTPVerification: RNOtpVerify.getOtp - message=>', message );
                        }
                    } catch (error) {
                        console.log('OTPVerification: RNOtpVerify.getOtp error=>', error );
                    }
                });
            })
            .catch((error) => {
                console.log(error);
            });
 
            return () => {
                RNOtpVerify.removeListener();
            };
        }
    }, []);

    const setOtp = (index) => {
        console.log(otp[index]);
        return otp[index].toString();
    }

    return(
        <KeyboardAwareScrollView enableAutomaticScroll = {true} style = {{flex : 1, backgroundColor : 'white'}}>
        <View style={styles.container}>
            <View style={styles.ImageBackground}>
                <Ionicons style={styles.icon} name="md-arrow-back" size={hp('4%')} color="white" onPress={Welcome} />
                <Image source = {require('../assets/otp.png')} style = {{height : hp('10%'),width : hp('10%'),alignSelf : 'center',marginTop : -hp('1%')}} />
                <Text style = {styles.title}>OTP!</Text>
            </View>

            <View style = {{flex : 1,marginTop : -hp('10%'),backgroundColor : 'white',borderTopLeftRadius : wp('15%')}}>

            <View style = {{flex : 1,marginTop : hp('10%'),backgroundColor : 'white'}}>

            <Text style = {{...styles.title, ...{color : 'black',marginTop : hp('1%')}}}>Enter OTP</Text>

            <OtpInputs getOtp={setCode} autofill = {auto} setotp = {(index) => setOtp(index)}/>

            <View style={{flex : 1}}>
                <TouchableNativeFeedback onPress={confirmCode}>
                    <Card style={styles.button}>
                        <Text style={styles.buttontext}>Submit</Text>
                    </Card>
                </TouchableNativeFeedback>
            </View>
            </View>
            </View>

            <Loading 
                isVisible = { Process > 1 }
                data = "Checking"
            />

            
        </View>
    </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    ImageBackground:{
        height:hp('40%'),
        width:wp('100%'),
        backgroundColor: '#154293',
    },
    title:{
        color:'#C6C7CB',
        fontSize:hp('2.5%'),
        marginTop:hp('5%'),
        textAlign : 'center',
        marginLeft: -wp('5%')
    },
    icon:{
        marginLeft:wp('5%'),
        marginTop:wp('8%')
    },
    button:{
        height:hp('7%'),
        width:wp('40%'),
        marginVertical:hp('2%'),
        alignItems:'center',
        backgroundColor: '#154293',
        borderRadius:wp('5%'),
        alignSelf : 'center',
        elevation : 10
    },
    buttontext:{
        color:'white',
        fontSize:hp('3%'),
        marginTop:hp('1%'),
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
})