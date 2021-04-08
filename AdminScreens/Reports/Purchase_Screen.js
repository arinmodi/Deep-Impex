import React from 'react';
import { View, SafeAreaView } from 'react-native';
import P_Reports from './Purchase_Nav';

export default class Purchase_Report_Home extends React.Component {

    constructor()
    {
      super();
    }
    
    render(){
  
      return (
          
        <SafeAreaView  style={{flex:1}}>
            <View style={{flex:1}}>
                <P_Reports />
            </View>
        </SafeAreaView>
      )
    }
  
  }