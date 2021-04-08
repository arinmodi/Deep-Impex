import { createAppContainer } from 'react-navigation';
import {  createStackNavigator } from 'react-navigation-stack';
import Welcome from '../AuthenticationScreens/Welcome';
import Login from '../AuthenticationScreens/Login';
import ProfilePhoto from '../AuthenticationScreens/ProfilePhoto';
import Register from '../AuthenticationScreens/Register';
import OTP from '../AuthenticationScreens/OTPVerification';
import OTP_Login from '../AuthenticationScreens/OTPVerification_Login';
import Admin_Login from '../AuthenticationScreens/Admin_Login';

const AuthenticationScreens = createStackNavigator({

    Welcome:{screen : Welcome },
    login:Login,
    PP:ProfilePhoto,
    SignUP:Register,
    OTP:OTP,
    OTP_Login : OTP_Login,
    Admin_Log : Admin_Login

    },
    {   
      headerMode: 'none',
      mode:'modal',
      navigationOptions: {
        headerVisible: false,
      }
    }
)

const Authenticate = createStackNavigator({
    auth : AuthenticationScreens,
},
{
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false
    }
})

export default createAppContainer(Authenticate);