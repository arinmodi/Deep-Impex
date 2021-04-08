import React from 'react';
import { View,Text,StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { AntDesign } from '../../Icons/icons';

export default class Help extends React.Component{

    render(){
        return(
            <View style={styles.main}>
                <Card style={styles.card}>
                    <Text style={styles.title}>Query</Text>
                    <View style={styles.space}></View>
                    <View style={styles.textcon}>
                        <Text style={styles.querytext}>The mashroom are bad , say what to do ?? </Text>
                    </View>
                    <View style={styles.space}></View>
                    <View style={{flexDirection : 'row',justifyContent : 'space-around'}}>
                        <View style={{marginTop: hp('1%')}}>
                            <AntDesign name="delete" size={hp('3%')} color="red" />
                        </View>
                        <View style={styles.detailscon}>
                            <Text style={{fontSize : hp('2.5%'),color : '#154293',fontWeight : 'bold'}}>Send By : </Text>
                            <Text style={{fontSize : hp('2.5%')}}>+917228996440 </Text>
                        </View>
                    </View>
                </Card>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    main : {
        flex:1,
    },
    card : {
        marginTop : hp('3%'),
        marginHorizontal : wp('5%'),
        borderRadius : wp('3%'),
        elevation : 10,
        overflow : 'hidden'
    },
    title : {
        marginTop : hp('0.5%'),
        marginLeft : wp('3%'),
        fontSize : hp('3%'),
        color : '#154293',
        fontWeight : 'bold',
        height : hp('5%')
    },
    space : {
        height : hp('1%'),
        backgroundColor : '#154293'
    },
    textcon : {
        marginTop : hp('1%'),
        height : hp('12%')
    },
    querytext : {
        marginLeft : wp('3%'),
        fontSize : hp('2.5%'),
        width : wp('80%')
    },
    detailscon : {
        marginTop : hp('1%'),
        height : hp('5%'),
        flexDirection : 'row',
        justifyContent : 'flex-end',
    }
})