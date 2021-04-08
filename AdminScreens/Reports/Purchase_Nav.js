import { Dimensions } from 'react-native'
import { createAppContainer } from 'react-navigation';
import {  createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
//Screens
import Purchase_Report from './Date_Purchase';
import Person_Purchase_Report from './Person_Purchase';
import Render from './pdf-reader';

const TabScreens= {
  Total:{
    screen:Purchase_Report, 
  },
  Person: {
    screen:Person_Purchase_Report,
  },
}

const Tab = createMaterialTopTabNavigator(
  TabScreens,  
  {
    tabBarOptions:{
      activeTintColor:'blue',
      inactiveTintColor:'#99accf',
      indicatorStyle : {
        width : 0
      },
    
      contentContainerStyle : {
          alignItems : 'center'
      },

      style:{
        height:hp('5%'),
        backgroundColor:'white',
        overflow:'hidden',
        marginHorizontal : wp('15%'),
        marginVertical : hp('2%'),
        borderRadius : wp('5%'),
      },
      labelStyle:{
        fontSize:hp('1.5%'),
        fontWeight:'bold',
      }
    },
    
  },
  {}
)

const P_Reports = createStackNavigator({
    screen : Tab,
    View : Render
},
{
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false
    }
})

export default createAppContainer(P_Reports);
