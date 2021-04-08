import React from 'react';
import { Dimensions } from 'react-native'
import { createAppContainer } from 'react-navigation';
import {  createStackNavigator, TransitionPresets } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
//Screens
import News from './News';
import PP from './PurchasePerson';
import UO from './UpcomingOrder';
import News_Purchase_Product from './News_Item_Purchase';


const TabScreens= {
  Orders:{
    screen:UO, 
  },
  SalesMan : {
    screen:PP,
    navigationOptions:{
        title : "Sales Man"
    }
  },
  News : {
    screen:News,

  }
}

const Tab = createMaterialTopTabNavigator(
  TabScreens,  
  {
    tabBarOptions:{
      activeTintColor:'white',
      inactiveTintColor:'#99accf',
    
      style:{
        height:Dimensions.get('screen').width<400?hp('8%'):hp('7%'),
        backgroundColor:'#154293',
        overflow:'hidden',
      },
      labelStyle:{
        fontSize:hp('1.8%'),
        marginTop : hp('1.5%')
      }
    },    
  },
  {}
)

const HomeApp = createStackNavigator({
    screen : Tab,
    News_Purchase : News_Purchase_Product
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false
    }
  })

export default createAppContainer(HomeApp);
