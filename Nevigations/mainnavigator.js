import { createAppContainer } from 'react-navigation';
import {  createStackNavigator, TransitionPresets } from 'react-navigation-stack';
import App from './MainNavigation';
import Authenticate from './Authentication_Navigation';
import Loading from '../LoadingScreen';
import Wait from '../AuthenticationScreens/WaitingScreen';
import Admin from './Admin_Navigator';

const Navigator = createStackNavigator({

    Load : { screen : Loading,navigationOptions : {
      ...TransitionPresets.ModalTransition
    }},

    Main: App,
    
    Auth: {
      screen: Authenticate,
    },
    Wait : {screen : Wait, navigationOptions : {
      ...TransitionPresets.ScaleFromCenterAndroid
    }},
    Admin : Admin
    },{
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false
      }
  });

  export default createAppContainer(Navigator);