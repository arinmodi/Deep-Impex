import { createAppContainer } from 'react-navigation';
import {  createStackNavigator } from 'react-navigation-stack';
import Requets from './UserRequests';

const Admin_Home = createStackNavigator({
    screen : Requets,
},
{
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false
    }
})

export default createAppContainer(Admin_Home);
