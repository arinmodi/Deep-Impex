import { Dimensions } from 'react-native'
import { createAppContainer } from 'react-navigation';
import {  createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
//Screens
import Purchase_Report_Home from './Purchase_Screen';
import P_Credit from './Person_Credit_Report';
import T_Credit from './Total_Credit';
import Render from './pdf-reader';

const TabScreens= {
  Purchase:{
    screen:Purchase_Report_Home, 
  },
  Credit: {
    screen:T_Credit,
  },
  Person : {
      screen : P_Credit
  }
}

const Tab = createMaterialTopTabNavigator(
  TabScreens,  
  {
    tabBarOptions:{
      activeTintColor:'white',
      inactiveTintColor:'#99accf',

      contentContainerStyle : {
        alignItems : 'center'
      },
    
      style:{
        height:hp('6%'),
        backgroundColor:'#154293',
        overflow:'hidden',
      },
      labelStyle:{
        fontSize:hp('1.75%'),
        fontWeight:'bold'
      }
    },
    
  },
  {}
)

const Report = createStackNavigator({
    screen : Tab,
    View : Render
},
{
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false
    }
})

export default createAppContainer(Report);
