import React, {useState, useEffect} from 'react';
import {  View, Text, FlatList, Image } from 'react-native';
import { styles } from '../AdminScreens/Component/styles';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Styles } from '../AdminScreens/Place_Order_Screens/BasketItem';
import moment from 'moment';
import { Ionicons, FontAwesome, MaterialIcons } from '../Icons/icons';
import { firestore } from '../config/config';
import { Card } from 'react-native-paper';
import Load from '../Component/loaddata';
import SubHeader from '../Component/SubScreenHeader';

export default function Future_Items(props){

    const data = props.navigation.getParam('data');

    const [ items, setitems ] = useState([]);
    const [ loading , setloading ] = useState(true);

    useEffect(() => {
        Fetch_Item_Data();
    }, []);

    const Fetch_Item_Data = async () => {
        setitems([]);
        var itemdata = [];
        const id = data.id;
        const ref = firestore.collection('Orders').doc(id).collection('Items').doc('All_Items');

        await ref.get().then(data => {
            let items = data.data();
            console.log('called')

            for(var item in items){
                var item_obj = items[item];
                itemdata.push({
                    Name : item_obj.Name,
                    Quantity : item_obj.Quantity,
                    Image : item_obj.Image,
                    annonation : item_obj.annonation,
                    Unit : item_obj.Unit
                })
            }

        });

        setitems(itemdata);
        setloading(false);
    }

    return(
        <View style = {{flex : 1}}>
            <SubHeader 
                Name = {data.Name}
                onPress = {() => props.navigation.navigate('Main')}
            />
            {loading === false ? (
                <View style = {{flex : 1}}>

                    <View style={{flexDirection : 'row',marginTop : hp('2%'),marginHorizontal : wp('5%')}}>
                        <View>
                            <Text style={{color : 'black',fontSize : hp('2.5%'),fontWeight : 'bold'}}>{moment(data.Date.toDate()).format('DD/MM/YYYY')}</Text>
                        </View>
                        <View style={{flex : 1, alignItems : 'flex-end'}}>
                            <View style = {{flexDirection : 'row'}}>
                                <Text style = {{fontSize : hp('2.5%'),fontWeight : 'bold',marginHorizontal: wp('3%'),color : 'blue'}}>{data.wallet}</Text>
                                <FontAwesome name="rupee" size={hp('2.5%')} color="blue" style={{marginTop : hp('0.5%')}} />
                            </View>
                        </View>
                    </View>

                    {items.length > 0 ? (
                        <FlatList 
                                data = {items}
                                showsVerticalScrollIndicator = {false}
                                style = {{}}
                                keyExtractor = {(item,index)=>index.toString()}
                                numColumns = {2}
                                renderItem = { (Data) => 
                                    <View style={Styles.Main}>   
                                            <Card style={{...Styles.card, ...{height:hp('22%'),width : wp('43%'),marginHorizontal:wp('3.5%')}}}>
                                                <View>
                                                    <Image style = {{height : hp('12%'), width : wp('40%'),resizeMode : 'contain',marginLeft : wp('3%')}} source = {{uri : Data.item.Image }}/>
                                                </View>
                                                <View style={Styles.itemName}>
                                                    <Text style={Styles.itemtext} numberOfLines = {1} adjustsFontSizeToFit = {true}>{Data.item.Name}</Text>
                                                </View>
                                                <View style = {{flexDirection: 'row',marginLeft : wp('3%')}}>
                                                    <View style={{...Styles.itemRate,...{width : wp('17%'),alignItems : 'center'}}}>
                                                        <Text style={{...Styles.itemtext, ...{fontWeight : 'normal'}}} numberOfLines = {1} adjustsFontSizeToFit = {true}>{Data.item.Quantity} {Data.item.Unit}</Text>
                                                    </View>
                                                </View>
                                            </Card>
                                    </View>
                                }
                            />
                    ):(
                        <View style={{justifyContent :'center',alignItems : 'center',marginTop : hp('20%')}}>
                            <MaterialIcons name="add-shopping-cart" size={hp('10%')} color="#A9A9B8" />
                            <Text style={{marginTop : hp('1%'), fontSize : hp('2.5%'),color : "#A9A9B8"}}>No Items found</Text>
                        </View>
                    )}
                </View>
            ):(
                <Load style = {{flex : 1}}/>
            )}
        </View>
    )

}