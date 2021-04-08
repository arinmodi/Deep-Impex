import React, { useState, useEffect } from 'react';
import { View, Text, ToastAndroid, FlatList, Image, ScrollView } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import  moment from 'moment';
import { Card } from 'react-native-paper';
import { htmlContent } from '../Component/Person_Credit_Layout';
import { firestore, database } from '../../config/config';
import Loding from '../../Component/Loading';
import { Store_Report, createPDF, savetostoarge, Fileui, Nodata, Icon, Date_Modal } from '../Component/Report_functions';
import { connect } from 'react-redux';
import { Fetch_User_Data } from '../../App-Store/Actions/Users';
import { Fetch_Person_Credit_Reports } from '../../App-Store/Actions/Reports';
import Load from '../../Component/loaddata';
import Confirmation from '../../Component/ConfirmationModal';

export function P_Credit(props){

    const [ show, setshow ] = useState(false); 
    const [ show2, setshow2 ] = useState(false); 
    const [ date , setdate ] = useState(new Date());
    const [ date2 , setdate2 ] = useState(new Date());
    const [ datevalid, setvalid ] = useState(false);
    const [ datevalid2, setvalid2 ] = useState(false);
    const [ modal, setmodal ] = useState(false);
    const [ process, setprocess ] = useState(0);
    const [ process2, setprocess2 ] = useState(0);
    const [ selecteduser, setselecteduser ] = useState([]);
    const [ load, setload ] = useState(true);
    const [ selecteddata, setselecteddata ] = useState('');
    const [ deletem, setdeletem ] = useState(false);


    useEffect(() => {
        Get_Data();
        setload(false);
    }, [])


    const Get_Data = async () => {
        setload(true);
        props.Fetch_Person_Credit_Reports();
        props.Fetch_User_Data();
    }


    const onChange = (event, selectedDate) => {
        console.log(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
        var newdate = new Date(selectedDate);
        if(newdate.getTime() >= new Date().getTime()){
            alert('select proper date');
            setshow(false);
        }else {
            setshow(false);
            setdate(selectedDate);
            setvalid(true);
        }
    };

    const onChange2 = (event, selectedDate) => {
        var newdate = new Date(selectedDate);
        if(newdate.getTime() >= new Date().getTime()){
            alert('select proper date');
            setshow2(false);
        }else {
            setshow2(false);
            setdate2(selectedDate);
            setvalid2(true);
        }
    };

    const onPress = async () => {
        console.log('Called')
        if(datevalid && datevalid2){
           await GenerateData();
        }else{
            alert('Please select proper Dates');
        }
    }

    const GenerateData = async () => {
        setprocess(2);
        const ref = firestore.collection('Credits');
        const date1 = new Date(date);
        const date_2 = new Date(date2);

        Hidemodal();
        console.log(date1, date_2);
        const query = ref.where('MainDate', ">=" , date1).where('MainDate' , "<=" , date_2);
        var Order_data = [];

        await query.get().then(data2 => {
            data2.docs.forEach(data => {
                Order_data.push({
                    Name : data.data().Name,
                    Date : data.data().MainDate,
                    id : data.id
                })
            })
        })

        await Generateitemdata(Order_data, ref).then((data) => PDFcreation(data, date1, date_2));
    }

    const Generateitemdata = async (orderdata, ref) => {
        var creditreportdata = [];

        for(var data in orderdata){
            const element = orderdata[data];
            const crediterf = ref.doc(element.id).collection('Employees_Credits').doc(selecteduser.uid);
            var userdata = [];
            var total = 0;
            await crediterf.get().then((credits) => {
                if(credits.exists){
                    const credit = credits.data();
                    total = credit.Total;
                    var SrNo = 1;
                    for(var onecredit in credit){
                        const obj = credit[onecredit];
                        if(obj.PersonName){
                            userdata.push({
                                Name :obj.Name,
                                SrNo : SrNo,
                                Amount : obj.Amount,
                                PersonName : obj.PersonName
                            })

                            SrNo = SrNo + 1;
                        }
                    }
                }
            });


            if(userdata.length > 0){
                var date = (element.Date).toDate();
                date = moment(date).format('DD/MM/YYYY');
                creditreportdata.push({
                    Name : element.Name,
                    Date : date,
                    total : total,
                    credits : userdata,
                    PName : selecteduser.UserName
                })
            }
        }

        return creditreportdata;
    };


    const Hidemodal = () => {
        setshow(false);
        setshow2(false);
        setdate(new Date());
        setdate2(new Date());
        setvalid(false);
        setvalid2(false);
        setmodal(false);
    }

    const PDFcreation = async (report, date1, date2) => {

        if(report.length <= 0){
            alert('Data Not found for selected dates');
            setprocess(0);
        }else{
            const data = await createPDF(report,htmlContent);
            if(data !== null && data !== false && data){
                Upload_Report(data,date1, date2);
            }else{
                alert('something bad happen, try again');
                setprocess(0);
            }
        }
    };

    const Upload_Report = async (uri, date1, date2) => {
        const url = uri.uri;
        const datefrom = moment(date1).format('DD-MM-YYYY');
        const dateTo = moment(date2).format('DD-MM-YYYY');
        const filename = selecteduser.UserName + ' - ' + datefrom + ' To ' + dateTo;
        await Store_Report(url,filename,'Person_Credit_Reports');
        setprocess(0);
        ToastAndroid.show('Report Sucesfully Created', ToastAndroid.LONG);
    };

    const downloadFile = async (uri, name) => {
        setprocess2(2);
        await savetostoarge(uri,name);
        setprocess2(0);
    }
    
    const onReport = (uri,name) => {
        props.navigation.navigate({routeName : 'View' , params : {
           uri : uri, name : name
        }})
    };

    const onUserSelect = (data) => {
        setselecteduser(data);
        setmodal(true);
    }

    const deletepress = (id) => {
        console.log(id)
        setdeletem(true);
        setselecteddata(id);
    }
    
    const HidemodalD = () => {
        setdeletem(false);
        setselecteddata('');
    }

    const Delete = async () => {
        await database.ref('Person_Credit_Reports').child(selecteddata).remove();
        HidemodalD();
        ToastAndroid.show("file Deleted", ToastAndroid.LONG);
    }

    return(
        <View style = {{flex : 1}}>
            {props.Done === false ? (
                <ScrollView showsVerticalScrollIndicator = {false}>
                    <View>
                        <FlatList 
                            data = {props.Users}
                            keyExtractor = {(item,index)=>index.toString()}
                            showsHorizontalScrollIndicator={false}
                            horizontal = {true}
                            renderItem = { (data) => 
                                <Card style = {{height : hp('15%'), width : wp('22.5%'),marginHorizontal: wp('1.5%'),marginTop : hp('2.5%'),elevation : 10,marginBottom : hp('2%')}} onPress = {() => onUserSelect(data.item)}>
                                    <View style = {{alignItems : 'center'}}>
                                        <Image source = {{uri : data.item.ProfileImage}} style = {{height : hp('5%'),width : hp('5%'),borderRadius : hp('5%'),marginTop : hp('2%')}}/>
                                        <Text style = {{marginTop : hp('1%'), fontSize : hp('2%'),marginHorizontal : wp('4%'),color : 'black'}}>{data.item.UserName}</Text>
                                    </View>
                                </Card>
                            }
                        />
                    </View>

                    <View>
                        {props.P_Reports.length > 0 ? (
                            <Fileui 
                                data = {props.P_Reports}
                                onReport = {(file,name) => onReport(file,name)}
                                downloadFile = {(file,name) => downloadFile(file,name)}
                                deletpress = {(id) => deletepress(id)}
                            />
                        ):(
                            <Nodata style = {{marginTop : hp('10%')}}/>
                        )}
                    </View>



                    <Loding 
                        isVisible = {process > 0}
                        data = "Generating..."
                    />

                    <Loding 
                        isVisible = {process2 > 0}
                        data = "Downloading..."
                    />

                    <Date_Modal 
                        isVisible = {modal}
                        onBackButtonPress = {() => Hidemodal()}
                        onBackdropPress = {() => Hidemodal()}
                        onFromDatePress = {() => setshow(true)}
                        onToDatePress = {() => setshow2(true)}
                        show = {show}
                        show2 = {show2}
                        minimumDate1 = {new Date(2020, 11, 1)}
                        minimumDate2 = {new Date(date)}
                        onChange = {onChange}
                        onChange2 = {onChange2} 
                        oncancel1 = {() => setshow(false)}
                        oncancel2 = {() => setshow2(false)}
                        onPress = {() => onPress()}
                        date1 = {moment(date).format('DD/MM/YYYY')}
                        date2 = {moment(date2).format('DD/MM/YYYY')}
                    />


                    <Confirmation 
                        isVisible = {deletem}
                        onBackButtonPress = {() => HidemodalD()}
                        onBackdropPress = {() => HidemodalD()}
                        question = {"Are You Sure, Want To Delete"}
                        onPressYes = {() => Delete()}
                        onPressNo = {() => HidemodalD()}
                    />
                </ScrollView>
                ):(
                    <Load style = {{flex : 1}}/>
                )
            }
        </View>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        Fetch_Person_Credit_Reports  : () => { dispatch(Fetch_Person_Credit_Reports()) },
        Fetch_User_Data : () => { dispatch(Fetch_User_Data()) },
    }
}

const mapStateToProps = (state) => {
    return {
       P_Reports : state.Reports.P_Credits,
       Users : state.Users.User_Data,
       Done : state.Reports.Done_P
    }
}

export default connect(mapStateToProps , mapDispatchToProps)(P_Credit);