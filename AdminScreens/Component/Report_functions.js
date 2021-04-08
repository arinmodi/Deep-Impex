import React from 'react';
import { firestore, storage, database } from '../../config/config';
import  moment from 'moment';
import * as Print from 'expo-print';
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import { View, Text, TouchableOpacity, ToastAndroid, FlatList, TouchableNativeFeedback } from 'react-native';
import {  AntDesign, MaterialIcons, FontAwesome, MaterialCommunityIcons  } from '../../Icons/icons';
import { Card } from 'react-native-paper';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {styles} from '../Component/styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import RNFetchBlob from 'rn-fetch-blob'

// Upload Report
export const Store_Report = async (uri, filename,path) => {
    const url = uri;
    console.log(url)
    const responce = await fetch(url);
    const blob = await responce.blob();
    const UploadTask = storage.ref(path).child(filename).put(blob);

    UploadTask.on('state_changed', function(snapshot){
        var Progres = ((snapshot.bytesTransferred / snapshot.totalBytes)*100).toFixed(0);
      },
      function(error){
        alert("Try Again! or Retsrat the App")
      },
      function(){
        UploadTask.snapshot.ref.getDownloadURL().then(
          function(downloadURL){
            savedata(downloadURL, filename,path);
          }
          )
        }
    )


};

// Generate ID;
const s4 = () => {
    return Math.floor((1+Math.random())* 0x10000).toString(16).substring(1)
}


const uniqueid = async (path) => {
    console.log('Add2')
    return path + '-' + s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4();
}


//Store Data
const savedata = async (url, name, path) => {
    const reportid = await uniqueid(path);
    var date = new Date();

    date = moment(date).format('YYYY/MM/DD');

    var object = {
        file : url,
        Name : name,
        Date : date
    }

    await database.ref('/' +  path + '/' + reportid).set(object);
};


// create pdf 
export const createPDF = async (report, htmlContent) => {
    console.log(report.length);

    if(report.length > 0){
        const html = htmlContent(report);
        try {
            console.log('called2')
            const uri = await Print.printToFileAsync({ html });
            return uri;

        } catch (error) {
            alert('Some thing bad happen');
        }
    }else{
        return false;
    }
};


// save to storage 
export const savetostoarge = async (uri, name) => {
    const status  = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    if (status.status == 'granted') {
        const { config, fs } = RNFetchBlob;
        let Dir = fs.dirs.DownloadDir;
        let options = {
            fileCache: true,
            addAndroidDownloads : {
                useDownloadManager : true,
                notification : true,
                path:  Dir + '/Deep_Impex/' + name + '.pdf' ,
                description : 'Downloading image...'
            }
        }
        config(options).fetch('GET', uri).then((res) => {
            if(res.path() !== null){
                console.log(res.path());
                ToastAndroid.show("File Downloaded", ToastAndroid.LONG);
            }
        }).catch((e)=>{
            console.log(e)
            alert("Try again...")
        })
    }else{
        alert('File permission needed to download this file');
    }
}

const saveFile = async (fileUri) => {
    console.log('called')
    const status  = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    if (status.status == 'granted') {
        const asset = await MediaLibrary.createAssetAsync(fileUri)
        const album = await MediaLibrary.getAlbumAsync("Deep_Impex");
        if(album == null){
            await MediaLibrary.createAlbumAsync('Deep_Impex', asset,false)
        }else{
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false)
        }
        return true;
    }else{
        alert('File permission needed to download this file');
        return false;
    }
}

//files ui 
export function Fileui(props){
    return(
            <FlatList 
                data = {props.data}
                keyExtractor = {(item,index)=>index.toString()}
                renderItem = {(data) => 
                    <View>
                        <Card style = {{height : hp('10%'),borderBottomColor : 'black', borderBottomWidth : 1}}
                            onPress = {() => props.onReport(data.item.file, data.item.Name)}
                        >
                            <View style = {{flexDirection : 'row' }}>
                                <MaterialCommunityIcons name="file-pdf" size={hp('6%')} color="red" style = {{marginLeft : wp('5%'),marginTop : hp('2%')}} />
                                <Text style = {{fontSize : hp('2%'), marginTop : hp('3.7%'), marginLeft : wp('3%'),color :'black',width : wp('45%')}} numberOfLines = {1} adjustsFontSizeToFit = {true}>{data.item.Name}</Text>
                                <AntDesign name="clouddownload" size={hp('4%')} color="blue" style = {{marginLeft : wp('10%'),marginTop : hp('3%')}} onPress = {() => props.downloadFile(data.item.file, data.item.Name)}/>
                                <MaterialIcons name="delete" size={hp('4%')} color="red" style = {{marginLeft : wp('5%'),marginTop : hp('3%')}} onPress = {() => props.deletpress(data.item.id)} />
                            </View>
                        </Card>
                    </View>
                }
            />
    )
};

export function Nodata(props){
    return(
        <View style = {{alignItems : 'center'}}>
            <FontAwesome name="file-pdf-o" size={hp('20%')} color="#A9A9B8" style = {{...props.style,...{marginTop : hp('20%')}}}/>
            <Text style = {{...props.textstyle, ...styles.nodata}}>No Reports Avialable</Text>
        </View>
    )
};

export function Icon(props){
    return(
        <AntDesign name="pluscircle" size={hp('7%')} color="#154293" style = {{...styles.Add_Button_Con,...props.style}} onPress = {props.onPress}/>
    )
};

export function Date_Modal(props){
    return(
        <Modal 
            isVisible = {props.isVisible}
            animationIn = "fadeIn"
            onBackButtonPress = {props.onBackButtonPress}
            onBackdropPress = {props.onBackdropPress}
        >

            <View style = {styles.modal}>
                <View style = {{marginLeft : wp('3%'), flexDirection : 'row',marginTop : hp('3%'),justifyContent : 'space-around'}}>
                    <View style = {styles.datepicker}>
                        <TouchableOpacity onPress = {props.onFromDatePress}>
                            <MaterialIcons name="date-range" size={hp('3%')} color="green" />
                        </TouchableOpacity>
                        <Text style = {styles.datetext}>{props.date1}</Text>
                    </View>

                    <View style = {{}}>
                        <Text style = {{fontSize : hp('2.5%'), fontWeight : 'bold',color : 'black' }}>To</Text>
                    </View>

                    <View style = {{}}>
                        <View style = {styles.datepicker}>
                            <TouchableOpacity onPress = {props.onToDatePress}>
                                <MaterialIcons name="date-range" size={hp('3%')} color="#154293" />
                            </TouchableOpacity>
                            <Text style = {{...styles.datetext, ...{backgroundColor : 'green'}}}>{props.date2}</Text>
                        </View>
                    </View>
                </View>

                <View style = {{alignItems : 'center'}}>
                    <Card style = {{...styles.ButtonCon, ...{backgroundColor : '#154293',marginTop : hp('6%')}}}>
                        <TouchableNativeFeedback onPress = {props.onPress}>
                            <View style = {{alignItems : 'center'}}>
                                <Text style = {{...styles.ButtonText, ...{fontWeight : 'bold'}}}>Generate</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </Card>
                </View>

                {
                    props.show && (
                        <DateTimePicker 
                            mode = {'date'}
                            minimumDate = {props.minimumDate1}
                            value = {new Date()}
                            display = {"calendar"}
                            onChange = {props.onChange} 
                            onTouchCancel = {props.oncancel1}
                        />
                    )
                }

                {
                    props.show2 && (
                        <DateTimePicker 
                            mode = {'date'}
                            minimumDate = {props.minimumDate2}
                            value = {new Date()}
                            display = {"calendar"}
                            onChange = {props.onChange2} 
                            onTouchCancel = {props.oncancel2}
                        />
                    )
                }
            </View>

        </Modal>
    )
}