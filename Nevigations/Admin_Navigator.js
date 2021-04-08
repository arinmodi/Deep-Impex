import { createAppContainer } from 'react-navigation';
import {  createStackNavigator, TransitionPresets } from 'react-navigation-stack';
import Admin_Home from '../AdminScreens/HomeScreens/Screen';
import Manual_Upload from '../AdminScreens/Place_Order_Screens/Manual_Upload';
import BasketItem from '../AdminScreens/Place_Order_Screens/BasketItem';
import Baskets from '../AdminScreens/Place_Order_Screens/Baskets';
import Items from '../AdminScreens/Place_Order_Screens/Copy_Items';
import Additem from '../AdminScreens/Place_Order_Screens/ADDItem';
import CatItems from '../AdminScreens/Place_Order_Screens/CategoryItem';
import Edititem from '../AdminScreens/Place_Order_Screens/EditItem';
import fav from '../AdminScreens/Place_Order_Screens/fav';
import Other from '../AdminScreens/Place_Order_Screens/other';
import View_Product from '../Purchase Screens/View_Product';
import Users from '../AdminScreens/User Management/Users';
import Reports from '../AdminScreens/Reports/Report_Screen';
import Person_Details from '../AdminScreens/Place_Order_Screens/Person_Details';
import News from '../AdminScreens/News/News';
import News_Upload from '../AdminScreens/News/Upload_News';
import News_Edit from '../AdminScreens/News/Edit_News';
import Pending from '../AdminScreens/Pending Items/Items';
import Basketlist from '../AdminScreens/Pending Items/Basketslist';
import Add_Pending_item from '../AdminScreens/Pending Items/ADD_Item';
import Chat from '../Component/Chat';
import Logout from '../AdminScreens/Comman/Logout';
import { styles } from './MainNavigation';
import { createDrawerNavigator, DrawerItems,   } from 'react-navigation-drawer';
import { FontAwesome, FontAwesome5, MaterialCommunityIcons, AntDesign } from '../Icons/icons';
import { Entypo } from '../Icons/icons';
import {
  widthPercentageToDP as wp, 
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import React from 'react';
import { Text, View, Image, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import Status from '../AdminScreens/Place_Order_Screens/Status';
import File_Selection from '../AdminScreens/Place_Order_Screens/File_Selection';
import Preview from '../AdminScreens/Place_Order_Screens/PreviewItems';
import Rem from '../AdminScreens/Place_Order_Screens/Remaing_Items';

const Place_Order_Screens = createStackNavigator({
  order : Manual_Upload,
  Baskets : Baskets,
  BasketItems : BasketItem,
  Items : Items,
  Additem : Additem,
  Category_Items : CatItems,
  Edit : Edititem,
  fav : fav,
  View : View_Product,
  P_D : Person_Details,
  other : Other,
  File : File_Selection,
  Preview : Preview,
  Remaing_Items : Rem
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

const Admin_Requests_Screens = createStackNavigator({
    Requests : Admin_Home,
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
);

const Admin_Report_Screen = createStackNavigator({
  Main : Reports,
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

);

const NewsScreens = createStackNavigator({
  Main : News,
  Items : Items,
  Category_Items : CatItems,
  News_Upload : News_Upload,
  News_Edit : News_Edit,
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

);

const PendingScreens = createStackNavigator({
  Main : Pending,
  List : Basketlist,
  ADD : Add_Pending_item

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

);

export const CustomDrawerNavigation = (props) => {
  const height = hp('10%');
  return (
    <View style={{ flex: 1 }}>

        <View style = {{backgroundColor : '#1f3a76',overflow : 'hidden',width : wp('70%'),height : height,alignItems : 'center',justifyContent : 'center' }}>
          <Text style = {{color : 'white', fontSize : hp('3%'),fontWeight : 'bold',fontStyle : 'italic'}}>DEEP IMPEX</Text>
        </View>

        <View style = {{flex:1}}>
            <ScrollView style = {{marginTop : hp('2%')}} {...props} >
              
              <View style = {style.section}>

                <View style = {{...style.header,...{marginTop : hp('2%')}}}>
                    <Text style = {style.text}>User</Text>
                </View>

                <View style = {{width : wp('70%'),marginLeft : wp('5%')}}>
                  <TouchableOpacity style = {{flexDirection : 'row'}} onPress={() => props.navigation.navigate('Users')} activeOpacity = {0.8}>
                    <FontAwesome5 name="users-cog" size={hp('3%')} color={'#1f3a76'} style = {style.icon}/>
                    <Text style={{...style.item,...{}}}>Users</Text>
                  </TouchableOpacity>
                </View>

                <View style = {{width : wp('70%'),marginLeft : wp('5%'),marginTop : hp('5%')}}>
                  <TouchableOpacity style = {{flexDirection : 'row'}} onPress={() => props.navigation.navigate('Requests')} activeOpacity = {0.8}>
                    <FontAwesome name="user-plus" size={hp('3%')} color={'#1f3a76'} style = {style.icon}/>
                    <Text style={style.item}>Requests</Text>
                  </TouchableOpacity>
                </View>

              </View>

              <View style = {{...style.section,...{marginTop : hp('2%')}}}>

                <View style = {style.header}>
                    <Text style = {style.text}>Order</Text>
                </View>

                <View style = {{width : wp('70%'),marginLeft : wp('5%')}}>
                  <TouchableOpacity style = {{flexDirection : 'row'}} onPress={() => props.navigation.navigate('Status')} activeOpacity = {0.8}>
                    <Entypo name="stopwatch" size={hp('3%')} color={'#1f3a76'} style = {style.icon}/>
                    <Text style={style.item}>Status</Text>
                  </TouchableOpacity>
                </View>

                <View style = {{width : wp('70%'),marginLeft : wp('5%'),marginTop : hp('5%')}}>
                  <TouchableOpacity style = {{flexDirection : 'row'}} onPress={() => props.navigation.navigate('Orders')} activeOpacity = {0.8}>
                    <Entypo name="shopping-cart" size={hp('3%')} color={'#1f3a76'} style = {style.icon}/>
                    <Text style={style.item}>Orders</Text>
                  </TouchableOpacity>
                </View>

                <View style = {{width : wp('70%'),marginLeft : wp('5%'),marginTop : hp('5%')}}>
                  <TouchableOpacity style = {{flexDirection : 'row'}} onPress={() => props.navigation.navigate('Pending')} activeOpacity = {0.8}>
                    <MaterialCommunityIcons name="calendar-clock" size={hp('3%')} color="#1f3a76" style = {style.icon}/>
                    <Text style={style.item}>Pending</Text>
                  </TouchableOpacity>
                </View>


                <View style = {{width : wp('70%'),marginLeft : wp('5%'),marginTop : hp('5%')}}>
                  <TouchableOpacity style = {{flexDirection : 'row'}} onPress={() => props.navigation.navigate('Reports')} activeOpacity = {0.8}>
                    <Entypo name="bar-graph" size={hp('3%')} color={'#1f3a76'} style = {style.icon}/>
                    <Text style={style.item}>Reports</Text>
                  </TouchableOpacity>
                </View>

              </View>

              <View style = {{...style.section,...{marginTop : hp('2%')}}}>

                <View style = {style.header}>
                    <Text style = {style.text}>General</Text>
                </View>

                <View style = {{width : wp('70%'),marginLeft : wp('5%')}}>
                  <TouchableOpacity style = {{flexDirection : 'row'}} onPress={() => props.navigation.navigate('News')} activeOpacity = {0.8}>
                    <FontAwesome name="newspaper-o" size={hp('3%')} color="#1f3a76" style = {style.icon}/>
                    <Text style={style.item}>News</Text>
                  </TouchableOpacity>
                </View>

                <View style = {{width : wp('70%'),marginLeft : wp('5%'),marginTop : hp('5%')}}>
                  <TouchableOpacity style = {{flexDirection : 'row'}} onPress={() => props.navigation.navigate('Chat')} activeOpacity = {0.8}>
                    <AntDesign name="message1" size={hp('3%')} color="#1f3a76" style = {style.icon}/>
                    <Text style={style.item}>Chat</Text>
                  </TouchableOpacity>
                </View>


                <View style = {{width : wp('70%'),marginLeft : wp('5%'),marginTop : hp('5%')}}>
                  <TouchableOpacity style = {{flexDirection : 'row'}} onPress={() => props.navigation.navigate('Logout')} activeOpacity = {0.8}>
                    <AntDesign name="user" size={hp('3%')} color="#1f3a76" style = {style.icon}/>
                    <Text style={style.item}>Profile</Text>
                  </TouchableOpacity>
                </View>

              </View>


            </ScrollView>
          </View>
        </View>
  );
}

const App = createDrawerNavigator({
  Users: {
    screen: Users,
  },

  Requests: {
    screen: Admin_Requests_Screens,
  },

  Status : {
    screen : Status
  },

  Orders: {
    screen: Place_Order_Screens,
  },

  Reports: {
    screen: Admin_Report_Screen,
  },

  News: {
    screen: NewsScreens,
  },

  Pending: {
    screen: PendingScreens,
  },

  Chat : {
    screen: Chat,
  },

  Logout : {
    screen: Logout,
  }

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
    activeTintColor : 'blue',
    itemsContainerStyle: {
      marginTop: hp('2%'),
      width : wp('70%'),

    },
    iconContainerStyle: {
      width : wp('10%'),
      //opacity : 1
    },
    labelStyle:{
      fontSize:hp('2.5%'),
      fontWeight : '700',
      marginLeft : wp('1.5%')
    },
    style : {
      height : hp('4%'),
    },
  },
  drawerType : 'slide',
  
});

const Admin = createStackNavigator({
  screen : App
},
{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: true
  }
})

const style = StyleSheet.create({
  item : {
    fontSize:hp('2.5%'),
    fontWeight : '700',
    marginLeft : wp('1.5%'),
    color : 'black'
  },
  icon : {
    width : wp('10%'),
  },
  section : {
    borderBottomWidth : 1,
    paddingBottom : hp('3%'),
    borderBottomColor : '#86878B'
  },
  header : {
    marginBottom : hp('4%')
  },
  text : {
    marginLeft : wp('5%'),
    fontSize : hp('2.5%'),
    color : '#86878B',
  }
})


export default createAppContainer(Admin);