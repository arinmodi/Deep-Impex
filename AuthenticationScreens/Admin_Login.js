import React, { useRef, useState } from 'react';
import { 
    View,
    Text,
    Image,
    TouchableNativeFeedback,
    StyleSheet,
    TextInput 
} from 'react-native';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Ionicons } from '../Icons/icons';
import { Card } from 'react-native-paper';
import { f, auth } from '../config/config';
import Loading from '../Component/Loading';
import RNOtpVerify from 'react-native-otp-verify';

export default function Admin_Login(props){
        const [ MobileNo , SetMobileNo ] = useState('');
        const [ Process, setprocess ] = useState(0);

        const Welcome=()=>{
            props.navigation.navigate('Welcome')
        }

        const UserVerification = () => {
            setprocess(2);
            if(MobileNo == ''){
                setprocess(0);
                alert('please enter mobile no');
            }else if(MobileNo.length !== 10){
                setprocess(0);
                alert('Number too short')
            }else if(MobileNo !== '9974699330' && MobileNo !== '7228996440'){
                setprocess(0);
                alert('Invalid Number')
            }else {
                Login()
            }
        } 

        async function Login(){
            try {
                const result = await signin();
                setprocess(0);
            
                props.navigation.navigate({ routeName : 'OTP_Login',
                    params : {
                        result : result,
                        nav : 'admin'
                    }
                }) 
                     
                } catch (error){
                    alert(error);
                    console.log(error)
                    props.navigation.navigate('login');
                    SetMobileNo('')
                } 
        }

        const signin = async () => {
            var phone = '+91' + MobileNo;
            const confirm = await auth.signInWithPhoneNumber(phone);
            return confirm;
        }

        return(
            <View style = {{flex : 1,backgroundColor : 'white'}}>
                <View style={styles.ImageBackground}>
                    <Ionicons style={styles.icon} name="md-arrow-back" size={hp('4%')} color="white" onPress={Welcome} />
                    <Image source = {require('../assets/Mobile_Phone.png')} style = {{height : hp('10%'),width : hp('10%'),alignSelf : 'center',marginTop : -hp('1%')}} />
                    <Text style = {styles.title}>Admin Number!</Text>
                </View>
                <View style = {{marginTop : -hp('10%'),backgroundColor : 'white',borderTopLeftRadius : wp('15%')}}>
                <View style = {{marginTop : hp('5%')}}>
                    <TextInput
                        style={styles.Input} 
                        editable={true}
                        keyboardType = 'phone-pad'
                        placeholder={'Mobile No e.g +919865472310'}
                        placeholderTextColor='#5E615D'
                        onChangeText={SetMobileNo}
                    />
                </View>
                <View style={{flexDirection:'row'}}>
                    <TouchableNativeFeedback onPress = {UserVerification}>
                        <Card style={styles.button}>
                            <Text style={styles.buttontext}>Log In</Text>
                        </Card>
                    </TouchableNativeFeedback>
                </View>
                </View>

                <Loading 
                isVisible = { Process > 1 }
                data = "Verifiying Wait.."
                />
            </View>
        )
    }

const styles = StyleSheet.create({
    ImageBackground:{
        height:hp('42%'),
        width:wp('100%'),
        backgroundColor: '#154293',
    },
    title:{
        color:'#C6C7CB',
        fontSize:hp('2.5%'),
        marginTop:hp('5%'),
        textAlign : 'center'
    },
    icon:{
        marginLeft:wp('5%'),
        marginTop:wp('8%')
    },
    Input:{
        height:hp('7%'),
        padding:wp('2%'),
        paddingLeft:wp('5%'),
        borderRadius:wp('10%'),
        color:'black',
        fontSize:hp('2%'),
        marginTop:wp('8%'),
        marginHorizontal:wp('5%'),
        width:wp('90%'),
        borderColor : "black",
        borderWidth : 1,
        backgroundColor : '#F5F6FB'

    },
    button:{
        height:hp('7%'),
        width:wp('40%'),
        marginVertical:hp('5%'),
        alignItems:'center',
        backgroundColor: '#154293',
        borderRadius:wp('5%'),
        marginLeft:wp('5%'),
        elevation : 10
    },
    buttontext:{
        color:'white',
        fontSize:hp('3%'),
        marginTop:hp('1%'),
    },
})