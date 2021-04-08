import React, { useState, useEffect } from 'react';
import {  View, Text, ScrollView, StyleSheet, FlatList, Image } from 'react-native';
import {styles} from '../Component/styles';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { FontAwesome, AntDesign, Ionicons } from '../../Icons/icons';
import { Card } from 'react-native-paper';
import { firestore } from '../../config/config';
import { Styles as basket } from './BasketItem';
import Load from '../../Component/loaddata';

export default function Person_Details(props){

    const emp = props.navigation.getParam('data');
    const id = props.navigation.getParam('id');
    const items = props.navigation.getParam('items');
    const [ empdata, setempdata ] = useState({});
    const [ itemdata, setitemdata ] = useState([]);
    const [ productsopen, setproductsopen ] = useState(true);
    const [ creitopen,setcreditopen ] = useState(true);
    const [ loading , setloading ] = useState(true);
    const [ credits, setcredits ] = useState(false);

    useEffect(() => {
        Fetch_data()
    }, []);

    const Fetch_data = async () => {
        setempdata({});
        setloading(true)
        var data = {};
        const ref = firestore.collection('Orders').doc(id).collection('Employees').doc(emp.empid);
        await ref.get().then(
            doc => {
                var item = doc.data();
                data = {
                    DB_Balance : item.Balance,
                    TotalPurchased : item.Total_Purchased,
                    CreaditAmount : item.Credit,
                    DebitAmount : item.Debit,
                    wallet : item.wallet.toFixed(2),
                    Pre_Bal : item.Extra,
                    Credit_Paid : item.Credit_Paid
                }
            }
        );
        setempdata(data);
        
        setitemdata([]);
        var item_data = items.filter((data) => {return data.empid === emp.empid});
        var credits = item_data.filter((data) => { return data.Credit > 0 });
        setcredits(credits.length > 0);
        setitemdata(item_data);
        setloading(false);
    }

    return(
        <ScrollView style = {{flex : 1}}>
            <View style = {{...styles.header, ...{alignItems : 'center'}}}>
                <Ionicons name="md-arrow-back" size={hp('4%')} color="white" onPress = {() => {props.navigation.navigate('BasketItems')}} style = {{marginLeft : wp('5%'),marginTop : wp('5%')}}/>
                <Image source = {{uri : emp.image}} style = {{height : hp('6%'),width : wp('10%'),borderRadius : wp('2%'), borderWidth : 2,marginTop : hp('4%'),marginLeft : wp('5%'),borderColor : 'black'}} />
                <Text style = {styles.headertext}>{emp.name}</Text>
            </View>
            {loading === false ? (
                <View>
                <View style = {{height : hp('22%'),backgroundColor : '#154293',alignItems : 'center'}}>
                    <Text style = {{color : '#CBC5C7',fontSize : hp('1.5%')}}>TOTAL BALANCE</Text>
                    <Text style = {{marginTop : hp('0.5%'),fontSize : hp('4%'),color : 'white',fontWeight : 'bold'}}>{empdata.wallet} <FontAwesome name="rupee" size={hp('3.5%')} color="white" style={{marginTop : hp('0.5%')}} /></Text>
                    {empdata.Pre_Bal ? (
                        <View style = {{height : hp('4%'),width : wp('20%'),backgroundColor : '#97C4EA',borderRadius : wp('2%'),marginTop : hp('1%'),alignItems : 'center'}}>
                            <Text style = {{fontSize : hp('2%'),color : '#074476',fontWeight : 'bold',marginTop : hp('0.5%')}}>{empdata.Pre_Bal.toFixed(2)} <FontAwesome name="rupee" size={hp('2%')} color="#074476" style={{marginTop : hp('0.5%')}} /></Text>
                        </View>
                    ) : (null)}
                </View>

                <ScrollView style = {{marginTop : -hp('5%')}} horizontal = {true} showsHorizontalScrollIndicator = {false}>
                    <View style = {{flexDirection : 'row'}}>

                        {empdata.TotalPurchased ? (
                            <Card style = {{...Dtails_Style.con, ...{backgroundColor : '#9BF4BA'}}}>
                                <Text style = {{...Dtails_Style.label, ...{color : '#16700F'}}}>PURCHASE</Text>
                                <Text style = {Dtails_Style.Amount}>{empdata.TotalPurchased.toFixed(2)} <FontAwesome name="rupee" size={hp('2.1%')} color="black" style={{marginTop : hp('0.5%')}} /></Text>
                            </Card>
                        ):(null)}

                        {empdata.DebitAmount ? (
                            <Card style = {{...Dtails_Style.con, ...{backgroundColor : '#D1B6F7'}}}>
                                <Text style = {{...Dtails_Style.label, ...{color : '#491B71'}}}>DEBIT</Text>
                                <Text style = {Dtails_Style.Amount}>{empdata.DebitAmount.toFixed(2)} <FontAwesome name="rupee" size={hp('2.1%')} color="black" style={{marginTop : hp('0.5%')}} /></Text>
                            </Card>
                        ):(null)}

                        {empdata.CreaditAmount ? (
                            <Card style = {{...Dtails_Style.con, ...{backgroundColor : '#F9B6B2'}}}>
                                <Text style = {{...Dtails_Style.label, ...{color : '#8A1C0B'}}}>CREDIT</Text>
                                <Text style = {Dtails_Style.Amount}>{empdata.CreaditAmount.toFixed(2)} <FontAwesome name="rupee" size={hp('2.1%')} color="black" style={{marginTop : hp('0.5%')}} /></Text>
                            </Card>
                        ):(null)}

                        {empdata.Credit_Paid ? (
                            <Card style = {{...Dtails_Style.con, ...{backgroundColor : '#FCF79F'}}}>
                                <Text style = {{...Dtails_Style.label, ...{color : '#767600'}}}>CREDIT PAID</Text>
                                <Text style = {Dtails_Style.Amount}>{empdata.Credit_Paid.toFixed(2)} <FontAwesome name="rupee" size={hp('2.1%')} color="black" style={{marginTop : hp('0.5%')}} /></Text>
                            </Card>
                        ):(null)}

                        {empdata.DB_Balance > 0 ? (
                            <Card style = {{...Dtails_Style.con, ...{backgroundColor : '#9FFCF4'}}}>
                                <Text style = {{...Dtails_Style.label, ...{color : '#007671'}}}>REMAINING</Text>
                                <Text style = {Dtails_Style.Amount}>{empdata.DB_Balance.toFixed(2)} <FontAwesome name="rupee" size={hp('2.1%')} color="black" style={{marginTop : hp('0.5%')}} /></Text>
                            </Card>
                        ):(null)}

                        {empdata.Pre_Bal > 0 ? (
                            <Card style = {{...Dtails_Style.con, ...{backgroundColor : 'yellow'}}}>
                                <Text style = {{...Dtails_Style.label, ...{color : '#007671'}}}>Pre.Bal</Text>
                                <Text style = {Dtails_Style.Amount}>{empdata.Pre_Bal.toFixed(2)} <FontAwesome name="rupee" size={hp('2.1%')} color="black" style={{marginTop : hp('0.5%')}} /></Text>
                            </Card>
                        ):(null)}
                        
                    </View>
                </ScrollView>

                <Card style = {Dtails_Style.con2}>
                    <View style = {{flexDirection : 'row'}}>
                        <Text style = {Dtails_Style.Label2}>Products</Text>
                        <View style = {{flex : 1,marginTop : hp('1.3%'),alignItems : 'flex-end',marginRight : wp('5%')}}>
                            {productsopen ? (
                                <AntDesign name="caretup" size={hp('2.5%')} color="black" style = {{width : wp('10%'),height : hp('4%')}} onPress = {()=> setproductsopen(false)}/>
                            ):(
                                <AntDesign name="caretdown" size={hp('2.5%')} color="black"  style = {{width : wp('10%'),height : hp('4%')}} onPress = {()=> setproductsopen(true)}/>
                            )}
                        </View>
                    </View>
                </Card>

                {productsopen ? (
                    <View>
                        {itemdata.length > 0 ? (
                            <FlatList 
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{marginBottom:hp('2%')}}
                            data = {itemdata}
                            keyExtractor = {(item,index)=>index.toString()}
                            showsHorizontalScrollIndicator={false}
                            renderItem = {(data) => 
                                <View style={basket.Main}>   
                                    <Card style={{...basket.card, ...{height : hp('30%'),marginHorizontal : wp('2%')}}}>
                                        <View>
                                            <Image style = {{height : hp('12%'), width : wp('40%'),resizeMode : 'contain',marginLeft : wp('3%')}} source = {{uri : data.item.Image }}/>
                                        </View>
                                        <View style={basket.itemName}>
                                            <Text style={basket.itemtext}>{data.item.Name}</Text>
                                        </View>
                                        <View style = {{flexDirection: 'row',marginLeft : wp('3%')}}>
                                            <View style={{...basket.itemRate, ...{width : wp('20%')}}}>
                                                <Text style={{...basket.itemtext, ...{fontWeight : 'normal'}}}>{data.item.Quantity} {data.item.Unit}</Text>
                                            </View>
                                            <View style={basket.itemRate}>
                                                <Text style={basket.itemtext}>{data.item.Rate} <FontAwesome name="rupee" size={hp('1.8%')} color="black" /></Text>
                                            </View>
                                        </View>
        
                                        {
                                            data.item.Debit ? (
                                                <View style = {{flexDirection: 'row',marginLeft : wp('3%')}}>
                                                    <View style={{...basket.itemRate, ...{width : wp('20%')}}}>
                                                        <Text style={{...basket.itemtext, ...{fontWeight : 'bold'}}}>Debit</Text>
                                                    </View>
                                                    <View style={basket.itemRate}>
                                                        <Text style={{...basket.itemtext, ...{fontWeight : 'normal', color : 'green'}}}>{data.item.Debit} <FontAwesome name="rupee" size={hp('1.8%')} color="green" /></Text>
                                                    </View>
                                                </View>
                                            ):(null)
                                        }
        
                                        {
                                            data.item.Credit ? (
                                                <View style = {{flexDirection: 'row',marginLeft : wp('3%')}}>
                                                    <View style={{...basket.itemRate, ...{width : wp('20%')}}}>
                                                        <Text style={{...basket.itemtext, ...{fontWeight : 'bold'}}}>Credit</Text>
                                                    </View>
                                                    <View style={basket.itemRate}>
                                                        <Text style={{...basket.itemtext, ...{fontWeight : 'normal', color : 'red'}}}>{data.item.Credit} <FontAwesome name="rupee" size={hp('1.8%')} color="red" /></Text>
                                                    </View>
                                                </View>
                                            ):(null)
                                        }
        
                                    </Card>
                                </View>
                            }
                        />
                        ):(
                            <View style = {{height : hp('30%'),alignItems : 'center'}}>
                                <Text style={{marginTop : hp('1%'), fontSize : hp('2.5%'),color : '#A9A9B8',marginTop : hp('12%')}}>Not Found Any purchase</Text>
                            </View>
                        )}
                    </View>
                    
                ) : (null)}

                <Card style = {{...Dtails_Style.con2, ...{backgroundColor : '#FE7B77'}}}>
                    <View style = {{flexDirection : 'row'}}>
                        <Text style = {Dtails_Style.Label2}>Credits</Text>
                        <View style = {{flex : 1,marginTop : hp('1.3%'),alignItems : 'flex-end',marginRight : wp('5%')}}>
                            {creitopen ? (
                                <AntDesign name="caretup" size={hp('2.5%')} color="black" style = {{width : wp('10%'),height : hp('4%')}} onPress = {()=> setcreditopen(false)}/>
                            ):(
                                <AntDesign name="caretdown" size={hp('2.5%')} style = {{width : wp('10%'),height : hp('4%')}} color="black" onPress = {()=> setcreditopen(true)}/>
                            )}
                        </View>
                    </View>
                </Card>

                {creitopen=== true ? (
                        credits === true ? (
                            itemdata.map((item, index) => {
                                return(
                                    <View key = {index}>
                                        {item.Credit ? (
                                            <Card style = {{height : hp('8%'),backgroundColor : 'white', marginTop : hp('2%'), borderRadius : wp('3%'),marginHorizontal : wp('3%'), marginBottom : hp('2%')}}>
                                                <View style = {{flexDirection : 'row'}}>
                                                    <View style = {{marginLeft : wp('5%'), marginTop : hp('2%'),flexDirection : 'row'}}>
                                                        <Text style = {{fontSize : hp('2.5%'), fontWeight : 'bold',color : 'black'}}>{item.PersonName}</Text>
                                                        <Text style = {{fontSize : hp('2%'),marginTop : hp('0.5%'),color : 'black'}}>({item.Name})</Text>
                                                    </View> 
                                                    <View style = {{flex : 1,marginTop : hp('2%'),alignItems : 'flex-end'}}>
                                                        <View style = {{flexDirection : 'row',marginRight : wp('3%')}}>
                                                            <Text style = {{fontSize : hp('2.5%'),color : 'red',marginRight : wp('1%')}}>{item.Credit}</Text>
                                                            <FontAwesome name="rupee" size={hp('2.5%')} color="red" style={Dtails_Style.icon} />
                                                        </View>
                                                    </View>
                                                </View>
                                            </Card> 
                                        ):(null)}
                                    </View>
                                )
                            })):(
                                <View style = {{height : hp('20%'),alignItems : 'center'}}>
                                    <Text style={{marginTop : hp('1%'), fontSize : hp('2.5%'),color : '#A9A9B8',marginTop : hp('6%')}}>Not Found Any credits</Text>
                                </View>
                            )
                    ):(null)
                }

            </View>
            ):(

                <Load style = {{flex : 1,marginTop : hp('30%')}}/>
            )}
        </ScrollView>
    )
}

const Dtails_Style = StyleSheet.create({
    con : {
        height : hp('12%'),
        width : wp('33%'),
        marginHorizontal : wp('2%'),
        borderRadius : wp('3%'),
        elevation : 10,
        marginBottom : hp('2%')
    },
    label : {
        marginLeft : wp('3%'),
        marginTop : hp('1%'),
        fontSize : hp('1.5%')
    },
    Amount : {
        marginLeft : wp('3%'),
        fontSize : hp('2.2%'),
        marginTop : hp('1%'),
        fontWeight : 'bold',
        color : 'black'
    },
    con2 : {
        height : hp('6%'),
        marginTop : hp('2%'),
        backgroundColor : '#97C4EA',
        marginHorizontal : wp('2%'),
        borderRadius : wp('2%'),
        elevation : 10,
        borderWidth : 1
    },
    Label2 : {
        marginLeft : wp('3%'),
        marginTop : hp('1%'),
        fontSize : hp('2.2%'),
        color : 'black'
    },
    icon:{
        marginVertical:wp('1%'),
        marginLeft:wp('1%')
    },
})