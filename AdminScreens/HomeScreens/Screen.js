import React from 'react';
import { View, SafeAreaView } from 'react-native';
import Admin_Home from './Navigator';
import Header from '../../Component/Header';

export default class AdminHome extends React.Component {

    constructor()
    {
      super();
    }
    
    render(){
  
      return (
          
        <SafeAreaView  style={{flex:1,backgroundColor:'#154293'}}>
            <View style={{flex:1}}>
                <Header 
                    Name = {'Requests'}
                    onPress = {() => this.props.navigation.toggleDrawer()}
                />
                <Admin_Home />
            </View>
        </SafeAreaView>
      )
    }
  
  }