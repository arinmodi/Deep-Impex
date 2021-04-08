import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet,Dimensions,Image, FlatList, RefreshControl, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import Load from '../Component/loaddata';
import { FontAwesome, Fontisto } from '../Icons/icons';
import { fetch_Order_id  } from '../Component/functions/Order_Details';
import { connect } from 'react-redux';

function PP(props){

    const [ refreshing, setrefreshing ] = useState(false);
    const [ Orderid, SetOrderid ] = useState('');
    const [ loading, Setloading ] = useState(true);

    const LoadEmp = async () => {
        const details = await fetch_Order_id();

        if(details !== false){
            SetOrderid(details.id);
            Setloading(false);
        }else{
            Setloading(false);
        }
    }

    useEffect(() => {
        LoadEmp()
    }, []);


    const onRefresh = () => {
        setrefreshing(true);
        LoadEmp();
        setrefreshing(false);
    }


    function Render(data){
        return(
            <View>
                <Card style={styles.card}>
                    <Image source={{uri:data.item.image}} style={styles.image}/>
                    <Text style={{textAlign:'center',marginTop:hp('1.5%'),fontSize:hp('2%'),color : 'black'}}>{data.item.Purchase} <FontAwesome name="rupee" size={hp('1.8%')} color="black" /></Text>
                    <Text style={{textAlign:'center',marginTop:hp('0.2%'),fontSize:hp('2%'),color : 'black'}}>Purchase</Text>
                </Card>  
            </View>
        )
    }

    if(loading === false){
        return(
            <View style = {{flex : 1}}>
                <View style = {{flex : 1}}>
                    {Orderid !== '' ? (
                        <View style = {{flex : 1}}>
                            {props.Load === false ? (
                                <View style = {{flex : 1}}>
                                    {Object.keys(props.Order_Status).length > 0 ?(
                                        <View style = {{flex : 1}}>
                                            {props.Order_Status.empdata.length === 0 ?(
                                                <View style = {{flex : 1}}>
                                                    <ScrollView refreshControl = { <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> }>
                                                        <Fontisto name="persons" size={hp('10%')} color="#A9A9B8" style = {{alignSelf : 'center',marginTop : hp('20%')}}/>
                                                        <Text style = {{textAlign : 'center', fontSize : hp('2.5%'), fontWeight : 'bold',marginTop : hp('2%'),color:"#A9A9B8"}}>No Sales Man Found</Text>
                                                    </ScrollView>
                                                </View>
                                            ):(
                                                <View style = {{flex : 1}}>
                                                    <View style = {{flex : 1}}>
                                                        <FlatList
                                                            renderItem={Render}
                                                            keyExtractor = {(item,index)=>index.toString()}
                                                            data={props.Order_Status.empdata}
                                                            numColumns={3}
                                                            refreshing = {refreshing}
                                                            onRefresh = {onRefresh}
                                                        />
                                                    </View>
                                                </View>
                                            )}
                                        </View>
                                    ):(
                                        <Load 
                                            style = {{flex : 1}}
                                        />
                                    )}
                                </View>
                            ):(
                                <Load 
                                    style = {{flex : 1}}
                                />
                            )}
                        </View>
                    ):(
                        <View style = {{flex : 1}}>
                            <ScrollView refreshControl = { <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> }>
                                <Fontisto name="persons" size={hp('10%')} color="#A9A9B8" style = {{alignSelf : 'center',marginTop : hp('20%')}}/>
                                <Text style = {{textAlign : 'center', fontSize : hp('2.5%'), fontWeight : 'bold',marginTop : hp('2%'),color:"#A9A9B8"}}>No Sales Man Found</Text>
                            </ScrollView>
                        </View>
                    )}
                </View>
            </View>
    )}else {
        return(
            <Load 
                style = {{flex : 1}}
            />
        )
    }
}

const styles=StyleSheet.create({
    image:{
        width:Dimensions.get('screen').width<400?wp('15%'):wp('13%'),
        height:hp('8%'),
        borderRadius:Dimensions.get('screen').width<400?wp('18%')/2:wp('16%')/2, 
        borderWidth:1,
        borderColor:'black', 
        marginTop:hp('1.5%')
    },
    card:{
        height:hp('20%'),
        marginHorizontal:wp('1.8%'),
        marginTop:hp('3%'),
        alignItems:'center',
        borderRadius:wp('5%'),
        width : wp('29.33%'),
        marginBottom : hp('1%')

    }
});


const mapStateToProps = (state) => {
    return {
       Order_Status : state.Order_status_reducer.Status_Data,
       Load : state.Order_status_reducer.Load
    }
}

export default connect(mapStateToProps)(PP);