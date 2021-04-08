import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import {
  widthPercentageToDP as wp, 
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Button } from 'react-native-paper';
import { Ionicons,FontAwesome5 } from '../../Icons/icons';
import SubHeader from '../../Component/SubScreenHeader';
import DocumentPicker from 'react-native-document-picker';
import XLSX from 'xlsx';
import { storage } from '../../config/config';
import { ActivityIndicator } from 'react-native-paper';
import Modal from 'react-native-modal';
import imageSearch from "react-native-google-image-search";

export default function File_Selection(props) {

  const id = props.navigation.getParam('id');

  const [ progress,setprogress ] = useState(1);
  const [ modal,setmodal ] = useState(false);


  const Back = () => {
    props.navigation.navigate('BasketItems');
  }

  const readEcxel = async (file) => {
    setmodal(true);
    const filePath=file.uri;
    var RNFS = require('react-native-fs');
    try{
      const excelFile=await RNFS.readFile(filePath,'ascii');
      const workbook = XLSX.read(excelFile, {type:'binary'});
      const wsname = workbook.SheetNames[0];
      const ws = workbook.Sheets[wsname];
      const data = XLSX.utils.sheet_to_csv(ws);
      convert_To_JSON(data);
    }catch(e){
      setmodal(false);
      console.log(e);
    }
  };

  function convert_To_JSON(csv){
    var lines = csv.split("\n");

    var result = [];

    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length - 1; i++) {
      var obj = {};
      var currentline = lines[i].split(",");

      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }

    Fetch_Image(result,headers);
  }

  const Fetch_Image = async (data,headers) => {
    var finaldata = [];
    var remitems = [];
    var flag = 0;

    console.log(headers);
    if(headers.includes("Name") && headers.includes("Quantity") && headers.includes("Unit") && headers.includes("Annotation")){
    
      setprogress(1);

      for(var element in data) {
        var item = data[element];
        var len = 0;
        item.Name = item.Name.trim();
        try{
        await storage.ref("Item_Images/" + item.Name).list({ maxResults : 1 }).then((file) => { return len = file.items.length });
        console.log("Length of " + item.Name + " " + len);
        if(len === 1){
          await storage.ref("Item_Images/" + item.Name).list({ maxResults : 1 }).then( async (file) => { 
            await Promise.all(file.items.map(async (images,index) => {
              const url = await images.getDownloadURL().then((url) => {return url });
              finaldata.push({
                Name : item.Name,
                Image : url,
                Quantity : item.Quantity,
                Unit : item.Unit,
                Annontation : item.Annotation
              })
            }));
          });
        }else{
          var name = item.Name.replace(" " ,"_");
          await storage.ref("Item_Images/" + name).list({ maxResults : 1 }).then( async (file) => { 
            if(file.items.length >= 1){
              await Promise.all(file.items.map(async (images,index) => {
                const url = await images.getDownloadURL().then((url) => {return url });
                finaldata.push({
                  Name : item.Name,
                  Image : url,
                  Quantity : item.Quantity,
                  Unit : item.Unit,
                  Annontation : item.Annotation
                })
              }));
            }else{
              var gurl;
              try{
              await imageSearch(item.Name + " food image").then(itemimages => {
                console.log("Length = " + itemimages.length);
                if(itemimages.length > 0){
                  return gurl = itemimages[0].link;
                }else{
                  return gurl = "https://falconridgecharter.com/wp-content/uploads/2020/09/4-47194_question-mark-png-question-mark-hover-icon-transparent.png";
                }
              });
              }catch(e){
                console.log("error : caught");
                gurl = "https://falconridgecharter.com/wp-content/uploads/2020/09/4-47194_question-mark-png-question-mark-hover-icon-transparent.png";
              }
              console.log(item.Name);
              console.log(gurl);
              remitems.push({
                Name : item.Name,
                Image : gurl,
                Quantity : item.Quantity,
                Unit : item.Unit,
                Annontation : item.Annonatation
              })
            }
          });
        }

        var index = data.findIndex(x => x.Name === item.Name);
        var progressdata = ((index + 1) * 100) / data.length;
        setprogress(progressdata.toFixed(0));
        
      
      }catch(e){
          console.log(e);
          setprogress(0);
          alert("Something bad happen! check your file");
          setmodal(false);
          flag = 1;
          break;
        }
      };

      if(flag === 0){
        setprogress(100);
        setmodal(false);
        console.log(id)
        props.navigation.navigate({ routeName : 'Preview', params : { founditems : finaldata, Notfounddata : remitems, id : id }  })
      }
    }else{
      setmodal(false);
      setprogress(1);
      alert("Invalid file formate");
    }
  }

  const inputfile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.xlsx],
      });

      await readEcxel(res);
      
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        console.log(err);
      }
    }
  }

  return (
    <View style = {{flex : 1, backgroundColor: '#fff',}}>
      <SubHeader 
          Name = {"File Selection"}
          onPress = {Back}
      />
      <View>
          <Text style = {{color : 'red',fontSize : hp('2%'),textAlign : 'center',marginTop : hp('4%')}}>Note : Only Excel file is permitted</Text>
      </View>
      <View style = {styles.container}>
          <Image  source = {require("../../assets/file.png")} style = {{height : hp('20%'),width : hp('20%'),resizeMode : 'contain'}}/>
          <Button onPress = {() => inputfile()}style = {{marginTop : hp('10%'),backgroundColor :'#154293',borderRadius : wp('2%'),elevation : 10}} labelStyle = {{color : 'white'}} icon = {() => {
              return(   <FontAwesome5 name="file-import" size={hp('2%')} color="white" /> );
          }}>Import FIle</Button>
      </View>

      <Modal
        isVisible  = {modal}
      >
        <View style = {{height : hp('25%'),backgroundColor : 'white',borderRadius : wp('5%'),alignItems : 'center',justifyContent : 'center'}}>
            <ActivityIndicator color = {"blue"} size = {"large"}/>
            <Text style = {{marginTop : hp('3%'),color : 'black'}}>{progress}%</Text>
            <Text style = {{marginTop : hp('1%'),color : 'black'}}>reading File</Text>
            <Text></Text>
        </View>

      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex : 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
