import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions,FlatList, TouchableNativeFeedback } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card } from 'react-native-paper';
import { VictoryPie } from 'victory-native';
import { FontAwesome } from '../Icons/icons';
import { Transfer_Style } from './Transfer';
import { ChangeColorFunction } from '../Component/functions/fetch_order_empdata';
import { styles } from '../Home Screens/UpcomingOrder';
import { Styles } from '../User_HistoryScreens/Analytics';
import SubHeader from '../Component/SubScreenHeader';

export default function Credits_Analytics(props){

    const Name = props.navigation.getParam('Name');
    const data = props.navigation.getParam('data');
    const personname = props.navigation.getParam('PersonNames');
    const total = props.navigation.getParam('Total');
    const orderid = props.navigation.getParam('id');

    const [ graph, setgraph ] = useState([]);
    const [ colors, setcolors ] = useState([]);


    useEffect(() => {
        Fetch_Order_Credits();
    }, []);

    const Fetch_Order_Credits = async () => {
        var graphdata = [];
        var lcolors = [];
        setcolors([]);   setgraph([]);
        var no = 4;
        personname.forEach(element => {
            const color = ChangeColorFunction(no);
            const onepersondata = data.filter(data => { return data.PersonName === element });
            console.log(onepersondata)
            var onepersontotal = findsum(onepersondata, 'Amount');
            if(onepersontotal > 0){
                graphdata.push({
                    y : onepersontotal,
                    x : ((parseFloat(onepersontotal * 100)) / parseFloat(total)).toFixed(0) + '%',
                    Name : element,
                    color : color,
                });
                lcolors.push(color)
                no = no + 1;
            }
        });
        setgraph(graphdata);
        setcolors(lcolors);
    }

    const findsum = (items, prop) => {
        return items.reduce((a,b) => {
            return a + b[prop]
        },0)
    };

    const onPress = (ldata) => {
        const filtereddata = data.filter(data => { return data.PersonName === ldata.Name })
        props.navigation.navigate({routeName : 'P_Credit', params : {Name : ldata.Name, data : filtereddata, id : orderid}})
    }

    const render = (data) => {
        return(
            <Card style = {{height : hp('8%'),marginTop : hp('1%'),marginHorizontal : wp('3%'), marginBottom : hp('2%')}}>
                <TouchableNativeFeedback onPress = {() => onPress(data.item)}>
                    <View style = {{flexDirection : 'row'}}>
                        <View style = {{marginLeft : wp('5%'), marginTop : hp('2%'), flexDirection : 'row',alignItems : 'center'}}>
                            <Card style = {{...styles.squre, ...{backgroundColor : data.item.color}}}>
                                <View style = {{alignItems : 'center'}}>
                                    <Text style = {{fontSize : hp('2%'),fontWeight : 'bold', marginTop : hp('0.2%'),color : 'black'}}>{data.item.x}</Text>
                                </View>
                            </Card>
                            <Text style = {{fontSize : hp('2%'), fontWeight : 'bold',marginLeft : wp('3%'),color : 'black'}}>{data.item.Name}</Text>
                        </View> 
                        <View style = {{flex : 1,marginTop : hp('2%'),alignItems : 'flex-end'}}>
                            <View style = {{flexDirection : 'row',marginRight : wp('3%')}}>
                                <Text style = {{fontSize : hp('2.5%'),color : 'red',marginRight : wp('1%')}}>{data.item.y}</Text>
                                <FontAwesome name="rupee" size={hp('2.5%')} color="red" style={Styles.icon} />
                            </View>
                        </View>
                    </View>
                </TouchableNativeFeedback>
            </Card>
        )
    }

    return(
        <View style = {{flex : 1}}>
            <SubHeader 
                Name = {Name}
                onPress = {() => props.navigation.navigate('MainC')}
            />
            

            <View>
                <VictoryPie
                    colorScale = {colors}
                    data={graph}
                    width={hp('40%')}
                    height={hp('50%')}
                    innerRadius={hp('10%')}
                    padAngle = {wp('1%')}
                    style={{
                        labels: {
                            fill: 'black', fontSize: hp('1.8%'), padding: 5,fillOpacity : 0.5
                        },
                        parent  : {
                            marginTop : Dimensions.get('screen').width<400?-hp('7%') : -hp('9%'),
                            alignItems : 'center',
                            resizeMode : 'contain'
                        }
                    }}
                    /> 
            </View>

            <View style = {{position : 'absolute', top : hp('25%'), left : wp('42%')}}>
                <Text style = {{fontSize : hp('3.5%'), color : '#154293', fontWeight :'bold'}}>{total} <FontAwesome name="rupee" size={hp('3.2%')} color="#154293"  /></Text>
            </View>

            <View style = {{marginTop : -hp('5%'),flex : 1}}>
                <FlatList 
                    data = {graph}
                    keyExtractor = {(item,index)=>index.toString()}
                    renderItem = {render}
                    showsVerticalScrollIndicator = {false}
                />
            </View>
        </View>
    )
}