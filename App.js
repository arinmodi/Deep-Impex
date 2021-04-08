import React from 'react';
import { View } from 'react-native';
import Navigator from './Nevigations/mainnavigator';
import AppLoading from 'expo-app-loading'
import { Asset } from 'expo-asset';
import { Provider } from 'react-redux';
import { LogBox,StatusBar } from 'react-native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducer  from './App-Store/Reducers/User_Request';
import Userreducer from './App-Store/Reducers/Users';
import Newsreducer from './App-Store/Reducers/News';
import Basket_reducer from './App-Store/Reducers/Basket_And_Items';
import Reports_reducer from './App-Store/Reducers/Reports';
import Chat_reducer from "./App-Store/Reducers/Chats";
import Order_status_reducer from './App-Store/Reducers/Order_Emp_Data';
import RNOtpVerify from 'react-native-otp-verify';
import Reg from './AuthenticationScreens/Register';
import Otp from './AuthenticationScreens/OTPVerification';
import SplashScreen from 'react-native-splash-screen';
import Preview from './AdminScreens/Place_Order_Screens/PreviewItems';

function cacheImages(images) {
  return images.map(image => {
    if(typeof image === 'string') {
      return Image.prefetch(image);
    }else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}


export default class App extends React.Component {

  constructor()
  {
    super();
    LogBox.ignoreAllLogs;
    this.state = {
      load : true
    }
  }

  async _loadAssetsAsync() {
    const imageAssets = cacheImages([
      require('./assets/Splash_Image.png'),
      require('./assets/Theme2.png'),
      require('./assets/Splash_Design_Icon.png'),
      require('./assets/side-bar-style.jpg'),
      require('./assets/pending.png'),
      require('./assets/OrderList.png'),
      require('./assets/No_Purchased_Item.png'),
      require('./assets/No_Pending_Item.png'),
      require('./assets/no_order.png'),
      require('./assets/minus.png'),
      require('./assets/Image2.png'),
      require('./assets/gallery.png'),
      require('./assets/camera.png'),
      require('./assets/basket2.png'),
      require("./assets/Loader.gif"),
      require("./assets/Other.png"),
      require("./assets/vegetable.png"),
      require("./assets/fruits.png")
    ]);
    
    await Promise.all([...imageAssets ]);
  }

  getHash = () => {
    RNOtpVerify.getHash()
        .then((hash) => {
            console.log('App.js: Application hash is=> ', hash);
        })
        .catch((error) => {
            console.log(error);
        });
  } ;

  componentDidMount = () => {
    SplashScreen.hide();
    StatusBar.setBackgroundColor("#154293");
    this.getHash();
  }

  render(){

    const Mainreducer=combineReducers({
      Emp_Request : reducer,
      Basket : Basket_reducer,
      Users : Userreducer,
      Reports : Reports_reducer,
      News : Newsreducer,
      Chats : Chat_reducer,
      Order_status_reducer : Order_status_reducer
    });

    const store = createStore(Mainreducer, applyMiddleware(thunkMiddleware));

    if(this.state.load === true){
      return <AppLoading startAsync = {this._loadAssetsAsync} onFinish = {() => this.setState({load : false})} onError = {(e) => console.log(e)}/>
    }else{
      return(
        <Provider store={store}>
          <Navigator ref={(x) => (global.stackNavigator = x)}/>
      </Provider>
      
      )
    }
  }

}
