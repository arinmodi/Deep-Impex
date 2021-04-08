import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableNativeFeedback, FlatList, ToastAndroid, BackHandler, Alert, ScrollView, RefreshControl } from 'react-native';
import { Card } from 'react-native-paper';
import {styles} from '../Component/styles'
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Feather, FontAwesome } from '../../Icons/icons';
import { Fetch_User_Data } from '../../App-Store/Actions/Users';
import { connect } from 'react-redux';
import { database } from '../../config/config';
import  Confirmation from '../../Component/ConfirmationModal';
import SearchBar from "react-native-dynamic-search-bar";
import Load from '../../Component/loaddata';
import Header from '../../Component/Header';
import config from 'react-native-config';

function Users(props){

    const [ modal, setmodal ] = useState(false);
    const [ user,setuser ] = useState([]);
    const [ serchtext, setsertchtext ] = useState('');
    const [ serch, setserch ] = useState(false);
    const [ serchdata, setserchdata ] = useState(false);
    const [ refresh, setrefresh ] = useState(false);

    useEffect(() => {
        var path = 'https://api.edamam.com/api/food-database/v2/parser?app_id=24b3260b&app_key=33b7c2f52589f8e66e6f86f27b6fdbcc&ingr=';
        path += encodeURIComponent("Baby Corn");
        path += "&page=0";
        fetch(path).then((res) => res.json()).then((data) => console.log(data.hints[0].food.image));
        Fetch_data();
        console.log(config.CSE_API_KEY);
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
    
        return () => backHandler.remove();
    }, []);

    const Fetch_data = () => {
        props.Fetch_User_Data();
    }

    const onSerch = (text) => {
        if(text !== ' '){
            const data = props.Users;
            const newdata = data.filter(item => {
                const itemdata = item.UserName;
                const userlastname = item.L_Name
                return itemdata.indexOf(text) > -1 || userlastname.indexOf(text) > -1
            })
            setserch(true);
            setserchdata(newdata);
        }else{
            setserch(false);
        }
    }

    const onCancelPress = () => {
        setsertchtext('');
        setserchdata([]);
        setserch(false);
    }


    const onPress = (data) => {
        setuser(data);
        setmodal(true);
    }

    const HideModal = () => {
        setuser([]);
        setmodal(false);
    }

    const onYesPress = async () => {
        const id = user.uid;
        const active = !user.Active;
        
        await database.ref('Accepted_Employee').child(id).update({
            Active : active
        })

        HideModal();
        ToastAndroid.show('Account ' + (active ? 'Activated' : 'dectivated'), ToastAndroid.LONG )
    }

    const backAction = () => {
        if(props.navigation.isFocused()){
            Alert.alert("Hold on!", "Are you sure you want to close the App?", [
                {
                  text: "Cancel",
                  onPress: () => null,
                  style: "cancel"
                },
                { text: "YES", onPress: () => BackHandler.exitApp() }
              ]);
              return true;
        }
    };

    const Refresh = () => {
        setrefresh(true);
        Fetch_data();
        setrefresh(false);
    }

    return(
        <View style = {{flex : 1}}>
            <Header 
                Name = {'Users'}
                onPress = {() => props.navigation.toggleDrawer()}
            />
            {props.Done === false ? (
                <View style = {{flex : 1}}>
                    {props.Users.length === 0 ? (
                        <View style = {{alignItems : 'center'}}>
                            <FontAwesome name="users" size={hp('20%')} color="#A9A9B8" style = {{marginTop : hp('20%')}}/>
                            <Text style = {styles.nodata}>No Users Found</Text>
                        </View>
                    ): 
                        <View>
                            <View style = {{marginBottom : hp('2%')}}>
                                <SearchBar
                                    placeholder="Search for User"
                                    onChangeText = {(text) => onSerch(text)}
                                    onPress = {() => onSerch(' ')}
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
                                data = {serch === true ? (serchdata) :(props.Users)}
                                style = {{marginBottom : hp('10%')}}
                                keyExtractor = {(item,index)=>index.toString()}
                                refreshing = {refresh}
                                onRefresh = {() => Fetch_data()}
                                showsVerticalScrollIndicator = {false}
                                numColumns = {2}
                                renderItem = { (data) => 
                                    <View style = {styles.UserCrad}>
                                        <Image style = {styles.ProfileImage} source = {{uri : data.item.ProfileImage}}/>
                                        <Text style = {styles.UserName}>{data.item.UserName}</Text>
                                        <Text style = {styles.UserLastName}>{data.item.L_Name}</Text>
                                        <TouchableNativeFeedback onPress = {() => onPress(data.item)}>
                                            <Card style = {{...styles.ButtonCon, ...{backgroundColor : data.item.Active ?'#FC6954' : 'green'}}}>
                                                <View style = {{alignItems : 'center'}}>
                                                    <Text style = {styles.ButtonText}>{data.item.Active ? 'Deactivate' : 'Activate'}</Text>
                                                </View>
                                            </Card>
                                        </TouchableNativeFeedback>
                                    </View>
                                }
                            />


                            <Confirmation
                                isVisible = {modal}
                                onBackButtonPress = {() => HideModal()}
                                onBackdropPress = {() => HideModal()}
                                onPressYes = {() => onYesPress()}
                                onPressNo = {() => HideModal()}
                                question = {'Do you Want To ' + (user.Active ? 'Deactivate' : 'Activate') + ' ' + user.UserName}
                            />
                        </View>
                    }
            </View>
            ):(
                <Load style = {{flex : 1}}/>
            )}
        </View>
    )
}

const mapDispatchToProps = (dispatch) => ({
    Fetch_User_Data : () => {
        dispatch(Fetch_User_Data())
        return Promise.resolve();
    }
});

const mapStateToProps = (state) => {
    return {
       Users : state.Users.User_Data,
       Done : state.Users.done
    }
}

export default connect(mapStateToProps , mapDispatchToProps)(Users);