import React from 'react';
import { View, Text, StyleSheet,Dimensions,Image, FlatList, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Fetch_News_Data } from '../App-Store/Actions/News';
import { connect } from 'react-redux';
import moment from 'moment';
import { firestore, f } from '../config/config';
import Loaddata from '../Component/loaddata';
import { fetch_Order_id  } from '../Component/functions/Order_Details';
import { FontAwesome } from '../Icons/icons';

class News extends React.Component{

    constructor(){
        super();
        this.state = {
            user : false,
            loading : true,
            refreshing : false,
            refresh : false,
        }
    }

    componentDidMount = () => {
        this.checkuser();
        this.props.Fetch_News_Data();
        this.setState({ 
            loading : false
        })
    }

    checkuser = async () => {
        const empid = f.auth().currentUser.uid;
        const details = await fetch_Order_id();

        if(details !== false){
            const ref = firestore.collection("Orders").doc(details.id).collection('Employees');

            await ref.doc(empid).get().then(data => {
                if(data.exists){
                    this.setState({user : true})
                }else{
                    console.log('Not exist')
                }
            })

        }else{
            console.log('Not');
        }
    }

    onRefresh = async () => {
        this.setState({ refreshing : true });
        this.props.Fetch_News_Data();
        await this.checkuser();
        this.setState({ refreshing : false });
    }

    refresh = () => {
        console.log('called')
        this.props.Fetch_News_Data();
    }

    render(){

        const onPress = (data) => {
            if(this.state.user === true){
                this.props.navigation.navigate({ routeName : 'News_Purchase', params : {data : data} })
            }else{
                alert('do not have balance')
            }
        }

        function Render(data){
            return(
                <View style = {{flex : 1}}>
                    <Card style={styles.card}>
                        <Image source={{uri:data.item.Image}} style={{...styles.image,...{borderRadius : wp('3%'),borderWidth : 1.5,resizeMode : 'contain'}}}/>
                        <View style={{marginLeft:hp('18%'),marginTop:-hp('12%')}}>
                            <View style = {{flexDirection : 'row'}}>
                                <Text style={{...styles.Name,...{fontSize : hp('2.5%'),width : wp('50%'),color : 'black'}}}>{data.item.Name}</Text>
                                <Text style={{...styles.Name,...{fontSize : hp('2.2%'),fontWeight : 'bold',color : 'black'}}}>{data.item.Quantity} {data.item.Unit}</Text>
                            </View>
                            <View style = {{height : hp('8%')}}>
                                <Text style={styles.News}>{data.item.annonation}</Text>
                            </View>
                        </View>
                        <View style = {{flexDirection : 'row'}}>
                            <View style = {{marginTop : hp('2%'),marginLeft : wp('5%')}}>
                                <Text style = {{fontWeight : 'bold',color : 'black'}}>{moment(data.item.Date.toDate()).format('DD/MM/YYYY')}</Text>
                            </View>
                            <View style = {{marginTop : hp('2%'),alignItems : 'flex-end',flex : 1,marginRight : wp('5%')}}>
                                <TouchableOpacity activeOpacity = {0.5} onPress = {() => onPress(data.item)}>
                                    <View style = {{flexDirection : 'row',width : wp('15%'),justifyContent : 'space-between',backgroundColor : 'blue',borderRadius : wp('2%'),height : hp('4%'),alignItems : 'center'}}>
                                        <Text style = {{fontSize : hp('2.5%'),color : 'white',fontWeight : 'bold',marginLeft : wp('3%')}}>Buy</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Card>  
                </View>
            )
        }

        return(
            <View style = {{flex : 1}}>
                {this.state.loading === false ? ( 
                    <View style = {{flex : 1}}>
                        {this.props.News.length > 0? (
                            <View>
                                <FlatList
                                    renderItem={Render}
                                    keyExtractor = {(item,index)=>index.toString()}
                                    data={this.props.News}
                                    refreshing = {this.state.refresh}
                                    onRefresh = {this.onRefresh}
                                />
                            </View>
                        ):(
                            <ScrollView refreshControl = { <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} /> }>
                                <FontAwesome name="newspaper-o" size={hp('10%')} color="#A9A9B8" style = {{alignSelf : 'center',marginTop : hp('20%')}}/>
                                <Text style = {{textAlign : 'center', fontSize : hp('2.5%'), fontWeight : 'bold',marginTop : hp('2%'),color:"#A9A9B8"}}>Not find any News</Text>
                            </ScrollView>
                        )}
                    </View>
                ):(
                    <Loaddata 
                        style = {{flex : 1}}
                    />
                )}
            </View>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        Fetch_News_Data : () => { dispatch(Fetch_News_Data()) },
    }
}

const mapStateToProps = (state) => {
    return {
       News : state.News.News_Data
    }
}

export default connect(mapStateToProps , mapDispatchToProps)(News);

export const styles=StyleSheet.create({
    image:{
        width:Dimensions.get('screen').width<400?wp('23%'):wp('20%'),
        height:hp('12%'),
        borderRadius:Dimensions.get('screen').width<400?wp('23%')/2:wp('20%')/2, 
        marginTop:hp('3.5%'),
        marginHorizontal:wp('4%'),
        borderColor:'black',
        borderWidth:0.5,
    },
    card:{
        flexDirection:'row',
        height:hp('22%'),
        elevation:5,
        borderBottomWidth:0.4,

    },
    Name:{
        fontSize:hp('2.5%')
    },
    News:{
        marginTop:hp('2%'),
        color:'grey',
        width:wp('60%'),
        fontSize:hp('2%')
    }
})