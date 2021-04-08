import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableNativeFeedback, Image, StyleSheet, TouchableOpacity, TextInput, ToastAndroid, Dimensions, ScrollView, PixelRatio } from 'react-native';
import { Feather, AntDesign, MaterialIcons, Ionicons, Entypo, Fontisto, } from '../../Icons/icons';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { ADD_Style } from './ADDItem';
import { Card } from 'react-native-paper';
import { database, storage } from '../../config/config';
import SearchBar from "react-native-dynamic-search-bar";
import { styles } from '../../Purchase Screens/BasketItems';
import Modal from 'react-native-modal';
import DropDownPicker from 'react-native-dropdown-picker';
import ImagePicker from 'react-native-image-crop-picker';
import * as Permissions from 'expo-permissions';
import Confirmation from '../../Component/ConfirmationModal';
import Load from '../../Component/loaddata';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Loading from '../../Component/Loading';
import { connect } from 'react-redux';


const {
    width : SCREEN_WIDTH,
    height : SCREEN_HEIGHT
} = Dimensions.get('window');

const scale = SCREEN_HEIGHT / hp('100%');

function normlize (size){
    const newsize = size * scale
    return Math.round(PixelRatio.roundToNearestPixel(newsize)) - 2;
}

function Items(props){

    const id = props.navigation.getParam('id');
    const nav = props.navigation.getParam('nav');
    const [ data, setdata ] = useState([]);
    const [ serchtext, setserchtext ] = useState('');
    const [ filterdata, setfilterdata ] = useState([]);
    const [ serch, setserch ] = useState(false);
    const [ seletedimage, setselectedimage ] = useState('');
    const [ cat, setcat ] = useState('');
    const [ name, setname ] = useState('');
    const [ process, setprocess ] = useState(0)
    const [ currentfiletype, setcurrentfiletype  ] = useState('');
    const [ imgid, setimgid ] = useState('');
    const  [modal, setmodal ] = useState(false);
    const [ longpress, setlongpress ] = useState(false);
    const [ onDeletePress, setonDelete ] = useState(false);
    const [ selecteditem, setselecteditem ] = useState([]);
    const [ load, setload ] = useState(true);
    const [ Quantity, setQuantity ] = useState(0);
    const [ unit, setunit ] = useState('');

    useEffect(() => {
        FetchData()
    }, [])

    // Permissions for access storage
    const getGalleryPermissionAsync = async () => {
        let Gallery = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
        if ( Gallery.status !== "granted") {
            alert('Sorry, we need Gallery permissions to make this work!');
        }
    };

    // accessing Image
    const _pickGalleryImage = async () => {
        await getGalleryPermissionAsync();
        try{
            ImagePicker.openPicker({
                mediaType : 'photo',
                cropping : true
            }).then(res => {
                if(!res.path){
                    alert("Your Image is Not selected ! Try Again");
                }else{
                    setimgid(uniqueid())
                    setselectedimage(res.path);
                }
            }).catch(e => {
                alert("Your Image is Not selected ! Try Again");
            })
        }catch (error){
            console.log(error)
        }
    }

    // Checking Inputs
    const Checking_Inputs = async () => {
        setprocess(1);
        if(name === '' || !name.match(/^[A-Za-z]+(?:[ _][A-Za-z0-9() ]+)*$/)){
            setprocess(0);
            alert('Invalid Input Name');
        }else if(seletedimage === ''){
            setprocess(0);
            alert('Please select image of Product');
        }else if(cat === ''){
            setprocess(0);
            alert('Please select Category');
        }else {
            var unit = cat === 'Other' ? 'Piece':'kg';
            await UploadImage(unit);
            setprocess(0);
            ToastAndroid.show('Item Added' , ToastAndroid.LONG);
        }
    }

    // Uploading Image
    const UploadImage = async (mesure) => {
        Hidemodal();
        console.log('UploadImage');
        console.log(seletedimage)
      
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(seletedimage)[1];
        setcurrentfiletype(ext);
      
        const response = await fetch(seletedimage);
        const blob = await response.blob();
        var filepath = imgid + '.' + currentfiletype;
      
        const UploadTask = storage.ref('Item_Images/'+name+'/').child(filepath).put(blob);
        UploadTask.on('state_changed', function(snapshot){
          var Progres = ((snapshot.bytesTransferred / snapshot.totalBytes)*100).toFixed(0);
        },
        function(error){
            console.log(error)
            alert(error)
        },
        function(){
            console.log('reached')
          UploadTask.snapshot.ref.getDownloadURL().then(
            function(downloadURL){
                console.log('reached2')
                ADD_TO_Database(downloadURL, name, mesure);
            }
            )
          }
        )
    }

    const s4 = () => {
        return Math.floor((1+Math.random())* 0x10000).toString(16).substring(1)
    }
      
    const uniqueid = () => {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + '-' + s4() + '-' + s4();
    }

    const itemid = () => {
        var newname = name.toString().replace(' ', '_');
        return newname + '-' + s4() +'-' + s4();
    }


    const ADD_TO_Database = async (image, name,mesure) => {
        const id = itemid();
        console.log(id);
        const ref = database.ref(cat+'/'+id);
        await ref.set({ Name : name, Image : image, Unit : mesure }).catch(e => console.log(e));
        FetchData();
    }


    // Serch Press
    const onSerch = (text) => {
        if(text !== ''){
            const newdata = data.filter(item => {
                const itemName = item.Name;
                console.log(itemName.indexOf(text) > -1);
                console.log(itemName)
                return itemName.indexOf(text) > -1;
            })
            setfilterdata(newdata);
            setserch(true)
        }else{
            setserch(false);
        }
    }

    // Serch Cancel
    const onCancelPress = () => {
        setserch(false);
    }

    // Fetching Items
    const FetchData = async () => {
        var itemdata = [];
        const ref = database.ref('Vegetables');
        const ref1 = database.ref('Fruits');
        await ref.once('value').then(snapshot => {
            snapshot.forEach(res => {
                let item = res.val();
                itemdata.push({
                    Name : item.Name,
                    Image : item.Image,
                    Cat : "Vegetables",
                    id : res.key,
                    Unit : item.Unit
                })
            })
        })
        await ref1.once('value').then(snapshot => {
            snapshot.forEach(res => {
                let item = res.val();
                itemdata.push({
                    Name : item.Name,
                    Image : item.Image,
                    Cat : "Fruits",
                    id : res.key,
                    Unit : item.Unit
                })
            })
        })

        setdata(itemdata)
        setload(false);
    }


    // Back To Screen
    const Back = () => {
        console.log('Back Pressed')
        if(nav === 'admin'){
            props.navigation.navigate('BasketItems');
        }else if(nav === 'news'){
            props.navigation.navigate('Main');
        }else{
            props.navigation.navigate('Basket');
        }

    }

    // Item Add Press
    const onAdd = (selecteddata) => {
        if(nav === 'news'){
            props.navigation.navigate({routeName : 'News_Upload', params : { id : id, data : selecteddata }})
        }else{
            props.navigation.navigate({routeName : 'Additem', params : { id : id, data : selecteddata }})
        }
    }

    // Vegable Cat Press
    const VegCat = () => {
        setlongpress(false);
        const vegetables = data.filter(item => { return item.Cat === "Vegetables" });
        props.navigation.navigate({routeName : 'Category_Items', params : {  id : id, data : vegetables, cat : 'Vegetables', nav : nav}});
    }

    //Fruit Cat
    const FruitCat = () => {
        setlongpress(false);
        const vegetables = data.filter(item => { return item.Cat === "Fruits" });
        props.navigation.navigate({routeName : 'Category_Items', params : {  id : id, data : vegetables, cat : 'Fruits', nav : nav}})
    }

    const favcat = () => {
        setlongpress(false);
        console.log('called')
        props.navigation.navigate({routeName : 'fav', params : {  id : id, nav : nav }})
    }

    const Othercat = () => {
        setlongpress(false);
        console.log('called')
        props.navigation.navigate({routeName : 'other', params : {  id : id, nav : nav }})
    };

    const Hidemodal = () => {
        setname('');
        setselectedimage('');
        setcat('');
        setmodal(false)
    }

    const onLongPressItem = (item) => {
        if(nav === 'admin' || nav === 'news'){
            setselecteditem(item);
            setlongpress(true);
        }else {
            console.log('Not Admin');
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
        await database.ref(selecteditem.Cat+'/'+selecteditem.id).remove();
        FetchData()
        ToastAndroid.show('Item Deleted', ToastAndroid.LONG)
    }

    const onNoPress = () => {
        HideDelete();
        onSeletcitemCancel();
    }

    return(
        <View style={{flex : 1}}>
            {load === false ? (
            <View>
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
                    <View>
                        <View style = {{...ADD_Style.back,...{}}}>
                            <AntDesign name="arrowleft" size={hp('4%')} color="white" style = {{...ADD_Style.Header,...{}}} onPress = {Back}/>
                            <View style = {{flex : 1,alignItems : 'center'}}>
                                <Text style = {{...ADD_Style.Header, ...{fontSize : hp('3%'), color : 'white',marginLeft : -wp('10%')}}}>Products</Text>
                            </View>
                        </View>
                        <View style={{...styles.Addbutton, ...{top : hp('2.5%'),right : wp('8%')}}}>
                            <TouchableNativeFeedback onPress = {() => setmodal(true)}>
                                <View style={{...styles.circlebutton,...{height : hp('5%'),width : hp('5%'),borderRadius : hp('5%')}}}>
                                    <Ionicons name="ios-add" size={hp('4%')} color="#154293" />
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </View>
                )}
                <View>
                    <SearchBar
                        placeholder="Search for item "
                        onChangeText = {(text) =>  onSerch(text) }
                        onClearPress = {onCancelPress}
                        onPress = {() => onSerch('')}
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
                <ScrollView horizontal = {true} showsHorizontalScrollIndicator = {false} >
                    <View style = {{flexDirection : 'row',height : hp('12%'),marginBottom : hp('2%')}}>
                        <TouchableNativeFeedback onPress = {VegCat}>
                            <Card style = {stylesCopy.cat}>
                                <View style = {{flexDirection : 'row',alignItems : 'center',marginTop : hp('1.2%')}}>
                                    <Image source = {require('../../assets/vegetable.png')} style = {stylesCopy.icon}/>
                                    <Text style = {stylesCopy.text}>Vegetables</Text>
                                </View>
                            </Card>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback onPress = {FruitCat}>
                            <Card style = {{...stylesCopy.cat, ...{width : wp('23%')}}}>
                                <View style = {{flexDirection : 'row',alignItems : 'center',marginTop : hp('1.2%')}}>
                                    <Image source = {require('../../assets/fruits.png')} style = {stylesCopy.icon}/>
                                    <Text style = {stylesCopy.text}>Fruits</Text>
                                </View>
                            </Card> 
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback onPress = {Othercat}>
                            <Card style = {{...stylesCopy.cat, ...{width : wp('23%'),marginRight : wp('3%')}}}>
                                <View style = {{flexDirection : 'row',alignItems : 'center',marginTop : hp('1.2%')}}>
                                    <Image source = {require('../../assets/Other.png')} style = {stylesCopy.icon}/>
                                    <Text style = {stylesCopy.text}>Other</Text>
                                </View>
                            </Card> 
                        </TouchableNativeFeedback>
                        {nav === 'admin' || nav === 'news' ? (
                        <TouchableNativeFeedback onPress = {favcat}>
                            <Card style = {{...stylesCopy.cat, ...{width : wp('23%'),marginRight : wp('3%')}}}>
                                <View style = {{flexDirection : 'row',alignItems : 'center',marginTop : hp('1.2%')}}>
                                    <MaterialIcons name="favorite" size={hp('3%')} color="red" />
                                    <Text style = {stylesCopy.text}>Fav</Text>
                                </View>
                            </Card> 
                        </TouchableNativeFeedback>) : (null)} 
                    </View>
                </ScrollView>

                <FlatList 
                    data = {serch === false ? data : filterdata }
                    keyExtractor = {(item,index)=>index.toString()}
                    style = {{marginTop : hp('2%'), marginHorizontal : wp('2%'),marginBottom : hp('32%')}}
                    numColumns = {2}
                    showsVerticalScrollIndicator = {false}
                    renderItem = { (Data) => 
                        <View style={stylesCopy.Main}>
                            <Card style={stylesCopy.card} onLongPress = {() => onLongPressItem(Data.item)}>
                                <View style={{marginTop : hp('1%'),alignItems : 'center'}}>
                                    <Image style = {{height : hp('13%'), width : wp('30%'),resizeMode : 'contain'}} source = {{uri : Data.item.Image }}/>
                                </View>
                                <View style={{marginTop : hp('2.5%'),alignItems : 'center',width : wp('38%')}}>
                                    <Text style={{fontSize : normlize(13), fontWeight : 'bold',marginLeft : -wp('1%'),color : 'black'}} numberOfLines = {1} adjustsFontSizeToFit = {true}>{Data.item.Name}</Text>
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
                                            <Text style = {{fontSize : hp('2%'),marginHorizontal : wp('3%'), color : 'white',marginVertical : hp('0.5%')}}>ADD</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </Card>
                        </View>
                    }
                />

                <Modal
                    isVisible = {modal}
                    animationIn = "slideInUp"
                    swipeDirection = 'down'
                    onBackButtonPress = {() => Hidemodal()}
                    onBackdropPress = {() => Hidemodal()}
                    onSwipeComplete  = {() => Hidemodal()}
                >
                    <View style = {stylesCopy.Modal}>
                        <View>
                            {seletedimage === '' ? (
                                <View style = {{alignItems : 'center'}}>
                                    <Image source = {require('../../assets/veg.png')} style = {stylesCopy.Image}/>
                                    <TouchableOpacity style = {{marginTop : -hp('25%')}} onPress = {_pickGalleryImage} activeOpacity = {0.5}>
                                        <Card style = {{height : hp('4%'), backgroundColor : 'blue',elevation : 20}}>
                                            <Text style = {{fontSize : hp('2.5%'), color : 'white', marginHorizontal : wp('3%')}}>SelectImage</Text>
                                        </Card>
                                    </TouchableOpacity>
                                </View>
                            ): (
                                <View style = {{alignItems : 'center'}}>
                                    <Image source = {{uri : seletedimage}} style = {{...stylesCopy.Image, ...{opacity : 1}}}/>
                                </View>
                            )}
                        </View>
                        {seletedimage === '' ? (
                            <View style  = {{marginTop : hp('17%'),height : hp('0.5%'), backgroundColor : 'black'}}/>
                        ): (
                            <View style  = {{marginTop : hp('0%'),height : hp('0.5%'), backgroundColor : 'black'}}/>
                        )}
                        <View style = {{flexDirection : 'row', marginTop : hp('4%')}}>
                            <Text style = {{...ADD_Style.label, ...{fontWeight : 'bold'}}}>Category:</Text>
                            <DropDownPicker
                                items={[
                                    {label: 'Vegetables', value: 'Vegetables'},
                                    {label: 'Fruits', value: 'Fruits'},
                                    {label:'Other',value : 'Other'}
                                ]}
                                placeholder = "Vegetables"
                                containerStyle={{height: hp('5%'),width : wp('40%')}}
                                style={{backgroundColor: '#fafafa'}}
                                itemStyle={{
                                    justifyContent: 'flex-start'
                                }}
                                dropDownStyle={{backgroundColor: '#fafafa'}}
                                onChangeItem={item => setcat(item.value)}
                                labelStyle = {{color : 'black'}}
                            />
                        </View>

                    <KeyboardAwareScrollView enableAutomaticScroll = {true}>

                        <View style = {{flexDirection : 'row', marginTop : hp('4%')}}>
                            <Text style = {{...ADD_Style.label, ...{fontWeight : 'bold'}}}>Name:</Text>
                            <TextInput 
                                style = {{height : hp('5.5%'), marginLeft : wp('2%'), fontSize : hp('2.5%'), borderBottomWidth : 1, width : wp('50%'),backgroundColor : '#F5F6FB',borderColor : 'black',borderWidth : 1, borderRadius : wp('2%'),padding : wp('2%')}}
                                placeholder = {'ItemName'}
                                onChangeText = {(text) => setname(text)}
                                editable = {true}
                                keyboardType = {'ascii-capable'}
                            />
                        </View>

                        <View style = {{...stylesCopy.Button_Con,...{marginTop : cat === 'other'?hp('5%'):hp('10%')}}}>
                            <TouchableNativeFeedback onPress = {Checking_Inputs}>
                                <Card style = {stylesCopy.Button}>
                                    <Text style = {stylesCopy.Buttontext}>ADD</Text>
                                </Card>
                            </TouchableNativeFeedback>
                        </View>
                    </KeyboardAwareScrollView>
                    </View>
                </Modal>

                <Confirmation 
                    isVisible = {onDeletePress}
                    onBackButtonPress = {() => HideDelete()}
                    onBackdropPress = {() => HideDelete()}
                    question = {"Are You Sure, Want To Delete"}
                    onPressYes = {() => onYesPress()}
                    onPressNo = {() => onNoPress()}
                />

                <Loading 
                    isVisible = {process > 0}
                    data = {"Adding Wait..."}
                />

                </View>
                
            ):(
                <View style = {{flex : 1}}>

                    <View style = {{height : hp('10%'),backgroundColor : '#154293'}}>

                    </View>

                    <Load 
                        style  = {{flex : 1}}
                    />
                </View>
        )}
        </View>
    )
}

export const stylesCopy = StyleSheet.create({
    Main : {
        flex : 1,
    },
    card : {
        height:hp('27%'),
        marginHorizontal:wp('3.5%'),
        marginVertical:hp('1.5%'),
        alignItems:'center',
        borderRadius:wp('3%'),
        width : wp('42%'),
        elevation : 20
    },
    icon : {
        height : hp('3%'),
        width : hp('3%'),
        resizeMode : 'contain'
    },
    cat : {
        height : hp('5%'),
        marginLeft : wp('5%'),
        marginVertical : hp('3%'),
        width : wp('35%'),
        borderRadius : wp('3%'),
        alignItems : 'center',
        elevation : 10
    },
    text : {
        fontSize : wp('3.5%'),
        marginLeft : wp('1%'),
        fontWeight : 'bold',
        color : 'black'
    },
    Modal : {
        height : hp('110%'),
        backgroundColor : 'white',
        borderRadius : wp('5%'),
        marginTop : hp('20%'),
        marginHorizontal : -wp('5%'),
        overflow : 'hidden',
    },
    Image : {
        height : hp('40%'),
        width : wp('100%'), 
        resizeMode : 'contain', 
        opacity : 0.3
    },
    Button_Con : {
        marginTop : hp('5%'), 
        alignItems : 'center'
    },
    Button : {
        width : wp('15%'),
        elevation : 20,
        height : hp('4%'),
        backgroundColor : 'blue'
    },
    Buttontext : {
        fontSize : hp('2.5%'),
        textAlign : 'center', 
        color : 'white', 
        fontWeight : 'bold'
    }
})

const mapStateToProps = (state) => {
    return {
        Items: state.Basket.Basket_Item_Data,
    }
}

export default connect(mapStateToProps)(Items); 