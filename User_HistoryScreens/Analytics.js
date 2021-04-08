import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, FlatList, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card } from 'react-native-paper';
import { VictoryPie } from 'victory-native';
import { FontAwesome, MaterialCommunityIcons, AntDesign, Ionicons } from '../Icons/icons';
import { firestore, f } from '../config/config';
import { Styles as basket } from '../AdminScreens/Place_Order_Screens/BasketItem';


export default function Analytics(props){

    const data = props.navigation.getParam('data');

    const [ piedata1, setpiedata1 ] = useState([]);
    const [ piecolor1, setpiecolor1 ] = useState([]);
    const [ piedata2, setpiedata2 ] = useState([]);
    const [ piecolor2, setpiecolor2 ] = useState([]);
    const [ wallet, setwallet ] = useState(0); 
    const [ itemdata, setitemdata ] = useState([]);
    const [ open, close ] = useState(false);
    const [creditopen, setcreditopen ] = useState(false);

    useEffect(() => {
        Fetch_Data()
    }, []);

    const Fetch_Data = async () => {
        if(data.Total_Purchase > 0){
            setpiedata1([]); setpiedata2([]); setpiecolor1([]); setpiecolor2([]); setwallet(0); var lwallet; setitemdata([])
            lwallet = (data.wallet)
            var wallet = []; var purchase = []; var colors2 = []; var colors1 = [];
            wallet.push({
                y : data.Debit,
                x : ((data.Debit * 100)/parseInt( lwallet)).toFixed(0) + '%'
            })
            wallet.push({
                y : data.Balance,
                x : ((data.Balance * 100)/parseInt( lwallet)).toFixed(0)  + '%'
            })
            colors1.push('green', 'blue','#F62178');
            purchase.push({
                y : data.Debit,
                x : (data.Debit * 100/data.Total_Purchase).toFixed(0) + '%'
            })
            purchase.push({
                y : data.Credit,
                x : (data.Credit * 100/data.Total_Purchase).toFixed(0) + '%'
            })
            colors2.push('green', 'red');
            if(data.Credit_Paid){
                wallet.push({
                    y : data.Credit_Paid,
                    x : ((data.Credit_Paid * 100)/lwallet).toFixed(0) + '%'
                })
            }
            setpiedata1(wallet); setpiedata2(purchase); setpiecolor1(colors1); setpiecolor2(colors2); setwallet(lwallet);

            const ref = firestore.collection('Orders').doc(data.id).collection('Items').doc('All_Items');
            var items = [];
            await ref.get().then(snapshot => {
                var data = snapshot.data();

                for(var item in data){
                    const object = data[item];
                    if(object.empid === f.auth().currentUser.uid){
                        items.push({
                            Name : object.Name,
                            Rate : object.Rate,
                            Debit : object.Debit,
                            Credit : object.Credit,
                            PersonName : object.PersonName,
                            Quantity : object.Quantity,
                            Image : object.Image,
                            Unit : object.Unit
                        })
                    }
                }
            })

            items.sort((a,b) => {
                return b.y - a.y
            })

            var newitems = items;

            setitemdata(newitems);

            console.log(piecolor1)
        }
    }

    return(
        <View style = {Styles.Main}>
            <View style = {{...Styles.header,...{flexDirection : 'row'}}}>
                <Ionicons name="arrow-back" size={hp('4%')} color="white" style = {{marginLeft : wp('5%')}} onPress = {() => props.navigation.navigate('Main')}/>
                <View style = {{flex : 1, alignItems : 'center'}}>
                    <Text style = {Styles.title}>{data.Name}</Text>
                </View>
            </View>

            <ScrollView>
            <View style = {{marginBottom : hp('1%')}}>
                <Card style = {{...Styles.analytics, ...{height : open ? hp('37%'): hp('30%')}}}>
                    <View style = {{flexDirection : 'row'}}>
                        <View>
                            <View style = {{marginLeft : wp('5%'), marginTop : hp('2%'),flexDirection : 'row'}}>
                                <Text style = {{fontSize : hp('2%'), color : 'black',fontWeight : 'bold'}}>Wallet :</Text>
                                <Text style = {{fontSize : hp('2%'),marginLeft : wp('2%'),fontWeight : 'bold', color : 'black'}}>{wallet}</Text>   
                                <FontAwesome name="rupee" size={hp('2%')} color="black" style={Styles.icon} />
                            </View> 
                            <View>
                                <VictoryPie
                                    colorScale = {piecolor1}
                                    data={piedata1}
                                    width={Dimensions.get('screen').width<400?wp('60%') : wp('60%')}
                                    height={hp('30%')}
                                    innerRadius={hp('6%')}
                                    padAngle = {wp('0.5%')}
                                    style={{
                                    labels: {
                                    fill: 'black', fontSize: hp('1.5%'), padding: 5,fillOpacity : 0.5
                                    },
                                    parent  : {
                                        marginTop : -hp('4%'),
                                        marginLeft : -wp('7%')
                                    }
                                }}
                                /> 
                            </View>
                        </View>
                        <View style = {{marginLeft : -wp('3%'),marginTop : hp('3%')}}>
                            <View style = {{flexDirection : 'row'}}>
                                <View style = {{flexDirection : 'row', marginTop : hp('2%')}}>
                                    <MaterialCommunityIcons name="record-circle" size={hp('2.5%')} color="green" />
                                    <Text style = {{marginLeft : wp('1%'),color : 'black'}}>Debit</Text>
                                </View>
                                <View style = {{flexDirection : 'row', marginTop : hp('2%'),marginLeft : wp('3%')}}>
                                    <MaterialCommunityIcons name="record-circle" size={hp('2.5%')} color="blue" />
                                    <Text style = {{marginLeft : wp('1%'),color : 'black'}}>Balance</Text>
                                </View>
                            </View>
                            <View style = {{marginTop : hp('2%'),flexDirection : 'row'}}>
                                <Text style = {{fontSize : hp('2%'), fontWeight : 'bold',color : 'black'}}>Debit:</Text>
                                <Text style = {{fontSize : hp('2%'),marginLeft : wp('1%'),fontWeight : 'bold',color : 'black'}}>{data.Debit.toFixed(1)}</Text>   
                                <FontAwesome name="rupee" size={hp('2%')} color="black" style={Styles.icon} />
                            </View>
                            <View style = {{marginTop : hp('1%'),flexDirection : 'row'}}>
                                <Text style = {{fontSize : hp('2%'), fontWeight : 'bold',color : 'black'}}>Balance:</Text>
                                <Text style = {{fontSize : hp('2%'),marginLeft : wp('1%'),fontWeight : 'bold',color : 'black'}}>{data.Balance.toFixed(1)}</Text>   
                                <FontAwesome name="rupee" size={hp('2%')} color="black" style={Styles.icon} />
                            </View>
                            {data.Extra ? (
                                <View style = {{marginTop : hp('1%'),flexDirection : 'row'}}>
                                    <Text style = {{fontSize : hp('2%'), fontWeight : 'bold',color : 'black'}}>Extra:</Text>
                                    <Text style = {{fontSize : hp('2%'),marginLeft : wp('1%'),fontWeight : 'bold',color : 'black'}}>{data.Extra.toFixed(1)}</Text>   
                                    <FontAwesome name="rupee" size={hp('2.5%')} color="black" style={Styles.icon} />
                                </View>
                            ) : (null)}
                            {data.Credit_Paid ? (
                            <View style = {{alignSelf : 'flex-end', marginTop : hp('5%')}}>
                                <View style = {{flexDirection : 'row'}}>
                                    <Text style = {{fontSize : hp('2%'), color : 'blue',marginRight : wp('3%')}}>More</Text>
                                    {open ? (
                                        <AntDesign name="caretup" size={hp('2%')} color="blue" onPress = {() => close(false)} style = {{marginTop : hp('0.5%')}}/>
                                    ):(
                                        <AntDesign name="caretdown" size={hp('2%')} color="blue" onPress = {() => close(true)} style = {{marginTop : hp('0.5%')}}/>
                                    )}
                                </View>
                            </View>
                            ): (null)}
                        </View>
                    </View>
                    {data.Credit_Paid && open ? (
                        <View>
                            <View style = {{flexDirection : 'row', marginLeft : wp('5%')}}>
                                <MaterialCommunityIcons name="record-circle" size={hp('3%')} color="#F62178" />
                                <Text style = {{fontSize : hp('2%'), fontWeight : 'bold',marginLeft : wp('2%'),color : 'black'}}>Credit Paid : </Text>
                                <Text style = {{fontSize : hp('2%'),marginLeft : wp('2%'),fontWeight : 'bold',color : 'black'}}>{data.Credit_Paid.toFixed(1)}</Text>   
                                <FontAwesome name="rupee" size={hp('2%')} color="black" style={Styles.icon} />
                            </View>
                        </View>
                    ):(
                        null
                    )}
                </Card>
            </View>

            <View style = {{marginBottom : hp('2%')}}>
                <Card style = {Styles.analytics}>
                    <View style = {{flexDirection : 'row'}}>
                        <View>
                            <View style = {{marginLeft : wp('5%'), marginTop : hp('2%'),flexDirection : 'row'}}>
                                <Text style = {{fontSize : hp('2%'), color : 'black',fontWeight : 'bold'}}>Purchase :</Text>
                                <Text style = {{fontSize : hp('2%'),marginLeft : wp('2%'),fontWeight : 'bold', color : 'black'}}>{(data.Total_Purchase.toFixed(1))}</Text>   
                                <FontAwesome name="rupee" size={hp('2%')} color="black" style={Styles.icon} />
                            </View> 
                            <View>
                                <VictoryPie
                                    colorScale = {piecolor2}
                                    data={piedata2}
                                    width={wp('60%')}
                                    height={hp('30%')}
                                    innerRadius={hp('6%')}
                                    padAngle = {wp('0.5%')}
                                    style={{
                                    labels: {
                                    fill: 'black', fontSize: hp('1.5%'), padding: 5,fillOpacity : 0.5
                                    },
                                    parent  : {
                                        marginTop : -hp('4%'),
                                        marginLeft : -wp('7%')
                                    }
                                }}
                                /> 
                            </View>
                        </View>
                        <View style = {{marginLeft : -wp('3%'),marginTop : hp('5%')}}>
                            <View style = {{flexDirection : 'row'}}>
                                <View style = {{flexDirection : 'row', marginTop : hp('2%')}}>
                                    <MaterialCommunityIcons name="record-circle" size={hp('2.5%')} color="green" />
                                    <Text style = {{marginLeft : wp('1%'),color : 'black'}}>Debit</Text>
                                </View>
                                <View style = {{flexDirection : 'row', marginTop : hp('2%'),marginLeft : wp('3%')}}>
                                    <MaterialCommunityIcons name="record-circle" size={hp('2.5%')} color="red" />
                                    <Text style = {{marginLeft : wp('1%'),color : 'black'}}>Credit</Text>
                                </View>
                            </View>
                            <View style = {{marginTop : hp('4%'),flexDirection : 'row'}}>
                                <Text style = {{fontSize : hp('2%'), fontWeight : 'bold',color : 'black'}}>Debit:</Text>
                                <Text style = {{fontSize : hp('2%'),marginLeft : wp('1%'),fontWeight : 'bold',color : 'black'}}>{data.Debit.toFixed(1)}</Text>   
                                <FontAwesome name="rupee" size={hp('2%')} color="black" style={Styles.icon} />
                            </View>
                            <View style = {{marginTop : hp('1%'),flexDirection : 'row'}}>
                                <Text style = {{fontSize : hp('2%'), fontWeight : 'bold',color : 'black'}}>Credit:</Text>
                                <Text style = {{fontSize : hp('2%'),marginLeft : wp('1%'),fontWeight : 'bold',color : 'black'}}>{data.Credit.toFixed(1)}</Text>   
                                <FontAwesome name="rupee" size={hp('2%')} color="black" style={Styles.icon} />
                            </View>
                        </View>
                    </View>
                </Card>
            </View>
            
            {data.Credit ? (
            <View>
                 <Card style = {{...Styles.analytics, ...{height : hp('8%'), marginBottom : hp('2%'), borderRadius : wp('3%')}}}>
                     <View style = {{flexDirection : 'row'}}>
                         <View style = {{marginLeft : wp('5%'), marginTop : hp('2%'),flexDirection : 'row'}}>
                            <Text style = {{fontSize : hp('2.5%'), fontWeight : 'bold',color : 'black'}}>Credits :</Text>
                            <Text style = {{fontSize : hp('2.5%'),marginLeft : wp('2%'),color : 'black'}}>{(data.Credit.toFixed(1))}</Text>   
                            <FontAwesome name="rupee" size={hp('2.5%')} color="black" style={Styles.icon} />
                         </View> 
                         <View style = {{flex : 1,marginTop : hp('2%'),alignItems : 'flex-end'}}>
                            <View style = {{flexDirection : 'row',marginRight : wp('3%')}}>
                                {creditopen ? (
                                        <AntDesign name="caretup" size={hp('2.5%')} color="red" onPress = {() => setcreditopen(false)} style = {{marginTop : hp('1%')}}/>
                                    ):(
                                        <AntDesign name="caretdown" size={hp('2.5%')} color="red" onPress = {() => setcreditopen(true)} style = {{marginTop : hp('0.5%')}}/>
                                    )
                                }
                            </View>
                         </View>
                     </View>
                 </Card>
             </View>
            ): (null)}

            {creditopen === true ? (
                    itemdata.map((item, index) => {
                        return(
                            <View key = {index}>
                                {item.Credit ? (
                                    <Card style = {{height : hp('8%'),backgroundColor : 'white', marginTop : hp('2%'), borderRadius : wp('3%'),marginHorizontal : wp('3%'), marginBottom : hp('2%')}}>
                                        <View style = {{flexDirection : 'row'}}>
                                            <View style = {{marginLeft : wp('5%'), marginTop : hp('2%')}}>
                                                <Text style = {{fontSize : hp('2%'), fontWeight : 'bold',color : 'black'}}>{item.PersonName}</Text>
                                            </View> 
                                            <View style = {{flex : 1,marginTop : hp('2%'),alignItems : 'flex-end'}}>
                                                <View style = {{flexDirection : 'row',marginRight : wp('3%')}}>
                                                    <Text style = {{fontSize : hp('2%'),color : 'red',marginRight : wp('1%')}}>{item.Credit}</Text>
                                                    <FontAwesome name="rupee" size={hp('2%')} color="red" style={Styles.icon} />
                                                </View>
                                            </View>
                                        </View>
                                    </Card>
                                ):(null)}
                            </View>
                        )
                    })
                ):(null)
            }

            <FlatList 
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{marginBottom:hp('2%'), flex : 1}}
                data = {itemdata}
                keyExtractor = {(item,index)=>index.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem = {(data) => 
                    <View style={basket.Main}>   
                        <Card style={{...basket.card, ...{height : hp('30%')}}}>
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


            </ScrollView>
        </View>
    )
}

export const Styles = StyleSheet.create({
    Main : {
        flex : 1
    },
    header : {
        height : hp('10%'),
        backgroundColor : '#154293',
        alignItems : 'center',
    },
    title : {
        fontSize:hp('3%'),
        color:'white',
        marginLeft : -wp('10%')
    },
    analytics : {
        marginTop : hp('2%'),
        marginHorizontal : wp('3%'),
        elevation : 25,
        borderRadius : wp('5%'),
        flexDirection : 'row',
        overflow : 'hidden'
    },
    icon:{
        marginVertical:wp('1%'),
        marginLeft:wp('1%')
    },
})