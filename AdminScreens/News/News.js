import React, {useEffect, useState} from 'react';
import { View, Text, Image, FlatList, ToastAndroid } from 'react-native';
import { Card } from 'react-native-paper';
import {styles} from '../Component/styles'
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Feather, AntDesign, FontAwesome } from '../../Icons/icons';
import { styles as main } from '../../Home Screens/News';
import { Fetch_News_Data } from '../../App-Store/Actions/News';
import { connect } from 'react-redux';
import moment from 'moment';
import { firestore } from '../../config/config';
import Confirmation from '../../Component/ConfirmationModal';
import Load from '../../Component/loaddata';
import Header from '../../Component/Header';

function News(props){

    const [modalD , setmodalD] = useState(false);
    const [ d_id, setid  ] = useState('');
    const [ load, setload ] = useState(true);

    const HidemodalD = () => {
        setid('');
        setmodalD(false);
    }

    const Delete = async () => {
        HidemodalD();
        const ref = firestore.collection('News').doc(d_id);
        await ref.delete();
        ToastAndroid.show('News deleted' , ToastAndroid.LONG);
    }

    const onDelete = (data) => {
        console.log('Clcked')
        setid(data.id);
        setmodalD(true)
    }

    useEffect(() => {  Fetch_Data() },[]);

    const Fetch_Data = () => {
        props.Fetch_News_Data();
        setload(false);

    }

    const onEditPress = (Data) => {
        props.navigation.navigate({ routeName : 'News_Edit', params : {data : Data} })
    }

    function Render(data){
        return(
            <View style = {{flex : 1}}>
                <Card style={main.card}>
                    <Image source={{uri:data.item.Image}} style={{...main.image,...{borderRadius : wp('3%'),borderWidth : 1.5,resizeMode : 'contain'}}}/>
                    <View style={{marginLeft:hp('18%'),marginTop:-hp('12%')}}>
                        <View style = {{flexDirection : 'row'}}>
                            <Text style={{...main.Name,...{fontSize : hp('2.5%'),width : wp('50%'),color : 'black'}}}>{data.item.Name}</Text>
                            <Text style={{...main.Name,...{fontSize : hp('2.2%'),fontWeight : 'bold',color : 'black'}}}>{data.item.Quantity} {data.item.Unit}</Text>
                        </View>
                        <View style = {{height : hp('8%')}}>
                            <Text style={main.News}>{data.item.annonation}</Text>
                        </View>
                    </View>
                    <View style = {{flexDirection : 'row'}}>
                        <View style = {{marginTop : hp('2%'),marginLeft : wp('5%')}}>
                            <Text style = {{fontWeight : 'bold',color : 'black'}}>{moment(data.item.Date.toDate()).format('DD/MM/YYYY')}</Text>
                        </View>
                        <View style = {{marginTop : hp('2%'),alignItems : 'flex-end',flex : 1,marginRight : wp('5%')}}>
                            <View style = {{flexDirection : 'row',width : wp('15%'),justifyContent : 'space-between'}}>
                                <AntDesign name="edit" size={hp('3%')} color="green" onPress = {() => onEditPress(data.item)}/>
                                <AntDesign name="delete" size={hp('3%')} color="red" onPress = {() => onDelete(data.item)}/>
                            </View>
                        </View>
                    </View>
                </Card>  
            </View>
        )
    }

    return(
        <View style = {{flex : 1}}>

            <Header 
                  Name = {'News'}
                  onPress = {() => props.navigation.toggleDrawer()}
              />

            {props.Load === false ? (
                <View style = {{flex : 1}}>
                    {props.News.length > 0 ? (
                        <View>
                            <View>
                                <FlatList
                                    style={{marginBottom:hp('0.5%')}}
                                    renderItem={Render}
                                    keyExtractor = {(item,index)=>index.toString()}
                                    data={props.News}
                                />
                            </View>

                            <Confirmation 
                                isVisible = {modalD}
                                onBackButtonPress = {() => HidemodalD()}
                                onBackdropPress = {() => HidemodalD()}
                                question = {"Are You Sure, Want To Delete"}
                                onPressYes = {() => Delete()}
                                onPressNo = {() => HidemodalD()}
                            />
                        </View>
                    ):(
                        <View style = {{flex : 1, justifyContent : 'center',alignItems : 'center'}}>
                            <FontAwesome name="newspaper-o" size={hp('15%')} color="#A9A9B8" />
                            <Text style = {{marginTop : hp('2%'),fontSize : hp('2.5%'),color : '#A9A9B8'}}>Not find any News</Text>
                        </View>
                    )}

                    <AntDesign name="pluscircle" size={hp('7%')} color="#154293" style = {{...styles.Add_Button_Con,...{top : hp('77%'),left : wp('85%')}}} onPress = {() => props.navigation.navigate({routeName : 'Items', params : {nav : 'news'}})}/>
                    
                </View>
            ) : (
                <Load style = {{flex : 2}}/>
            )}
        </View>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        Fetch_News_Data : () => { dispatch(Fetch_News_Data()) },
    }
}

const mapStateToProps = (state) => {
    return {
       News : state.News.News_Data,
       Load : state.News.Load
    }
}

export default connect(mapStateToProps , mapDispatchToProps)(News);