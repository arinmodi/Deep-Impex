import React from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { Card } from 'react-native-paper';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Ionicons } from '../Icons/icons';
import { Styles } from '../AdminScreens/Place_Order_Screens/BasketItem';

function Pending(props){

    const data = props.navigation.getParam('Data');
    const Name = props.navigation.getParam('OrderName');
    console.log(Name)

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
                        <View style={Styles.itemRate}>
                            <Text style={{...Styles.itemtext, ...{fontWeight : 'normal'}}}>{data.item.Quantity} {data.item.Unit}</Text>
                        </View>
                    </View>
                </Card>
            </View>
        )
    }

    const onBack = () => {
        props.navigation.navigate('Main');
    }

    return(
        <View>
            <View style = {{flexDirection : 'row',height : hp('10%'), backgroundColor : '#154293',alignItems : 'center'}}>
                <Ionicons name="md-arrow-back" size={hp('4%')} color="white" style = {{marginHorizontal : wp('4%')}} onPress = {onBack}/>
                <View style = {{flex : 1, alignItems : 'center',marginLeft : -wp('10%')}}>
                    <Text style = {{fontSize : hp('2.5%'), color : 'white'}}>{Name}</Text>
                </View>
            </View>

            {data.length !== 0 ? (
                <View>
                    <View>
                        <FlatList
                            style={{marginBottom:hp('20%')}}
                            keyExtractor = {(item,index)=>index.toString()}
                            renderItem={FlatListRender}
                            numColumns = {2}
                            data={data}
                        />
                    </View>
                </View>
            ) : (
                <View>
                    <View style = {{marginTop : hp('20%') , alignItems : 'center',elevation : 20}}>
                        <Image source = {require('../assets/No_Pending_Item.png')} style = {{height : hp('25%'), width : hp('25%'),resizeMode : 'contain'}}/>
                    </View>
                    <Text style = {{color : '#154293',fontSize : hp('3%'),fontWeight : 'bold',marginTop : hp('3%'),textAlign : 'center'}}>Congrates!</Text>
                    <Text style = {{fontSize : hp('2.5%'),textAlign : 'center', fontWeight : 'bold',color : 'black'}}>All Items were purchased</Text>
                </View>
            )}
        </View>
    )
} 

export default Pending;