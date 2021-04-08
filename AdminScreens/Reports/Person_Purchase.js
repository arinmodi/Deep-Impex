import React, { useState, useEffect } from 'react';
import { View, ToastAndroid, Text,Image, ScrollView, FlatList } from 'react-native';
import  moment from 'moment';
import { PhtmlContent } from '../Component/Purchase_Person_Report';
import { firestore, database } from '../../config/config';
import Loding from '../../Component/Loading';
import { Store_Report, createPDF, savetostoarge, Fileui, Nodata, Icon, Date_Modal } from '../Component/Report_functions';
import { connect } from 'react-redux';
import { Fetch_Person_Purchase_Reports } from '../../App-Store/Actions/Reports';
import Load from '../../Component/loaddata';
import Confirmation from '../../Component/ConfirmationModal';
import { Card } from 'react-native-paper';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

function Person_Purchase_Report(props){

    const [ show, setshow ] = useState(false); 
    const [ show2, setshow2 ] = useState(false); 
    const [ date , setdate ] = useState(new Date());
    const [ date2 , setdate2 ] = useState(new Date());
    const [ datevalid, setvalid ] = useState(false);
    const [ datevalid2, setvalid2 ] = useState(false);
    const [ modal, setmodal ] = useState(false);
    const [ selecteduser, setselecteduser ] = useState([]);
    const [ process, setprocess ] = useState(0);
    const [ process2, setprocess2 ] = useState(0);
    const [ load, setload ] = useState(true);
    const [ selecteddata, setselecteddata ] = useState('');
    const [ deletem, setdeletem ] = useState(false);

    useEffect(() => {
        Get_Reports();
        setload(false);
    }, []);

    const Get_Reports = () => {
        setload(true);
        props.Fetch_Reports_P();
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
        const ref = firestore.collection('Orders');
        const date1 = new Date(date);
        const date_2 = new Date(date2);

        Hidemodal();
        console.log(date1, date_2);
        const query = ref.where('Date', ">=" , date1).where('Date' , "<=" , date_2);
        var Order_data = [];

        await query.get().then(data2 => {
            data2.docs.forEach(data => {
                Order_data.push({
                    Name : data.data().Name,
                    Date : data.data().Date,
                    id : data.id
                })
            })
        })

        await Generateitemdata(Order_data).then((data) => PDFcreation(data, date1, date_2));
    }

    const Generateitemdata = async (orderdata) => {

        const ref = firestore.collection('Orders');
        var reportdata = [];

        for(var data in orderdata){
            const element = orderdata[data];
            const empid = selecteduser.uid;
            var credit = 0;
            var debit = 0;
            var rem = 0;
            var PreBal = 0;
            var purchase = 0;
            var wallet = 0;
            const empref = ref.doc(element.id).collection('Employees');

            await empref.doc(empid).get().then((ddata) => {
                if(ddata.exists){
                    var edata = ddata.data();

                    return(
                        credit = edata.Credit,
                        debit = edata.Debit,
                        rem = edata.Balance,
                        PreBal = edata.Extra ? edata.Extra : 0,
                        purchase = edata.Total_Purchased,
                        wallet = edata.wallet
                    )
                }
            })

            const ordererf = ref.doc(element.id).collection('Items').doc('All_Items');
            var itemsdata = [];
            console.log('Called1')
            await ordererf.get().then( async (orderitems) => {
                console.log('Called2')
                const items = orderitems.data();
                var SrNo = 1;
                console.log('Called3')
                for(var item in items){
                    const obj = items[item];
                    if(obj.empid === empid){
                        if(obj.Rate){
                            itemsdata.push({
                                Name :obj.Name,
                                Quantity : obj.Quantity,
                                Rate : obj.Rate,
                                SrNo : SrNo,
                                Total : parseFloat(obj.Rate * obj.Quantity),
                                Unit : obj.Unit,
                                credit : obj.Credit > 0 ? obj.Credit : 0,
                                debit : obj.Debit > 0 ? obj.Debit : 0,
                            });
                            SrNo = SrNo + 1;
                        }
                    }
                }
            });

            if(itemsdata.length > 0 ){
                var date = (element.Date).toDate();
                date = moment(date).format('DD/MM/YYYY')
                reportdata.push({
                    Name : element.Name,
                    Date : date,
                    Items : itemsdata,
                    Credit : credit,
                    Debit : debit,
                    purchase : purchase,
                    PreBal : PreBal,
                    Rem : rem,
                    wallet : wallet,
                    UserName : selecteduser.UserName
                })
            }
                    
        }

        return reportdata;
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
            const data = await createPDF(report,PhtmlContent);
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
        await Store_Report(url,filename,'Person_Purchase_Reports');
        setprocess(0);
        ToastAndroid.show('Report Sucesfully Created', ToastAndroid.LONG);
    };

    const downloadFile = async (uri, name) => {
        setprocess2(2);
        await savetostoarge(uri,name).then(() => {
            setprocess2(0);
        });
    }

    const onReport = (uri,name) => {
        props.navigation.navigate({routeName : 'View' , params : {
           uri : uri, name : name
        }});
    }

    const deletepress = (id) => {
        console.log(id)
        setdeletem(true);
        setselecteddata(id);
    }
    
    const HidemodalD = () => {
        setdeletem(false);
        setselecteduser([]);
    }

    const Delete = async () => {
        await database.ref('Person_Purchase_Reports').child(selecteddata).remove();
        HidemodalD();
        ToastAndroid.show("file Deleted", ToastAndroid.LONG);
    }

    const onUserSelect = (data) => {
        console.log(data)
        setselecteduser(data);
        setmodal(true);
    }

    return(
        <View style = {{flex : 1}}>
            {props.Done_p_P === false ? (
                <ScrollView showsVerticalScrollIndicator = {false}>
                    <View>
                        <FlatList 
                            data = {props.Users}
                            keyExtractor = {(item,index)=>index.toString()}
                            showsHorizontalScrollIndicator={false}
                            style = {{width : wp('100%')}}
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
                        {props.Reports_P.length > 0 ? (
                            <Fileui 
                                data = {props.Reports_P}
                                onReport = {(file,name) => onReport(file,name)}
                                downloadFile = {(file,name) => downloadFile(file,name)}
                                deletpress = {(id) => deletepress(id)}
                            />
                        ):(
                            <Nodata style = {{marginTop : hp('2%')}}/>
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
        Fetch_Reports_P : () => { dispatch(Fetch_Person_Purchase_Reports()) },
    }
}

const mapStateToProps = (state) => {
    return {
       Reports_P : state.Reports.P_Purchase,
       Done_p_P : state.Reports.Done_P_P,
       Users : state.Users.User_Data
    }
}

export default connect(mapStateToProps , mapDispatchToProps)(Person_Purchase_Report);