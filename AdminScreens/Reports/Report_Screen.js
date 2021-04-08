import React from 'react';
import { View, SafeAreaView, Text } from 'react-native';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import Report from './Navigator';
import { Feather } from '../../Icons/icons';
import {styles} from '../Component/styles';
import Header from '../../Component/Header';

export default class Reports extends React.Component {

    constructor()
    {
      super();
    }
    
    render(){
  
      return (
          
        <SafeAreaView  style={{flex:1,backgroundColor:'#154293'}}>
            <View style={{flex:1}}>
              <Header 
                  Name = {'Reports'}
                  onPress = {() => this.props.navigation.toggleDrawer()}
              />
              <Report />
            </View>
        </SafeAreaView>
      )
    }
  
  }