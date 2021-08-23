import React from 'react';
import { View, Text, StyleSheet,Image, TouchableOpacity, TextInput, ToastAndroid, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { FontAwesome, AntDesign, MaterialIcons, FontAwesome5, Entypo } from '../Icons/icons';
import {  database, f, storage  } from '../config/config';
import ImagePicker from 'react-native-image-crop-picker';
import * as Permissions from 'expo-permissions';
import Loading from '../Component/Loading';
import Modal from 'react-native-modal';
import { styles } from '../AuthenticationScreens/Register';
import Confirmation from '../Component/ConfirmationModal';
import Load from '../Component/loaddata';
import { Restart } from 'fiction-expo-restart';
import { StackActions, NavigationActions } from 'react-navigation';

export default class Profile extends React.Component{

    constructor(){
        super();
        this.state = {
            user : {},
            process : 0,
            newname : '',
            newmail : '',
            modal : false,
            delete : false,
            loading : true,
        }
    };

    componentDidMount = () => {
        this.fetch_user_profile();
    };

    fetch_user_profile = async () => {

        const uid = f.auth().currentUser.uid;
        const ref = database.ref("Accepted_Employee").child(uid);

        await ref.once("value").then(data => {
            let user = data.val();

            this.setState({
                user : {
                    Name : user.UserName,
                    Image : user.ProfileImage,
                    number : user.PhoneNumber,
                    email : user.Email,
                },
                newname : user.UserName,
                newmail : user.Email
            })
        })

        this.setState({
            loading : false
        });
        
    }

    getGalleryPermissionAsync = async () => {
        let Gallery = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
        if ( Gallery.status !== "granted"){
          alert('Sorry, we need Gallery permissions to make this work!');
        }
    };

    _pickGalleryImage = async () => {
        this.getGalleryPermissionAsync();
        try{
            ImagePicker.openPicker({
                mediaType : 'photo',
                cropping : true
            }).then(async res => {
                if(!res.path){

                }else{
                    await this.UploadImage(res.path);
                }
            }).catch(e => {

            })
        }catch (error){
            console.log(error);
        }
    }

    s4 = () => {
        return Math.floor((1+Math.random())* 0x10000).toString(16).substring(1)
    }
      
    uniqueid = () => {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
        this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4();
    }

    UploadImage = async (PP) => {
        this.setState({ process : 2 })
        var that = this;
        var userid = f.auth().currentUser.uid;;
        var imageid = this.uniqueid();

        console.log('UploadImage')
      
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(PP)[1];
      
        const response = await fetch(PP);
        const blob = await response.blob();
        var filepath = imageid + '.' + ext;
      
        const UploadTask = storage.ref('Profile_Images_of_Requested_User/'+userid+'/img').child(filepath).put(blob);
        UploadTask.on('state_changed', function(snapshot){
          var Progres = ((snapshot.bytesTransferred / snapshot.totalBytes)*100).toFixed(0);
        },
        function(error){
          this.setState({ process : 0 })
          alert(error)
        },
        function(){
          UploadTask.snapshot.ref.getDownloadURL().then(
            function(downloadURL){
                that.updatepic(downloadURL)
            }
            )
          }
        )
    } 

    updatepic = async (imageUrl) => {
        var userid = f.auth().currentUser.uid;
        await database.ref('/Accepted_Employee/'+userid).update({
            ProfileImage : imageUrl
        });
        this.setState({ process : 0 });
        global.image = imageUrl;
        this.fetch_user_profile();
    }

    onSave = async () => {
        if(this.state.newmail === this.state.user.email && this.state.newname === this.state.user.Name){
            alert('Do not need to edit')
        }else{
            if(this.state.newname === ' ' || this.state.newname.length < 6){
                alert('Enter valid name')
            }else if(this.state.newmail  === ' ' || this.state.newmail.length < 6){
                alert('Enter valid email')
            }else{
                await this.updateprofile();
            }
        }
    }

    updateprofile = async () => {
        this.setState({ process : 2 });
        var userid = f.auth().currentUser.uid;
        await database.ref('/Accepted_Employee/'+userid).update({
            UserName : this.state.newname,
            Email : this.state.newmail
        });
        this.setState({ process : 0 });
        global.PersonName = this.state.newname;
        this.fetch_user_profile();
        this.modalhide();
    }

    modalshow = () => {
        this.setState({
            modal : true
        })
    }

    modalhide = () => {
        this.setState({
            newname : this.state.user.Name,
            newmail : this.state.user.email,
            modal : false
        })
    }

    Logout = () => {
        f.auth().signOut().then(
            ToastAndroid.show('Signed Out', ToastAndroid.SHORT)
        );

        global.stackNavigator.dispatch(NavigationActions.navigate({ routeName : 'Welcome',params : { Restart : true } }))
    }

    render(){

        const HideDelete = () => {
            this.setState({
                delete : false
            })
        }

        const onYesPress = () => {
            HideDelete();
            this.Logout();
        }


        return(
            <View style = {{flex : 1, backgroundColor : 'white'}}>
                <View style = {Profile_Style.header}>
                    <Text style = {{marginTop : hp('3%'),fontSize : hp('3%'),color : 'white'}}>Profile</Text>
                </View>

                {this.state.loading === false ? (
                    <View>
                        <View style = {Profile_Style.con}>
                            <Image source = {{uri : this.state.user.Image}} style = {Profile_Style.image}/>
                            <Text style = {Profile_Style.name}>{this.state.user.Name}</Text>
                        </View>

                        <View style = {Profile_Style.buttons}>
                            <Card style = {Profile_Style.buttoncon}>
                                <TouchableOpacity activeOpacity = {0.5} onPress = {() => this._pickGalleryImage()}>
                                    <View style = {{flexDirection : 'row'}}>
                                        <View style= {{marginLeft : wp('3%'),marginTop : hp('1.2%')}}>
                                            <FontAwesome name="camera" size={hp('3%')} color="#154293" />
                                        </View>
                                        <View style= {{marginLeft : wp('3%'),marginTop : hp('1.5%')}}>
                                            <Text style = {{fontSize : hp('2%'),color : '#154293'}}>Edit Pic</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </Card>

                            <Card style = {{...Profile_Style.buttoncon, ...{backgroundColor : '#154293',borderColor : 'black'}}}>
                                <TouchableOpacity activeOpacity = {0.5} onPress = {() => this.modalshow()}>
                                    <View style = {{flexDirection : 'row'}}>
                                        <View style= {{marginLeft : wp('3%'),marginTop : hp('1.2%')}}>
                                            <AntDesign name="user" size={hp('3%')} color="white" />
                                        </View>
                                        <View style= {{marginLeft : wp('3%'),marginTop : hp('1.5%')}}>
                                            <Text style = {{fontSize : hp('2%'),color : 'white'}}>Edit Profile</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </Card>
                        </View>

                        <View style = {Profile_Style.Email}>
                            <View style = {Profile_Style.iconcon}>
                                <MaterialIcons name="phone" size={hp('3%')} color="white" style = {{marginTop : hp('1.25%')}} />
                            </View>
                            <Text style = {Profile_Style.text}>{this.state.user.number}</Text>
                        </View>

                        <View style = {Profile_Style.Email}>
                            <View style = {Profile_Style.iconcon}>
                                <MaterialIcons name="email" size={hp('3%')} color="white" style = {{marginTop : hp('1.25%')}} />
                            </View>
                            <Text style = {Profile_Style.text}>{this.state.user.email}</Text>
                        </View>

                        <View style = {{...Profile_Style.buttons, ...{justifyContent : 'center'}}}>
                            <Card style = {{...Profile_Style.buttoncon, ...{backgroundColor : 'red',borderColor : 'black'}}}>
                                <TouchableOpacity activeOpacity = {0.5} onPress = {() => this.setState({ delete : true })}>
                                    <View style = {{flexDirection : 'row'}}>
                                        <View style= {{marginLeft : wp('3%'),marginTop : hp('1.2%')}}>
                                            <AntDesign name="logout" size={hp('3%')} color="white" />
                                        </View>
                                        <View style= {{marginLeft : wp('3%'),marginTop : hp('1%')}}>
                                            <Text style = {{fontSize : hp('2.5%'),color : 'white'}}>Logout</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </Card>
                        </View>

                        <Loading 
                            isVisible = { this.state.process > 1 }
                            data = "Editing"
                        />

                        <Confirmation 
                            isVisible = {this.state.delete}
                            onBackButtonPress = {() => HideDelete()}
                            onBackdropPress = {() => HideDelete()}
                            question = {"Are You Sure, Want To Logout"}
                            onPressYes = {() => onYesPress()}
                            onPressNo = {() => HideDelete()}
                        />


                        <Modal 
                            isVisible = {this.state.modal}
                            onBackButtonPress = {() => this.modalhide()}
                            onBackdropPress = {() => this.modalhide()}
                        >
                            <View style = {{backgroundColor : 'white',height : hp('50%'),borderRadius : wp('5%')}}>
                                <Text style = {{textAlign : 'center',fontSize : hp('2.5%'),marginTop : hp('2%'),fontWeight : 'bold',color : 'black'}}>Edit Profile</Text>

                                <Text style = {{marginTop : hp('4%'),fontSize : hp('2.5%'),marginLeft : wp('6%'),fontWeight : 'bold',color : 'black'}}>User name : </Text>
                                <View>
                                    <TextInput
                                        style={{...styles.Input, ...{width : wp('70%'),backgroundColor : 'white',borderWidth : 1,marginTop : hp('1%')}}} 
                                        editable={true}
                                        value = {this.state.newname}
                                        onChangeText = {text => this.setState({newname : text})}
                                    />
                                </View>

                                <Text style = {{marginTop : hp('2%'),fontSize : hp('2.5%'),marginLeft : wp('6%'),fontWeight : 'bold',color : 'black'}}>Email : </Text>
                                <View>
                                    <TextInput
                                        style={{...styles.Input, ...{width : wp('80%'),backgroundColor : 'white',borderWidth : 1,marginTop : hp('1%')}}}  
                                        editable={true}
                                        value = {this.state.newmail}
                                        keyboardType = {"email-address"}
                                        onChangeText = {text => this.setState({newmail : text})}
                                    />
                                </View>

                                <Card style = {{...Profile_Style.buttoncon, ...{backgroundColor : '#154293',borderColor : 'black',marginTop : hp('4%'),marginLeft : wp('6%'),width : wp('30%')}}}>
                                    <TouchableOpacity activeOpacity = {0.5} onPress = {() => this.onSave()}>
                                        <View style = {{flexDirection : 'row'}}>
                                            <View style= {{marginLeft : wp('3%'),marginTop : hp('1.2%')}}>
                                                <AntDesign name="save" size={hp('3%')} color="white" />
                                            </View>
                                            <View style= {{marginLeft : wp('3%'),marginTop : hp('1%')}}>
                                                <Text style = {{fontSize : hp('2.5%'),color : 'white'}}>Save</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </Card>
                            </View>
                        </Modal>
                    </View>
                ):(

                    <Load 
                        style = {{flex : 1}}
                    />
                )}
            </View>
        )
    }
}

export const Profile_Style = StyleSheet.create({
    header : {
        height : hp('30%'),
        backgroundColor : '#154293',
        alignItems : 'center'
    },
    image : {
        height : hp('15%'),
        width : hp('15%'),
        borderRadius : hp('15%'),
        marginLeft : wp('8%'),
        borderWidth : 4,
        borderColor : 'white'
    },
    con : {
        marginTop : -hp('9%'),
        flexDirection : 'row'
    },
    name : {
        marginTop : hp('3%'),
        marginLeft : wp('5%'),
        fontSize : hp('3.5%'),
        fontWeight : 'bold',
        color : 'white'
    },
    buttons : {
        flexDirection : 'row',
        marginHorizontal : wp('5%'),
        marginTop : hp('8%'),
        justifyContent : 'space-between'
    },
    buttoncon : {
        height : hp('6%'),
        width : wp('40%'),
        backgroundColor : 'white',
        borderWidth : 1,
        borderRadius : wp('5%')
    },
    Email : {
        marginTop : hp('5%'),
        marginHorizontal : wp('5%'),
        flexDirection : 'row',
    },
    iconcon : {
        alignItems : 'center',
        height : hp('6%'),
        width : hp('6%'),
        borderRadius : hp('6%'),
        backgroundColor : '#154293'
    },
    text : {
        marginLeft : wp('3%'),
        fontSize : hp('2.5%'),
        marginTop : hp('1.25%'),
        width : wp('75%'),
        color : 'black'
    }
})