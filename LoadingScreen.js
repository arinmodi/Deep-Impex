import React from 'react';
import { LogBox,Text } from 'react-native';
import { f } from './config/config';
import { View, ImageBackground } from 'react-native';
import {
  widthPercentageToDP as wp, 
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

export default class Loading extends React.Component {

  constructor()
  {
    super();
    LogBox.ignoreAllLogs;
  }

  componentDidMount = async () => {

  var that = this;

  const unscribe = f.auth().onAuthStateChanged(
    function(user) {
        if (user) {
            if(user.phoneNumber === '+919974699330' || user.phoneNumber === '+917228996440'){
              that.props.navigation.navigate('Admin')
            }else {
              that.props.navigation.navigate('Wait')
            }
        }else {
          that.props.navigation.navigate('Auth')
        }

        unscribe();
    },
  );

  }

  render(){
    return(
        <View style={{flex:1}}>
          <View style = {{height : hp('50%'),width : wp('100%'),alignItems : 'center',justifyContent : 'flex-end'}}>
            <ImageBackground style={{height : hp('10%'),width:hp('10%'),resizeMode : 'contain'}} source={require('./assets/Logo.png')}>
            
            </ImageBackground>
          </View>
          <Text style = {{textAlign : 'center',marginTop : hp('10%'),fontSize : hp('6%'),fontWeight : 'bold',color  : '#595a5a'}}>Deep</Text>
          <Text style = {{textAlign : 'center',marginTop : hp('0%'),fontSize : hp('6%'),fontWeight : 'bold',color  : '#39c6f4'}}>Impex</Text>
        </View>
    )
  }
}
