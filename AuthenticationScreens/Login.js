import React, { useRef, useState } from 'react';
import { 
    View,
    Text,
    Image,
    TouchableNativeFeedback,
    StyleSheet,
    TouchableOpacity,
    TextInput 
} from 'react-native';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Ionicons } from '../Icons/icons';
import { Card, Modal } from 'react-native-paper';
import Help from '../Component/NeedHelpModal';
import { f,functions } from '../config/config';
import Loading from '../Component/Loading';

export default function Login(props){
        const [ MobileNo , SetMobileNo ] = useState('');
        const [ Modal , SetModal ] = useState(false);
        const [ Process, setprocess ] = useState(0);

        const Welcome=()=>{
            props.navigation.navigate('Welcome')
        }

        const Admin=()=>{
            props.navigation.navigate('Admin_Log')
        }

        const Register=()=>{
            props.navigation.navigate('PP')
        }

        const HelpFunction = () => {
            SetModal(true)
        }

        const HideModal = () => {
            SetModal(false)
        }

        const UserVerification = () => {
            setprocess(2);
            console.log(process);
            if(MobileNo === '' || MobileNo === "9974699330"){
                alert('please enter valid mobile no');
                setprocess(0);
            }else if(MobileNo.length !== 10){
                alert('Number too short');
                setprocess(0);
            }else if(!MobileNo.match(/^([6-9]{1})([0-9]{9})$/)){
                alert('Invalid Number');
                setprocess(0);
            }else {
                try{
                    const createNewUser = functions.httpsCallable('createNewUser');
                    var phone = '+91' + MobileNo
                    createNewUser({phone : phone})
                    .then(result => {
                        if(result.data === false){
                            setprocess(0);
                            alert('User Not exist , Sign Up required')
                        }else {
                            Login();
                        }
                    })
                } catch (error){
                    alert(error)
                }
            }
        } 

        async function Login(){
            try {
                const result = await signin();
                setprocess(0);
                props.navigation.navigate({ routeName : 'OTP_Login',
                    params : {
                        result : result,
                    }
                }) 
                     
                } catch (error){
                    alert(error)
                    props.navigation.navigate('login');
                    SetMobileNo('');
                } 
        }

        const signin = async () => {
            var phone = '+91' + MobileNo;
            const confirm = await f.auth().signInWithPhoneNumber(phone);
            return confirm;
        }

        return(
            <View style = {{flex : 1,backgroundColor : 'white'}}>
                <View style={styles.ImageBackground}>
                    <Ionicons style={styles.icon} name="md-arrow-back" size={hp('4%')} color="white" onPress={Welcome} />
                    <Image source = {require('../assets/Mobile_Phone.png')} style = {{height : hp('10%'),width : hp('10%'),alignSelf : 'center',marginTop : -hp('1%')}} />
                    <Text style = {styles.title}>Mobile Number!</Text>
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

                <View style={{alignItems : 'center',marginTop : hp('4%')}}>
                    <TouchableOpacity onLongPress = {Admin}>
                        <Text style={{fontSize:hp('2.5%'),color : 'black'}}>Admin Login</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <View style={{flexDirection:'row',alignItems:'flex-end'}}>
                        <Text style={{...styles.text2,...{marginLeft:wp('8%'),
                        color:'#062A04',fontSize:hp('2%'),marginTop:hp('18%')}}}
                        >
                            You are not a member? 
                        </Text>
                        <TouchableOpacity onPress={Register}>
                            <Text style={{...styles.text2,...{marginLeft:wp('2%'),
                            color:'#154293',fontSize:hp('2%')}}}
                            >
                                Register
                             </Text>
                        </TouchableOpacity>
                    </View>   
                </View>

                </View>

                <Help 
                    isVisible = {Modal}
                    BackButton = {HideModal}
                    BackDrop = {HideModal}
                />

                <Loading 
                    isVisible = { Process > 1 }
                    data = "Veryfying"
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