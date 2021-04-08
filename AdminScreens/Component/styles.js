import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Dimensions} from 'react-native';

export const styles = StyleSheet.create({
    header : {
        height : hp('10%'),
        backgroundColor : '#154293',
        alignItems : 'center',
        flexDirection : 'row'
    },
    headertext : {
        fontSize : hp('2.5%'),
        color : 'white',
        marginLeft : wp('5%')
    },
    iconcon : {
        flex : 1, 
    },
    icon : {
        alignSelf : 'flex-end',
        marginRight : wp('5%'),
        marginTop : hp('5%')
    },
    UserCrad : {
        height : hp('35%'),
        width : wp('48%'),
        backgroundColor : 'white',
        marginHorizontal : wp('1%'),
        marginBottom : hp('1%'),
        alignItems : 'center'
    },
    ProfileImage : {
        width:hp('12%'),
        height:hp('12%'),
        borderRadius:hp('12%'), 
        marginTop : hp('3%'),
    },
    UserName : {
        marginTop : hp('2%'),
        fontSize : hp('2.5%'),
        color : 'black',
    },
    UserLastName: {
        fontSize : hp('2.5%'),
        color : 'black',
    },
    ButtonCon : {
        marginTop : hp('2%'),
        width : wp('30%'),
        height : hp('5%'),
        borderRadius : wp('4%')
    },
    ButtonText : {
        fontSize : hp('2%'),
        marginVertical : hp('0.8%'),
        color : 'white'
    },
    Add_Button_Con : {
        position : 'absolute',
        top : hp('70%'),
        left : wp('83%'),
    },
    modal : {
        height : hp('25%'),
        borderRadius : wp('5%'),
        backgroundColor : 'white',
        overflow : 'hidden'
    },
    datepicker : {
        flexDirection : 'row',
        alignItems : 'center'
    },
    datetext : {
        padding : wp('1%'),
        fontSize : hp('2%'),
        backgroundColor : '#154293',
        color : 'white',
        borderRadius : wp('2%'),
        fontWeight : 'bold'
    },
    nodata : {
        marginTop : hp('4%'),
        fontSize : hp('3%'), 
        color : '#A9A9B8'
    }
})