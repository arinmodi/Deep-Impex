import React from 'react';
import { View, Text, StyleSheet,Dimensions,Image,SafeAreaView, BackHandler,Alert, TouchableOpacity } from 'react-native';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import HomeApp from '../Home Screens/Navigtor';
import { f, database } from '../config/config';
import { AntDesign, MaterialCommunityIcons } from '../Icons/icons';
import Load from '../Component/loaddata';

export default class Home extends React.Component {

    constructor(){
        super();
        this.state = {
            ProfileImage : '',
            PersonName : '',
            loading : true
        }
    }

    fetch_Person_Details = () => {
        const user = f.auth().currentUser.uid;
        var that = this;
        database.ref('Accepted_Employee').child(user).once('value').then(
            function(snapshot){
                that.setState({
                    ProfileImage : snapshot.val().ProfileImage,
                    PersonName : snapshot.val().UserName,
                    loading : false
                })
                global.PersonName = that.state.PersonName;
                global.image = that.state.ProfileImage;
            }
        )
    }

    componentDidMount = () => {
        this.fetch_Person_Details();
        this.back = BackHandler.addEventListener("hardwareBackPress",this.backAction);
        //BackHandler.removeEventListener(this.backAction);
    }

    componentWillUnmount = () => {
        this.back.remove();
    }

    backAction = () => {
        if(this.props.navigation.isFocused()){
            Alert.alert("Hold on!", "Are you sure you want to close the App?", [
                {
                  text: "Cancel",
                  onPress: () => null,
                  style: "cancel"
                },
                { text: "YES", onPress: () => BackHandler.exitApp() }
              ]);
              return true;
        }
    };
    
    render(){
        if(this.state.loading === false){
            return (
                <View  style={{flex:1,backgroundColor:'#154293'}}>
                    <View style={{flexDirection:'row',marginTop:hp('2.5%'),marginBottom : hp('2%')}}>
                        <TouchableOpacity onPress = {() => this.props.navigation.toggleDrawer()} activeOpacity = {0.8} style = {{height : hp('4%'),width : wp('15%')}}>
                            <AntDesign name="menuunfold" size={hp('4%')} color="white" style={{marginLeft : wp('5%')}} />
                        </TouchableOpacity>
                        <View style = {{flex : 1,alignItems : 'center'}}>
                            <Text style={styles.Name}>Home</Text>
                        </View>
                    </View>
            
                    <View style={{flex:1}}>
                        <HomeApp />
                    </View>
                </View>
            )
        }else {
            return(
                <View style = {{flex : 1}}>
                    <View style = {{alignItems:'center',backgroundColor:'#154293',height : hp('10%')}}>

                    </View>

                    <Load 
                        style = {{flex : 1}}
                    />
                </View>
            )
        }
    }
  
  }

const styles = StyleSheet.create({
    image:{
        width:Dimensions.get('screen').width<400?wp('15%'):wp('14%'),
        height:hp('8%'),
        borderRadius:Dimensions.get('screen').width<400?wp('18%')/2:wp('16%')/2, 
        borderWidth:1,
        borderColor:'black', 
        marginHorizontal:wp('5%')
    },
    profile:{
        alignItems:'center',
        flexDirection:'row',
    },
    Name : {
        fontSize:hp('2.5%'),
        color:'white',
        marginTop : hp('0.5%'),
        marginLeft : -wp('15%')
    },
    Order : {
        marginTop:hp('2%'),
        marginHorizontal:wp('5%'),
        height:hp('20%'),
        borderRadius:wp('5%'),
        backgroundColor:'#05F9DC',
        elevation:15,
    },
    OrderText:{
        fontSize:hp('3%'),
        fontWeight:'bold',
        color:'blue',
        marginHorizontal:wp('5%'),
        marginVertical:hp('2%')
    },
    OrderText2:{
        fontSize:hp('3%'),
        fontWeight:'bold',
        color:'black',
        marginHorizontal:wp('1%'),
        marginVertical:hp('2%')
    }
})