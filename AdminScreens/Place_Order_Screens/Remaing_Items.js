import React, { useState } from 'react';
import { View, Text, FlatList, Image, ToastAndroid, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Styles } from './BasketItem';
import { AntDesign,Ionicons } from '../../Icons/icons';
import Upload_Data_To_All_Items from '../Component/Upload_To_All_Items';
import Modal from 'react-native-modal';

export default function Remaing(props){

    var remdata = props.navigation.getParam("remdata");
    const id = props.navigation.getParam('id');
    const [progress, setprogress] = useState(0);
    const [modal, setmodal] = useState(false);

    const Back = () => {
        props.navigation.navigate('Preview');
    }

    const upload = async () => {
        setmodal(true);
        for(var item in remdata){
            var data = remdata[item];
            var index = remdata.findIndex(x => x.Name === data.Name);
            var progressdata = ((index + 1) * 100) / remdata.length;
            setprogress(progressdata.toFixed(0));
            if(data.Annontation === '' ||  !data.Annontation){
                await Upload_Data_To_All_Items(data.Image, data.Name, parseFloat(data.Quantity), id, 'None', 'admin',data.Unit);
            }else{
                await Upload_Data_To_All_Items(data.Image, data.Name, parseFloat(data.Quantity), id, data.Annontation , 'admin',data.Unit);
            }
        }
        setmodal(false);
        ToastAndroid.show("Items Added" ,ToastAndroid.LONG);
        props.navigation.navigate("BasketItems");
    }

    const FlatListRender = (data) => {
        return(
            <View style={Styles.Main}>   
                <Card style={{...Styles.card, ...{height : hp('24%')}}}>
                    <View>
                        <Image style = {{height : hp('12%'), width : wp('40%'),resizeMode : 'contain',marginLeft : wp('3%')}} source = {{uri : data.item.Image }}/>
                    </View>
                    <View style={Styles.itemName}>
                        <Text style={Styles.itemtext} numberOfLines = {1} allowFontScaling = {true} adjustsFontSizeToFit = {true}>{data.item.Name}</Text>
                    </View>
                    <View style = {{flexDirection: 'row',marginLeft : wp('3%')}}>
                        <View style={{...Styles.itemRate,...{width : wp('20%')}}}>
                            <Text style={{...Styles.itemtext, ...{fontWeight : 'normal'}}}>{data.item.Quantity} {data.item.Unit}</Text>
                        </View>
                    </View>
                </Card>
            </View>
        )
    }

    return(
        <View style = {{flex : 1}}>
            <View  style={{height : hp('10%'),backgroundColor:'#154293'}}>
                <View style={{flexDirection:'row',marginTop:hp('2.5%'),marginBottom : hp('2%')}}>
                    <Ionicons name="ios-arrow-back" size={hp('4%')} color="white"style={{marginLeft : wp('5%')}} onPress = {Back}/>
                    <View style = {{flex : 1,alignItems : 'center'}}>
                        <Text style={{fontSize:hp('2.5%'),color:'white',marginTop : hp('0.5%')}}>Items</Text>
                    </View>
                    <View style = {{alignItems : 'flex-end',marginRight : wp('5%')}}>
                        <AntDesign name="checkcircle" size={hp('3%')} color="white" style = {{marginTop : hp('1%')}} onPress = {() => upload()}/>
                    </View>
                </View>
            </View>

            {remdata.length > 0 ? (
                <FlatList 
                    style = {{flex : 1}}
                    data = {remdata}
                    showsVerticalScrollIndicator = {false}
                    keyExtractor = {(item,index)=>index.toString()}
                    renderItem = {FlatListRender}
                    numColumns = {2}
                />
            ):(
                null
            )}

            <Modal
                isVisible  = {modal}
            >
                <View style = {{height : hp('25%'),backgroundColor : 'white',borderRadius : wp('5%'),alignItems : 'center',justifyContent : 'center'}}>
                    <ActivityIndicator color = {"blue"} size = {"large"}/>
                    <Text style = {{marginTop : hp('3%'),color : 'black'}}>{progress}%</Text>
                    <Text style = {{marginTop : hp('1%'),color : 'black'}}>Uploading...</Text>
                    <Text></Text>
                </View>

            </Modal>
        </View>
    )
}