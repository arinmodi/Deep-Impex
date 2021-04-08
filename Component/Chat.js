import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { styles } from '../AdminScreens/Component/styles';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Feather, MaterialCommunityIcons, AntDesign } from '../Icons/icons';
import { Bubble, GiftedChat, Avatar,Time } from 'react-native-gifted-chat';
import { database, f } from '../config/config';
import { Fetch_Chats } from '../App-Store/Actions/Chats';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import Load from './loaddata';
import Header from './Header';

function Chat(props){

    const [ height, setheight ] = useState(0);
    const [ message, setmessage ] = useState('');
    const [name , setname ] = useState('');
    const [modal, setmodal] = useState(false);

    useEffect(() => {
        props.Fetch_Chats();
    }, [])

    const s4 = () => {
        return Math.floor((1+Math.random())* 0x10000).toString(16).substring(1)
    }
    
    
    const uniqueid = async () => {
        console.log('Add2')
        return 'Chat' + '-' + s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4();
    }


    const send = async () => {
        const mes = message;
        setmessage(" ");
        if(mes!== '' && mes !== ' ' && mes.length > 0){
            const empid = f.auth().currentUser.uid;
            const timestamp = f.database.ServerValue.TIMESTAMP;
            const chatid = await uniqueid();
            
            try{
                await database.ref('Chats').child(chatid).set({
                    Message : message,
                    empid : empid,
                    timestamp : timestamp,
                    name : global.PersonName ? global.PersonName : "Alpesh Patel"
                })
            }catch(e){
                console.log(e);
                alert("something bad happen try again")
            }
        }
    }

    const hide = () => {
        setname('');
        setmodal(false);
    }

    const onPress = (nameval) => {
        setname(nameval);
        setmodal(true);
    }

    return(
        <View style = {{backgroundColor : '#E9E9E9',flex : 1}}>
            <Header 
                Name = {'Chat'}
                onPress = {() => props.navigation.toggleDrawer()}
            />

            <View style = {{flex : 1}}>
                <GiftedChat 
                    messages = {props.Chats}

                    renderFooter = {() => {
                        return(
                            <View style = {{height : hp('5%')}}>
                            
                            </View>
                        )
                    }}

                    renderBubble = {(props) => {
                        return(
                            <Bubble 
                                {...props}
                                wrapperStyle = {{
                                    left : {
                                        backgroundColor : '#E9E9E9',marginVertical : hp('0.5%')
                                    },
                                    right : {backgroundColor : '#E9E9E9',marginVertical : hp('0.5%') }
                                }}
                            />
                        )
                    }}

                    renderMessageText = {(props) => {
                        return(
                            <View>
                                <Text style = {{backgroundColor : props.position === "right" ? '#D6FFFB': 'white',borderRadius : wp('3%'),borderTopRightRadius : wp('3%'),borderBottomRightRadius : wp('3%'),paddingVertical: hp('1%'),paddingHorizontal : wp('2%'),fontSize : hp('2%'),color : 'black'}}>{props.currentMessage.text}</Text>
                            </View>
                        )
                    }}

                    renderTime = {(props) => {
                        return(
                            <Time {...props}   
                                timeTextStyle = {{
                                    left : {
                                        color : 'black'
                                    },

                                    right : {
                                        color : 'black'
                                    }
                                }}
                            />
                        )
                    }}

                    renderComposer = {(props) => {

                        return(
                            <View style = {{backgroundColor : '#E9E9E9',width : wp('100%'),borderWidth : 1,flexDirection : 'row'}}>
                                <TextInput 
                                    style = {{...Style.Input, ...{height : Math.max(hp('5%'), height)}}}
                                    multiline = {true}
                                    onChangeText = {(text) => {
                                        setmessage(text)
                                    }}
                                    onContentSizeChange = {(event) => {setheight(event.nativeEvent.contentSize.height)}}
                                    value = {message}
                                />
                                <View style={{marginTop : hp('1.7%'),marginLeft : wp('3%')}}>
                                    <TouchableOpacity onPress = {() => send()} activeOpacity = {0.4}>
                                        <MaterialCommunityIcons name="send-circle" size={hp('6%')} color="#154293" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    }}

                    user = {{
                        _id : f.auth().currentUser.uid
                    }}

                    renderAvatarOnTop = {true}

                    renderAvatar = {(props) => {
                        return(
                            <Avatar {...props}
                            onPressAvatar = {() => onPress(props.currentMessage.user.name)}
                            
                            />
                        )
                    }}

                    renderLoading = {() => {
                        return(
                            <Load style = {{flex : 1}}/>
                        )
                    }}

                />
            </View>


            <Modal 
            isVisible = {modal}
            onBackButtonPress = {() => hide()}
            onBackdropPress = {() => hide()}
            >

                <View style = {{height : hp('10%'),borderRadius : wp('5%'),backgroundColor : 'white',alignItems : 'center',width  : wp('70%'),justifyContent : 'center',color : 'black'}}>
                    <Text style = {{fontSize : hp('2.5%'),fontWeight : 'bold'}}>{name}</Text>
                </View>

            </Modal>
        </View>
    )
}

const Style = StyleSheet.create({
    Input : {
        backgroundColor : 'white',
        padding : hp('1%'),
        paddingLeft : wp('5%'),
        width : wp('78%'),
        marginLeft : wp('2%'),
        borderRadius : wp('3%'),
        fontSize : hp('2.2%'),
        elevation : 5,
        marginBottom : hp('2%'),
        marginTop : hp('2%')
    }
});

const mapDispatchToProps = (dispatch) => {
    return {
        Fetch_Chats : () => { dispatch(Fetch_Chats()) },
    }
}

const mapStateToProps = (state) => {
    return {
       Chats : state.Chats.Chats
    }
}

export default connect(mapStateToProps , mapDispatchToProps)(Chat);