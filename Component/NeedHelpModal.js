import React from 'react';
import { View,Text,StyleSheet,TextInput,TouchableNativeFeedback } from 'react-native';
import { Card } from 'react-native-paper';
import Modal from 'react-native-modal';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';

export default function Help(props){
    return(
        <View style={{flex:1}}>
        <Modal
            isVisible = {props.isVisible}
            animationIn = {"bounce"}
            onBackButtonPress = {props.BackButton}
            onBackdropPress = {props.BackDrop}
        >
            <View style={styles.Modal}>
                <Text style={styles.title}>Write Your Query Here!</Text>
                <View style={{...styles.AddModalInputCont,...{width:wp('75%'),flexDirection:'row', marginLeft :wp('8%'),marginTop:hp('2%'),height:hp('15%')}}}>
                    <Text style={styles.AddModalInputContTitle}>Message</Text>
                    <TextInput
                        style={{...styles.Textinput,...{marginTop:-hp('5%')}}}
                        placeholder = {"Type a Message or write No Annonation"}
                        keyboardType = {"default"}
                        multiline = {true}
                    />
                </View>
                <View style={{...styles.AddModalInputCont,...{width:wp('75%'),flexDirection:'row', marginLeft :wp('8%'),marginTop:hp('4%')}}}>
                    <Text style={styles.AddModalInputContTitle}>Your Mobile Number</Text>
                    <TextInput
                        style={styles.Textinput}
                        placeholder = {"+917228996550"}
                        keyboardType = {"default"}
                        multiline = {true}
                    />
                </View>

                <View style={styles.ButtonCon}>
                <TouchableNativeFeedback>
                    <Card style={styles.Button}>
                        <Text style={styles.Button_text}>Send</Text>
                    </Card>
                </TouchableNativeFeedback>
            </View>
            </View>
        </Modal>
        </View>
    )
} 

const styles = StyleSheet.create({
    Modal : {
        backgroundColor:'white',
        borderRadius:wp('5%'),
        overflow:'hidden',
        height : hp('50%')
    },
    title : {
        textAlign:'center',
        fontSize : hp('3%'),
        color : '#154293',
        marginVertical:hp('2%'),
        fontWeight:'bold'
    },
    AddModalInputCont : {
        borderWidth:2,
        marginTop:hp('4%'),
        marginHorizontal:wp('3%'),
        borderRadius : wp('3%'),
        height:hp('7%'),
        width:wp('40%'),
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
        marginTop : hp('4%'),
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
    icon:{
        marginTop:hp('5%'),
        marginLeft:wp('3%')
    },
})