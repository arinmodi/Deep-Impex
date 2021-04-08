import React, { useState, useEffect } from 'react';
import { View, ToastAndroid } from 'react-native';
import  moment from 'moment';
import { htmlContent } from '../Component/pdflayout';
import { firestore, database } from '../../config/config';
import Loding from '../../Component/Loading';
import { Store_Report, createPDF, savetostoarge, Fileui, Nodata, Icon, Date_Modal } from '../Component/Report_functions';
import { connect } from 'react-redux';
import { Fetch_Reports } from '../../App-Store/Actions/Reports';
import Load from '../../Component/loaddata';
import Confirmation from '../../Component/ConfirmationModal';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

function Purchase_Report(props){

    const [ show, setshow ] = useState(false); 
    const [ show2, setshow2 ] = useState(false); 
    const [ date , setdate ] = useState(new Date());
    const [ date2 , setdate2 ] = useState(new Date());
    const [ datevalid, setvalid ] = useState(false);
    const [ datevalid2, setvalid2 ] = useState(false);
    const [ modal, setmodal ] = useState(false);
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
        props.Fetch_Reports();
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
                    Wallet : data.data().Wallet,
                    id : data.id
                })
            })
        })

        await Generateitemdata(Order_data, ref).then((data) => PDFcreation(data, date1, date_2));
    }

    const Generateitemdata = async (orderdata, ref) => {
        var reportdata = [];
        const dbref = database.ref('Accepted_Employee');

        for(var data in orderdata){
            const element = orderdata[data];
            const ordererf = ref.doc(element.id).collection('Items').doc('All_Items');
            var itemsdata = [];
            var total_credit = 0;
            var total_debit = 0;
            console.log('Called1')
            await ordererf.get().then( async (orderitems) => {
                console.log('Called2')
                const items = orderitems.data();
                var SrNo = 1;
                console.log('Called3')
                for(var item in items){
                    const obj = items[item];
                    if(obj.Rate){
                        var name;
                        await  dbref.child(obj.empid).once('value').then((data) => name = data.val().UserName);
                        var UserName = name.split(" ");
                        UserName = UserName[0];
                        obj.Credit > 0 ? total_credit += obj.Credit : null;
                        obj.Debit > 0 ? total_debit += obj.Debit : null;
                        itemsdata.push({
                            Name :obj.Name,
                            Quantity : obj.Quantity,
                            Rate : obj.Rate,
                            SrNo : SrNo,
                            Total : parseFloat(obj.Rate * obj.Quantity),
                            Unit : obj.Unit,
                            By : UserName,
                            credit : obj.Credit > 0 ? obj.Credit : 0,
                            debit : obj.Debit > 0 ? obj.Debit : 0,
                        });
                        SrNo = SrNo + 1;
                    }
                }
            })
            var date = (element.Date).toDate();
            date = moment(date).format('DD/MM/YYYY')
            reportdata.push({
                Name : element.Name,
                Date : date,
                Wallet : element.Wallet,
                Items : itemsdata,
                Credit : total_credit,
                Debit : total_debit
            })
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
        const filename = datefrom + ' To ' + dateTo;
        await Store_Report(url,filename,'Reports');
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
        setselecteddata('');
    }

    const Delete = async () => {
        await database.ref('Reports').child(selecteddata).remove();
        HidemodalD();
        ToastAndroid.show("file Deleted", ToastAndroid.LONG);
    }

    return(
        <View style = {{flex : 1}}>
            {props.Done === false ? (
                <View>
                    {props.Reports.length > 0 ? (
                        <Fileui 
                            data = {props.Reports}
                            onReport = {(file,name) => onReport(file,name)}
                            downloadFile = {(file,name) => downloadFile(file,name)}
                            deletpress = {(id) => deletepress(id)}
                        />
                    ):(
                        <Nodata />
                    )}

                    <Icon onPress = {() => setmodal(true) } style = {{top : hp('60%')}}/>
            
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

                </View>
            ):(
                <Load style = {{flex : 1}}/>
            )}
        </View>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        Fetch_Reports : () => { dispatch(Fetch_Reports()) },
    }
}

const mapStateToProps = (state) => {
    return {
       Reports : state.Reports.Reports_Data,
       Done : state.Reports.Done_R
    }
}

export default connect(mapStateToProps , mapDispatchToProps)(Purchase_Report);