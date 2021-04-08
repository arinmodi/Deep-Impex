import React from 'react';
import { View, Text, StyleSheet,FlatList,TouchableOpacity } from 'react-native';
import {
    widthPercentageToDP as wp, 
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import Grid from '../Component/OrdersGrid';
import { database, f } from '../config/config';
import { Render } from '../Component/Unique_Image';
import Load from '../Component/loaddata';
import { Feather } from '../Icons/icons';

export default class History extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            History : [],
            loading : true,
            count : 30
        }
    }

    fetch_User_History = async (count) => {
        const uid = f.auth().currentUser.uid;
        this.setState({
            History : [],
            loading : true
        })

        await database.ref('Accepted_Employee').child(uid).child('History').orderByChild('Date').limitToLast(count).once('value').then(data => {
            var localdata = [];
            data.forEach(value => {
                var image = Render();
                localdata.push({
                    id : value.key,
                    Balance : value.val().Balance,
                    Credit : value.val().Credit,
                    Debit : value.val().Debit,
                    Total_Purchase : value.val().Total_Purchased,
                    Credit_Paid : value.val().Credit_Paid,
                    Name : value.val().Name,
                    Date : value.val().Date,
                    Image : image,
                    wallet : value.val().wallet,
                })
            })
            this.setState({
                History : localdata.reverse(),
                loading : false
            })
        })
    }

    componentDidMount = async () => {
        await this.fetch_User_History(30)
    }

    onMore = async () => {
        this.setState({ count : this.state.count + 30 })
        await this.fetch_User_History(this.state.count);
    }


    HistoryUI = (data) => {
        return(
            <Grid 
                uri = {data.item.Image}
                Name = {data.item.Name}
                Date = {data.item.Date}
                NavToBasket = {() => this.NavToAnalytics(data.item)}
            />
        )
    }

    NavToAnalytics = (data) => {
        this.props.navigation.navigate({routeName : 'Analytics', params : { data : data }})
    }

    render(){
        return(
            <View style={{flex:1,backgroundColor:'white'}}>
                <View style={styles.header}>
                    <Text style={styles.title}>History</Text>
                </View>

                {this.state.loading === false ? (
                <View style = {{flex : 1}}>
                    {this.state.History.length > 0 ? (
                        <FlatList
                            style={{marginBottom:hp('0.5%')}}
                            numColumns = {2}
                            renderItem={this.HistoryUI}
                            data={this.state.History}
                            keyExtractor = {(item,index)=>index.toString()}
                            ListFooterComponent = {
                                <View style = {{marginTop : hp('4%')}}>
                                    <TouchableOpacity activeOpacity = {0.5} onPress = {() => this.onMore()}>
                                        <Text style = {{textAlign : 'center',color : 'blue',fontSize : hp('2.5%')}}>More</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        />
                    ):(
                        <View style = {{flex : 1, alignItems : 'center',justifyContent : 'center'}}>
                            <Feather name="shopping-bag" size={hp('15%')} color="#A9A9B8" />
                            <Text style = {{fontSize : hp('2.5%'),color : '#A9A9B8',marginTop : hp('2%')}}>All of Your Purchase</Text>
                            <Text style = {{fontSize : hp('2.5%'),color : '#A9A9B8',marginTop : hp('1%')}}>Will list here</Text>
                        </View>
                    )}
                </View>
                ):(
                    <Load 
                        style = {{flex : 1}}
                    />
                )}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header:{
        height:hp('10%'),
        backgroundColor:'#154293',
        alignItems:'center',
        justifyContent : 'center'
    },
    title : {
        fontSize:hp('3%'),
        color:'white',
    },
})