import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableNativeFeedback, Image, StyleSheet, TouchableOpacity, TextInput, ToastAndroid, ActivityIndicator } from 'react-native';
import { Feather, AntDesign, MaterialIcons, Ionicons, Entypo } from '../../Icons/icons';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { ADD_Style } from './ADDItem';
import { Card } from 'react-native-paper';
import { database } from '../../config/config';
import { styles } from '../../Purchase Screens/BasketItems';
import Confirmation from '../../Component/ConfirmationModal';
import { stylesCopy } from './Copy_Items';
import SearchBar from "react-native-dynamic-search-bar";
import Load from '../../Component/loaddata';

export default function Other(props){

    const id = props.navigation.getParam('id');
    const [ data, setdata ] = useState([]);
    const [ longpress, setlongpress ] = useState(false);
    const [ onDeletePress, setonDelete ] = useState(false);
    const [ selecteditem, setselecteditem ] = useState([]);
    const nav = props.navigation.getParam('nav');
    const [ load, setload ] = useState(true);
    const [ filterdata, setfilterdata ] = useState([]);
    const [ serch, setserch ] = useState(false);
    

    useEffect(() => {
        FetchData()
    }, []);

    const onSerch = (serchtext) => {
        if(serchtext !== ' '){
            const newdata = data.filter(item => {
                const itemdata = item.Name;
                return itemdata.indexOf(serchtext) > -1
            })
            setfilterdata(newdata);
            setserch(true)
        }else{
            setserch(false);
        }
    }

    const onCancelPress = () => {
        setserch(false);
    }

    // Fetching Items
    const FetchData = async () => {
        var itemdata = []
        const ref = database.ref('Other');

        await ref.once('value').then((data) => {
            data.forEach(val => {
                let item = val.val();
                itemdata.push({
                    id : val.key,
                    Name : item.Name,
                    Image : item.Image,
                    Quantity : item.Quantity,
                    Unit : item.Unit
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
    const onAdd = async (selecteddata) => {
        if(nav === 'news'){
            props.navigation.navigate({routeName : 'News_Upload', params : { id : id, data : selecteddata }})
        }else{
            props.navigation.navigate({routeName : 'Additem', params : { id : id, data : selecteddata }})
        }
    }

    const onLongPressItem = (item) => {
        if(nav === 'admin'){
            setselecteditem(item);
            setlongpress(true);
        }
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
        await database.ref('Other').child(selecteditem.id).remove();
        await FetchData();
        ToastAndroid.show('Item Deleted', ToastAndroid.LONG)
    }

    const onNoPress = () => {
        HideDelete();
        onSeletcitemCancel();
    }

    return(
        <View style={{flex : 1}}>
            {longpress === true ? (
                <View>
                    <View style = {ADD_Style.back}>
                        <Entypo name="cross" size={24} size={hp('4%')} color="white" style = {ADD_Style.Header} onPress = {onSeletcitemCancel} />
                        <Text style = {{...ADD_Style.Header, ...{fontSize : hp('3%'), color : 'white'}}}>{selecteditem.Name}</Text>
                    </View>
                    <View style={{...styles.Addbutton, ...{top : hp('8%')}}}>
                        <TouchableNativeFeedback>
                            <MaterialIcons name="delete" size={hp('4%')} color="white" onPress = {() => setonDelete(true)}/>
                        </TouchableNativeFeedback>
                    </View>
                </View>
            ) : (
                <View>
                    <View style = {ADD_Style.back}>
                        <AntDesign name="arrowleft" size={hp('4%')} color="white" style = {ADD_Style.Header} onPress = {Back}/>
                        <View style = {{flex : 1,alignItems : 'center',marginLeft : -wp('10%')}}>
                            <Text style = {{...ADD_Style.Header, ...{fontSize : hp('3%'), color : 'white'}}}>Other</Text>
                        </View>
                    </View>
                </View>
            )}

            {load === false ? (
                <View style = {{flex : 1}}>
                    <View>
                        <SearchBar
                            placeholder="Search for item "
                            onChangeText = {(text) => onSerch(text)}
                            onPress = {() => onSerch('')}
                            onClearPress = {onCancelPress}
                            searchIconImageStyle = {{
                                tintColor : 'blue'
                            }}
                            clearIconImageStyle = {{
                                tintColor : 'red'
                            }}
                            style = {{
                                height : hp('6%'),
                                width : wp('90%'),
                                borderRadius : wp('3%'),
                                backgroundColor : "white",
                                marginTop : hp('2%'),
                                elevation : 20,
                                borderColor : 'black',
                                borderWidth : 1
                            }}
                            textInputStyle = {{
                                fontSize : hp('2%'),
                                color : 'black',
                                padding : wp('2%')
                            }}
                        />
                    </View>
                <FlatList 
                data = {serch === false ? data : filterdata}
                keyExtractor = {(item,index)=>index.toString()}
                style = {{marginTop : hp('2%'), marginHorizontal : wp('2%'), marginBottom : hp('0%')}}
                showsVerticalScrollIndicator = {false}
                numColumns = {2}
                renderItem = { (Data) => 
                    <View style={{...stylesCopy.Main,...{}}}>
                        <Card style={{...stylesCopy.card,...{height : hp('29%')}}} onLongPress = {() => onLongPressItem(Data.item)}>
                            <View style={{marginTop : hp('1%'),alignItems : 'center'}}>
                                <Image style = {{height : hp('15%'), width : hp('15%'),resizeMode : 'contain'}} source = {{uri : Data.item.Image }}/>
                            </View>
                            <View style={{marginTop : hp('2.5%'),alignItems : 'center',width : wp('38%')}}>
                                <Text style={{fontSize : hp('1.7%'), fontWeight : 'bold',marginLeft : wp('1%'),color : 'black'}} numberOfLines = {1} adjustsFontSizeToFit = {true}>{Data.item.Name}</Text>
                            </View>
                            <View style = {{flexDirection : 'row'}}>
                                <View style = {{width : wp('15%')}}>
                                    {Data.item.id === selecteditem.id ? (
                                        <Image source = {require('../../assets/done.png')} style = {stylesCopy.icon}/>
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