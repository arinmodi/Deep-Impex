import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableNativeFeedback, Image, StyleSheet, TouchableOpacity, TextInput, ToastAndroid, ActivityIndicator } from 'react-native';
import { Feather, AntDesign, MaterialIcons, Ionicons, Entypo } from '../../Icons/icons';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { ADD_Style } from './ADDItem';
import { Card } from 'react-native-paper';
import { firestore } from '../../config/config';
import { styles } from '../../Purchase Screens/BasketItems';
import Confirmation from '../../Component/ConfirmationModal';
import { stylesCopy } from './Copy_Items';
import Load from '../../Component/loaddata';
import SubHeader from '../../Component/SubScreenHeader';

export default function fav(props){

    const id = props.navigation.getParam('id');
    const [ data, setdata ] = useState([]);
    const [ longpress, setlongpress ] = useState(false);
    const [ onDeletePress, setonDelete ] = useState(false);
    const [ selecteditem, setselecteditem ] = useState([]);
    const nav = props.navigation.getParam('nav');
    const [ load, setload ] = useState(true);

    useEffect(() => {
        FetchData()
    }, [])

    // Fetching Items
    const FetchData = async () => {
        var itemdata = []
        const ref = firestore.collection('Favorite');
        await ref.get().then(data => {
            data.docs.forEach(res => {
                let item = res.data();
                itemdata.push({
                    Name : res.id,
                    Image : item.Image,
                    id : res.id
                })
            })
        })
        setdata(itemdata);
        setload(false);
    }


    // Back To Screen
    const Back = () => {
        props.navigation.navigate('Items');

    }

    // Item Add Press
    const onAdd = (selecteddata) => {
        if(nav === 'news'){
            props.navigation.navigate({routeName : 'News_Upload', params : { id : id, data : selecteddata }})
        }else{
            props.navigation.navigate({routeName : 'Additem', params : { id : id, data : selecteddata }})
        }
    }

    const onLongPressItem = (item) => {
        setselecteditem(item);
        setlongpress(true);
    }

    const onSeletcitemCancel = () => {
        setselecteditem([])
        setlongpress(false)
    };

    const HideDelete = () => {
        setselecteditem([]);
        setonDelete(false);
    }

    const onYesPress = async () => {
        HideDelete();
        onSeletcitemCancel();
        await firestore.collection('Favorite').doc(selecteditem.Name).delete();
        FetchData()
        ToastAndroid.show('Item Deleted', ToastAndroid.LONG)
    }

    const onNoPress = () => {
        HideDelete();
        onSeletcitemCancel();
    }

    return(
        <View style={{flex : 1}}>
            {longpress === true? (
                <View>
                    <View style = {{...ADD_Style.back,...{}}}>
                        <Entypo name="cross" size={hp('4%')} color="white" style = {{...ADD_Style.Header,...{}}} onPress = {onSeletcitemCancel} />
                        <Text style = {{...ADD_Style.Header, ...{fontSize : hp('2.5%'), color : 'white'}}}>{selecteditem.Name}</Text>
                    </View>
                    <View style={{...styles.Addbutton, ...{top : hp('4%')}}}>
                        <TouchableNativeFeedback>
                            <MaterialIcons name="delete" size={hp('3%')} color="white" onPress = {() => setonDelete(true)}/>
                        </TouchableNativeFeedback>
                    </View>
                </View>
            ) : (

                <SubHeader 
                    Name = {'Favorites'}
                    onPress = {Back}
                />
            )}

            {load === false ? (
                <View style = {{flex : 1}}>
                    {data.length > 0?(
                        <FlatList 
                            data = {data}
                            keyExtractor = {(item,index)=>index.toString()}
                            style = {{marginTop : hp('2%'), marginHorizontal : wp('2%')}}
                            numColumns = {2}
                            renderItem = { (Data) => 
                                <View style={stylesCopy.Main}>
                                    <Card style={stylesCopy.card} onLongPress = {() => onLongPressItem(Data.item)}>
                                        <View style={{marginTop : hp('1%'),alignItems : 'center'}}>
                                            <Image style = {{height : hp('13%'), width : wp('30%'),resizeMode : 'contain'}} source = {{uri : Data.item.Image }}/>
                                        </View>
                                        <View style={{marginTop : hp('2.5%'),alignItems : 'center',width : wp('38%')}}>
                                            <Text style={{fontSize : hp('1.7%'), fontWeight : 'bold',marginHorizontal : wp('2%'),color : 'black'}} numberOfLines = {1} adjustsFontSizeToFit = {true}>{Data.item.Name}</Text>
                                        </View>
                                        <View style = {{flexDirection : 'row',marginTop : hp('1%')}}>
                                            <View style = {{width : wp('12%'),justifyContent : 'center',marginTop : hp('1%')}}>
                                                {Data.item.Name === selecteditem.Name ? (
                                                    <Image source = {require('../../assets/done.png')} style = {{...stylesCopy.icon,...{}}}/>
                                                ): (
                                                    null
                                                )}
                                            </View>
                                            <TouchableOpacity onPress = {() => onAdd(Data.item)}>
                                                <View style = {{flexDirection : 'row', backgroundColor : "#154293", borderRadius : wp('1%'),marginTop : hp('1.5%')}}>
                                                    <Text style = {{fontSize : hp('2%'),marginHorizontal : wp('1.5%'), color : 'white',marginVertical : hp('0.5%')}}>ADD</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </Card>
                                </View>
                            }
                        />
                ):(
                    <View style = {{flex : 1, justifyContent :'center',alignItems :'center'}}>
                        <Text style={{marginTop : hp('1%'), fontSize : hp('2.5%'),color : '#A9A9B8'}}>Not found any fav items</Text>
                    </View>
                )}

            <Confirmation 
                isVisible = {onDeletePress}
                onBackButtonPress = {() => HideDelete()}
                onBackdropPress = {() => HideDelete()}
                question = {"Are You Sure, Want To Delete"}
                onPressYes = {() => onYesPress()}
                onPressNo = {() => onNoPress()}
            />

            </View>
        ):(
            <Load style = {{flex : 1}}/>
        )}
        </View>
    )
}