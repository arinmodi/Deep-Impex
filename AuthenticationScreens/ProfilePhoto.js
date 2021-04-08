import React from 'react';
import { 
    View,
    Text,
    ImageBackground,
    TouchableNativeFeedback,
    StyleSheet,
    Dimensions,
    Image, 
    TouchableOpacity
} from 'react-native';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Ionicons, SimpleLineIcons } from '../Icons/icons';
import { Card } from 'react-native-paper';
import  Modal from 'react-native-modal';
import * as Permissions from 'expo-permissions';
import { LogBox } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';


export default class ProfilePhoto extends React.Component{

    constructor(){
        super();
        this.state = {
            modal : false,
        }
        LogBox.ignoreLogs(['User rejected permissions']);
    }

    componentDidMount = async () => {
        await this.cheackpermissionsforCamera();
        await this.getGalleryPermissionAsync();
    }

    s4 = () => {
        return Math.floor((1+Math.random())* 0x10000).toString(16).substring(1)
    }
      
    uniqueid = () => {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
        this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4();
    }


    getGalleryPermissionAsync = async () => {
          let Gallery = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
          if ( Gallery.status !== "granted") {
            alert('Sorry, we need Gallery permissions to make this work!');
        }
    };

    cheackpermissionsforCamera = async () => {
        let Cam = await Permissions.askAsync(Permissions.CAMERA);
        if ( Cam.status !== "granted") {
            alert('Sorry, we need Gallery permissions to make this work!');
        }
      }


    _pickGalleryImage = async () => {
        var that = this;
        try{

            ImagePicker.openPicker({
                mediaType : 'photo',
                cropping : true
            }).then(res => {
                if(!res.path){
                    alert("Your Image is Not selected ! Try Again");
                    that.setState({
                        modal : false
                    })
                }else{
                    that.setState({
                        imageid : that.uniqueid(),
                        ProfilePhoto : res.path,
                        modal : false
                    })
                    that.props.navigation.navigate({routeName : 'SignUP',params : {PP : that.state.ProfilePhoto, imgid : that.state.imageid}})
                }
            }).catch(e => {
                that.setState({
                    modal : false
                });
                console.log(e);
                alert("Your Image is Not selected ! Try Again");
            })

    }catch (error){
        console.log(error)
    }
    }

    _TakePhoto = async () => {
        var that = this;
        try{
        ImagePicker.openCamera({
            cropping : true
        }).then(res => {
            if(!res.path){
                alert("Your Image is Not selected ! Try Again");
                that.setState({
                    modal : false
                })
            }else{
                that.setState({
                    imageid : that.uniqueid(),
                    ProfilePhoto : res.path,
                    modal : false
                })
                that.props.navigation.navigate({routeName : 'SignUP',params : {PP : that.state.ProfilePhoto, imgid : that.state.imageid}})
            }
        }).catch(e => {
            that.setState({
                modal : false
            });
            console.log(e);
            alert("Your Image is Not selected ! Try Again");
        })
    }catch (error){
        console.log(error)
    }
}

    render(){

        const Welcome=()=>{
            this.props.navigation.navigate('Welcome')
        }

        return(
            <View style = {{flex : 1,backgroundColor : 'white'}}>
                <View style={styles.ImageBackground}>
                    <Ionicons style={styles.icon} name="md-arrow-back" size={hp('4%')} color="white" onPress={Welcome} />
                    <SimpleLineIcons name="camera" size={hp('8%')} color="white" style = {{alignSelf : 'center',marginTop : hp('5%')}}/>
                </View>

                <View style = {{marginTop : -hp('10%'),backgroundColor : 'white',borderTopLeftRadius : wp('15%')}}>
                <View style={styles.profile}>
                    <Image source={{uri:'https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1.jpg'}} style={styles.image}/> 
                </View>
                <View style={{alignItems:'center'}}>
                    <TouchableNativeFeedback onPress = {()=> {this.setState({modal:true})}}> 
                        <Card style={styles.button}>
                            <Text style={styles.buttontext}>Add Profile-Photo</Text>
                        </Card>
                    </TouchableNativeFeedback>
                </View>
                </View>
                <Modal
                    animationIn='fadeIn'
                    isVisible={this.state.modal}
                    onBackButtonPress = {()=> {
                        this.setState({
                            modal:false
                        })
                    }}
                    onBackdropPress = {()=> {
                        this.setState({
                            modal:false
                        })
                    }}
                >                        
                    <View style={styles.Modal}>
                        <View style={styles.option}>
                            <TouchableOpacity activeOpacity = {0.8} onPress = {this._pickGalleryImage}>
                                <View style={styles.iconCon}>
                                    <ImageBackground source = {require('../assets/gallery.png')} style={styles.icon2} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity = {0.8} onPress = {this._TakePhoto}>
                                <View style={styles.iconCon}>
                                    <ImageBackground source = {require('../assets/camera.png')} style={styles.icon2} />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{...styles.option,...{marginTop : hp('1.5%')}}}>
                            <Text style={styles.optiontitle}>Gallery</Text>
                            <Text style={styles.optiontitle}>Camera</Text>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ImageBackground:{
        height:hp('40%'),
        width:wp('100%'),
        backgroundColor: '#154293',
    },
    title:{
        color:'white',
        fontSize:38,
        fontWeight:'bold',
        marginLeft:30,
        marginTop:wp('7%')
    },
    icon:{
        marginLeft:wp('5%'),
        marginTop:wp('8%')
    },
    button:{
        alignItems:'center',
        height:hp('10%'),
        width:wp('60%'),
        marginTop:hp('5%'),
        backgroundColor:'#154293',
        borderRadius:wp('10%'),
        elevation : 20
    },
    buttontext:{
        color:'white',
        fontSize:hp('2.5%'),
        marginTop : hp('2.5%')
    },
    image:{
        width:hp('20%'),
        height:hp('20%'),
        borderRadius:hp('20%'),  
    },
    profile:{
        marginTop:hp('12%'),
        alignItems:'center'
    },
    Modal : {
        backgroundColor:'white',
        borderRadius:wp('5%'),
        overflow:'hidden',
        marginHorizontal:wp('8%'),
        height : hp('30%')
    },
    option : {
        flexDirection:'row',
        justifyContent:'space-around',
        marginTop : hp('4%')
    },
    iconCon:{
        width: hp('12%'),
        height: hp('12%'),
        borderRadius: hp('12%')/2,
        backgroundColor: '#6aa7f9',
        marginTop:Dimensions.get('screen').width<400?hp('2%'):hp('1%'),
        overflow:'hidden',
        borderWidth:1,
        alignItems : 'center',
        justifyContent : 'center'
    },
    icon2:{
        width:hp('7%'),
        height:hp('7%'),
        resizeMode : 'contain'
    },
    optiontitle : {
        fontSize : hp('2.5%'),
        fontWeight:'bold',
        color : '#154293'
    }
})