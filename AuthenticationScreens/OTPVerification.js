import React, { useEffect, useState, useRef } from 'react';
import { 
    View,
    Text,
    Image,
    TouchableNativeFeedback,
    StyleSheet,
    TouchableOpacity, 
    ToastAndroid,
} from 'react-native';
import OtpInputs from './OTPInputs'
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Ionicons } from '../Icons/icons';
import { Card } from 'react-native-paper';
import { f, storage, database, auth } from '../config/config';
import Help from '../Component/NeedHelpModal';
import Loading from '../Component/Loading';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RNOtpVerify from 'react-native-otp-verify';

export default function OTP(props){

    const result = props.navigation.getParam('result');
    const UserName = props.navigation.getParam('Username');
    const email = props.navigation.getParam('Email');
    const phone = props.navigation.getParam('phone');
    const PP = props.navigation.getParam('PP');
    const imgid = props.navigation.getParam('imgid');

    const [code, setCode] = useState('');
    const [ currentfiletype, setcurrentfiletype ] = useState('');
    const [ modal,setmodal ] = useState(false);
    const [ process, setprocess ] = useState(0);
    const [ otp, setotp ] = useState([]);
    const [ auto, setauto ] = useState(false);



    const HelpFunction = () => {
        setmodal(true)
    }

    const HideModal = () => {
        setmodal(false)
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


    const UploadImage = async () => {
        setprocess(2);
        var userid = await auth.currentUser.uid;
        var imageid = imgid;

        console.log('UploadImage')
      
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(PP)[1];
        setcurrentfiletype(ext);
      
        const response = await fetch(PP);
        const blob = await response.blob();
        var filepath = imageid + '.' + currentfiletype;
      
        const UploadTask = storage.ref('Profile_Images_of_Requested_User/'+userid+'/img').child(filepath).put(blob);

        UploadTask.on('state_changed', function(snapshot){
          var Progres = ((snapshot.bytesTransferred / snapshot.totalBytes)*100).toFixed(0);
        },
        function(error){
            setprocess(0);
            alert(error)
        },
        function(){
            UploadTask.snapshot.ref.getDownloadURL().then(
                    (downloadurl) => {
                        sendRequest(downloadurl);
                    }
                )
            }
        )
    } 

    const sendRequest = async (imageUrl) => {

        var userid = f.auth().currentUser.uid;

        var RequestObj = {
            ProfileImage : imageUrl,
            UserName : UserName,
            Email : email,
            PhoneNumber : phone,
            Active : true,
        }

        await database.ref('/Requests/'+userid).set(RequestObj);
        setprocess(0);
        props.navigation.navigate('Wait');
    }

    async function confirmCode(){
        try{
            const user = f.auth().currentUser;
            if(user){
                await UploadImage();
            }else{
                console.log('not verified')
                await result.confirm(code).then(async () => {
                    await UploadImage();
                })
            }
        } catch(error){
            alert("Invalid OTP");
            console.log(error);
            props.navigation.navigate('SignUP');
        }
    };

    const Welcome=()=>{
        props.navigation.navigate('Welcome')
    }

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
    
                <Help 
                    isVisible = {modal}
                    BackButton = {HideModal}
                    BackDrop = {HideModal}
                />

                <Loading 
                    isVisible = { process > 1 }
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