import React from 'react';
import { Text, View, Image, StyleSheet, ScrollView, Easing } from 'react-native';
import { createAppContainer } from 'react-navigation';
import {  createStackNavigator, CardStyleInterpolators, TransitionPresets } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { DrawerItems, createDrawerNavigator } from 'react-navigation-drawer';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
//icons
import { AntDesign } from '../Icons/icons';
import { FontAwesome } from '../Icons/icons';
import { Entypo } from '../Icons/icons';
//Home Screens
import Home from '../Screens/Home';
//Purchase Screens
import Purchase from '../Screens/Purchase';
import BasketItem from '../Purchase Screens/BasketItems';
import Pending from '../Purchase Screens/Pending_Items';
import Purchased_Items from '../Purchase Screens/Purchased_Items';
import AddItem from '../Purchase Screens/ADD_Item';
import Purchase_Product from '../Purchase Screens/Purchase_Product';
import Edit_product from '../Purchase Screens/Edit_Product';
import Items from '../AdminScreens/Place_Order_Screens/Copy_Items';
import CatItems from '../AdminScreens/Place_Order_Screens/CategoryItem';
import View_Product from '../Purchase Screens/View_Product';
import Other from '../AdminScreens/Place_Order_Screens/other';
//History Screens
import History from '../Screens/History';
import Analytics from '../User_HistoryScreens/Analytics';
//User Screens
import Credits from '../User Screens/Credit';
import Credits_Analytics from '../User Screens/CreditAnalytics';
import Transfer from '../User Screens/Transfer';
import Pay from '../User Screens/Pay';
import Person_Credits from '../User Screens/onepersonnamecredit';
//Upcoming Orders
import Future_Orders from '../Upcoming_Orders/Future_Orders';
import Future_Items from '../Upcoming_Orders/Future_Items';
//chat
import Chat from '../Component/Chat';
//profile
import Profile from '../Screens/Profile';


const PurchaseScreens = createStackNavigator({

  Main:Purchase,
  Basket:BasketItem,
  Edit : Edit_product,
  Pending : Pending,
  Purchased : Purchased_Items,
  Items : Items,
  Additem : AddItem,
  Category_Items : CatItems,
  Buy : Purchase_Product,
  View : View_Product,
  other : Other

  },
  {   
    headerMode: 'none',
    mode:'modal',
    navigationOptions: {
      headerVisible: false,
    },
    defaultNavigationOptions : {
      ...TransitionPresets.SlideFromRightIOS
    }
  }
)

const HistoryScreens = createStackNavigator({
    Main:History,
    Analytics : Analytics,
  },
  {   
    headerMode: 'none',
    mode:'modal',
    navigationOptions: {
      headerVisible: false,
    },
    defaultNavigationOptions : {
      ...TransitionPresets.SlideFromRightIOS
    }
  }
)

const TabScreens= {
  Home:{
    screen:Home, 
    navigationOptions:({ navigation})=> ({
        tabBarIcon:({tintColor})=>{
            return (
              <AntDesign name="home" size={hp('4%')} color={tintColor} />
            );
          }
        })
    },
  Purchase : {
    screen:PurchaseScreens,
    navigationOptions:{
        tabBarIcon:({tintColor})=>{
            return(
              <FontAwesome name="shopping-basket" size={hp('4%')} color={tintColor} />
            );
        }
    }
  },
  History : {
    screen:HistoryScreens,
    navigationOptions:({ navigation }) => ({
        tabBarIcon:({tintColor})=>{
            return(
              <FontAwesome name="history" size={hp('4%')} color={tintColor} />
            );
        }
    })
  },

  Profile : {
    screen:Profile,
    navigationOptions:({ navigation }) => ({
        tabBarIcon:({tintColor})=>{
            return(
              <FontAwesome name="user-circle" size={hp('4%')} color={tintColor} />
            );
        }
    })
  },
}

const Tab = createBottomTabNavigator(
  TabScreens,  
  {
    tabBarOptions:{
      activeTintColor:'white',
      inactiveTintColor:'black',
      activeBackgroundColor:'#154293',
    
      style:{
        height:hp('8%'),
        elevation:24,
        overflow:'hidden'
      }
    },
    
  },
  {}
)

export const CustomDrawerNavigation = (props) => {
  const ar = 502 / 800;
  const height = ar * wp('70%');
  return (
    <View style={{ flex: 1 }}>

        <View style = {{backgroundColor : 'white',overflow : 'hidden',width : wp('70%'),height : height }}>
          <Image source = {require('../assets/side-bar-style.jpg')} style = {{width : wp('70%'),height : height,borderBottomRightRadius : wp('20%')}}/>
        </View>

        <View style = {{flex:0.8}}>
          <View style= {{flex : 1, backgroundColor : '#121013'}} />
          <View style = {{position : 'absolute', top : 0, left : 0, right : 0, bottom : 0,backgroundColor : 'white',borderTopLeftRadius : wp('20%')}}>
            <ScrollView>
              <DrawerItems {...props} />
            </ScrollView>
          </View>
        </View>

        <View style = {{flex:0.1}}>
          <View style= {{flex : 1, backgroundColor : '#1f3a76'}} />
          <View style = {{position : 'absolute', top : 0, left : 0, right : 0, bottom : 0,backgroundColor : 'white',borderBottomRightRadius : wp('20%')}}>

          </View>
        </View>

        <View style = {{flex : 0.2, backgroundColor : 'white'}}>
          <View style = {{position : 'absolute', top : 0, left : 0, right : 0, bottom : 0, borderTopLeftRadius : hp('20%'),backgroundColor : '#1f3a76',justifyContent : 'center',alignItems : 'center'}}>
              <Text style = {{color : 'white', fontSize : hp('3%'),fontWeight : 'bold'}}>DEEP IMPEX</Text>
          </View>
        </View>
    </View>
  );
}

const Balance_transfer = createStackNavigator({
  Transfer : Transfer,
  Pay : Pay
},  { 
  headerMode: 'none',
  mode:'modal',
  navigationOptions: {
    headerVisible: false,
  },
  defaultNavigationOptions : {
    ...TransitionPresets.SlideFromRightIOS
    
  }
})

const credits = createStackNavigator({
  MainC : Credits,
  Credit_Ana : Credits_Analytics,
  P_Credit : Person_Credits
  },  { 
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  },
  defaultNavigationOptions : {
    ...TransitionPresets.SlideFromRightIOS
    
  }
},
)

const Upcoming_Orders = createStackNavigator({
  Main : Future_Orders,
  Items : Future_Items
},
{ 
  headerMode: 'none',
  mode:'modal',
  navigationOptions: {
    headerVisible: false,
  },
  defaultNavigationOptions : {
    ...TransitionPresets.SlideFromRightIOS
    
  }

})

const Drawer = createDrawerNavigator({
  Home: {
    screen: Tab,
    navigationOptions: {
      title: 'Home',
      drawerIcon: ({ tintColor }) => (
        <View style = {styles.icon}>
          <AntDesign name="home" size={hp('4%')} color={'white'} />
        </View>
      ),
    }
  },
  Upcoming: {
    screen: Upcoming_Orders,
    navigationOptions: {
      title: 'Orders',
      drawerIcon: ({ tintColor }) => (
        <View style = {{...styles.icon, ...{backgroundColor : '#FF5733'}}} >
          <FontAwesome name="calendar" size={hp('4%')} color={'white'} />
        </View>
      ),
    }
  },
  Credit: {
    screen: credits,
    navigationOptions: {
      title: 'Credits',
      drawerIcon: ({ tintColor }) => (
        <View style = {{...styles.icon, ...{backgroundColor : '#F1DD12'}}}>
          <FontAwesome name="rupee" size={hp('4%')} color={'white'} />
        </View>
      ),

    }
  },
  Transfer: {
    screen: Balance_transfer,
    navigationOptions: {
      title: 'Transfer',
      drawerIcon: ({ tintColor }) => (
        <View>
          <Image source = {require('../assets/Balnce-transfer.png')} style = {{height : hp('6%'), width : hp('6%'), borderRadius : hp('6%') / 2 }}/>
        </View>
      ),
    },
  },
  Chat : {
    screen:Chat,
    navigationOptions:{
        title: 'Chat',
        drawerIcon: ({ tintColor }) => (
        <View style = {{...styles.icon, ...{backgroundColor : 'black'}}}>
          <Entypo name="chat" size={hp('4%')} color={'white'} />
        </View>
        ),
    }
  },
},
  {
    drawerPosition: 'left',
    contentComponent: CustomDrawerNavigation,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    drawerWidth: wp('70%'),
    contentOptions:{
      activeBackgroundColor : '#00000000',
      activeTintColor : 'black',
      itemsContainerStyle: {
        marginTop: hp('5%'),
        marginLeft : wp('3%')
      },
      iconContainerStyle: {
        width : wp('10%')
      },
      labelStyle:{
        fontSize:hp('3%'),
        fontWeight : '300',
        marginLeft : wp('1.5%')
      },
      style : {
        height : hp('4%'),
      }
    },
    drawerType : 'slide'
  })

const App = createStackNavigator({
    screen : Drawer
},
{
    headerMode: 'none',
    navigationOptions: {
      headerVisible: true
    }
})

export const styles = StyleSheet.create({
  icon : {
    height : hp('6%'), 
    width : hp('6%'), 
    borderRadius : hp('6%') / 2, 
    backgroundColor : '#30E7DC',
    justifyContent : 'center',
    alignItems : 'center'
  }
})

export default createAppContainer(App);
