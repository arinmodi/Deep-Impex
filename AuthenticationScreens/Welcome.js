import React, { useEffect } from 'react';
import { View,Text,ImageBackground,TouchableNativeFeedback,StyleSheet,Dimensions,TouchableOpacity, BackHandler, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card } from 'react-native-paper';
import RNRestart from 'react-native-restart'; 
import { NavigationEvents } from 'react-navigation';

function Welcome(props){

    const Login=()=>{
        props.navigation.navigate('login')
    }

    const Register=()=>{
        props.navigation.navigate('PP')
    }

    useEffect(() => {
        const backAction = () => {
          Alert.alert("Hold on!", "Are you sure you want to close the App?", [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel"
            },
            { text: "YES", onPress: () => BackHandler.exitApp() }
          ]);
          return true;
        };
    
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          backAction
        );
    
        return () => backHandler.remove();
      }, []);

      const reloadapp = () => {
        props.navigation.setParams({ Restart : false });
        RNRestart.Restart();
      }

    return(
        <View>
            <NavigationEvents onDidFocus = {() => props.navigation.getParam('Restart') === true ? (reloadapp()) : console.log('Not update')}/>
            <ImageBackground source={require('../assets/Image2.png')} style={styles.ImageBackground}>
                <Text style={styles.title}>Welcome!</Text>
                <View>
                    <TouchableNativeFeedback onPress={Login}>
                        <Card style={styles.button}>
                            <Text style={styles.buttontext}>Log In</Text>
                        </Card>
                    </TouchableNativeFeedback>
                </View> 
            </ImageBackground>
            <View style = {{marginTop : hp('3%')}}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{...styles.text2,...{marginLeft:wp('8%'),
                        color:'#062A04',fontSize:hp('2%')}}}
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
    )
}

const styles = StyleSheet.create({
    ImageBackground:{
        height:hp('90%'),
        width:wp('100%')
    },
    title:{
        color:'white',
        fontSize:hp('5%'),
        marginLeft:wp('5%'),
        marginTop:hp('10%')
    },
    text2:{
        color:'white',
        fontSize:hp('2%'),
        marginLeft:wp('6%'),
        marginTop:-hp('1%')
    },
    button:{
        height:hp('7%'),
        width:wp('40%'),
        marginVertical:hp('5%'),
        alignItems:'center',
        backgroundColor: '#6dabf6',
        borderRadius:wp('5%'),
        marginLeft:wp('5%'),
        justifyContent : 'center',
        elevation : 20
    },
    buttontext:{
        color:'black',
        fontSize:hp('3%'),
        marginTop : hp('1%')
    },
})

export default Welcome;