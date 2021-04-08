import React, { useState,useRef } from 'react';
import { 
    View,
    Text,
    ImageBackground,
    TouchableNativeFeedback,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    Dimensions
} from 'react-native';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Ionicons } from '../Icons/icons';
import { Card } from 'react-native-paper';
import { f, functions } from '../config/config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Help from '../Component/NeedHelpModal';
import Loading from '../Component/Loading';

export default function Register (props){
    const [phoneNumber, setPhoneNumber] = useState('');
    const [ email,setemail ] = useState('');
    const [ Username,setUsername ] = useState('');
    const [ modal,setmodal ] = useState(false);
    const PP = props.navigation.getParam('PP');
    const imgid = props.navigation.getParam('imgid');
    const [ Process, setprocess ] = useState(0);

    const ProfilePhoto = () => {
        props.navigation.navigate('PP')
    }

    const HelpFunction = () => {
        setmodal(true)
    }

    const HideModal = () => {
        setmodal(false)
    }

    const Login = () => {
        props.navigation.navigate('login')
    }

    async function sendVerification(){
        try {
            const result = await signin();
            setprocess(0);
            props.navigation.navigate({ routeName : 'OTP',
                params : {
                    result : result,
                    PP : PP,
                    imgid : imgid,
                    Username : Username,
                    Email : email,
                    phone : '+91' + phoneNumber,
                }
            });
                 
            } catch (error){
                alert(error)
                props.navigation.navigate('SignUP')
            }  
    };

    const signin = async () => {
        var phone = '+91' + phoneNumber;
        const confirm = await f.auth().signInWithPhoneNumber(phone);
        return confirm;
    }

    const Signupuser = () => {
        setprocess(2);
        if(phoneNumber == '' || phoneNumber.length !== 10 || !phoneNumber.match(/^([6-9]{1})([0-9]{9})$/) || phoneNumber === '9974699330'){
            alert("There was a Problem With Your Phone Number, Ensure that your number must be correct inorder to login");
            setprocess(0)
        }
        else if(Username == '' || Username.length < 6){
            alert('Name must be atleast 6 character long');
            setprocess(0);
        }else if(email == '' || email.length < 6){
            alert('Invalid Email');
            setprocess(0);
        }else {
            try{
                const createNewUser = functions.httpsCallable('createNewUser');
                var phone = '+91' + phoneNumber
                createNewUser({phone : phone})
                .then(result => {
                    if(result.data === true){
                        setprocess(0);
                        alert('User Already exist')
                    }else {
                        sendVerification()
                    }
                })
            } catch (error){
                alert(error)
            }
        }
    }

    return(
        <KeyboardAwareScrollView enableAutomaticScroll = {true} style = {{flex : 1, backgroundColor : 'white'}}>
        <View style = {{flex : 1,backgroundColor : 'white'}}>
            <View style={styles.ImageBackground}>
                <Ionicons style={styles.icon} name="md-arrow-back" size={hp('4%')} color="white" onPress={ProfilePhoto} />
                <Text style = {styles.title}> Register </Text>
            </View>

            <View style = {{marginTop : -hp('15%'),backgroundColor : 'white',borderTopLeftRadius : wp('15%')}}>

            <View style={styles.profile}>
                <Image source={{uri:PP}} style={styles.image}/> 
            </View>

            <View>
                <TextInput
                    style={styles.Input} 
                    editable={true}
                    placeholder={'Aster Andrew'}
                    placeholderTextColor='#5E615D'
                    onChangeText={setUsername}
                />
            </View>

            <View>
                <TextInput
                    style={styles.Input} 
                    editable={true}
                    keyboardType = 'email-address'
                    placeholder={'asterandrew_1234@gmail.com'}
                    placeholderTextColor='#5E615D'
                    onChangeText={setemail}
                />
            </View>

            <View>
                <TextInput
                    style={styles.Input} 
                    editable={true}
                    placeholder={'Mobile No e.g +919865472310'}
                    placeholderTextColor='#5E615D'
                    onChangeText={(text) => { setPhoneNumber(text)  }}
                    keyboardType = {"phone-pad"}
                />
            </View>

            <View style={{flexDirection:'row'}}>
                <TouchableNativeFeedback onPress={()=>Signupuser()}>
                    <Card style={styles.button}>
                        <Text style={styles.buttontext}>Sign Up</Text>
                    </Card>
                </TouchableNativeFeedback>
            </View>

            <View>
                <View style={{flexDirection:'row',alignItems:'flex-end'}}>
                    <Text style={{...styles.text2,...{marginLeft:wp('8%'),
                    color:'#062A04',fontSize:hp('2%'),marginTop:hp('7%')}}}
                    >
                        Already a member? 
                    </Text>
                    <TouchableOpacity onPress = {Login}>
                        <Text style={{...styles.text2,...{marginLeft:5,
                        color:'#154293',fontSize:hp('2%')}}}
                        >
                            Login
                            </Text>
                    </TouchableOpacity>
                </View>   
            </View>

            </View>

            <Help 
                isVisible = {modal}
                BackButton = {HideModal}
                BackDrop = {HideModal}
            />

            <Loading 
                isVisible = { Process > 1 }
                data = "Veryfying"
            />

        </View>
        </KeyboardAwareScrollView>
    )
}

export const styles = StyleSheet.create({
    ImageBackground:{
        height:hp('40%'),
        width:wp('100%'),
        backgroundColor: '#154293',
    },
    title:{
        color:'white',
        fontSize:hp('2.5%'),
        marginTop:-hp('4%'),
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
    image:{
        width:hp('15%'),
        height:hp('15%'),
        borderRadius:hp('15%')  
    },
    profile:{
        marginTop:-hp('10%'),
        alignItems:'center'
    },
})