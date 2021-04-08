import React, { useState, useEffect } from 'react';
import { View, ToastAndroid } from 'react-native';
import  moment from 'moment';
import { htmlContent } from '../Component/creditpdflayout';
import { firestore, database,auth } from '../../config/config';
import Loding from '../../Component/Loading';
import { Store_Report, createPDF, savetostoarge, Fileui, Nodata, Icon, Date_Modal } from '../Component/Report_functions';
import { connect } from 'react-redux';
import { Fetch_Credit_Reports } from '../../App-Store/Actions/Reports';
import Load from '../../Component/loaddata';
import Confirmation from '../../Component/ConfirmationModal';

function T_Credit(props){

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
    }, [])

    const Get_Reports = async () => {
        setload(true);
        props.Fetch_Credit_Reports();
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
        var Credit_data = [];

        await query.get().then(data2 => {
            data2.docs.forEach(data => {
                Credit_data.push({
                    Name : data.data().Name,
                    Date : data.data().MainDate,
                    id : data.id
                })
            })
        })

        await Generatecreditdata(Credit_data, ref).then((data) => PDFcreation(data, date1, date_2));
    };

    const removeduplicate = (data) => {
        return data.filter((value, index) => data.indexOf(value) === index);
    }

    const Generatecreditdata = async (creditdata, ref) => {
        const dbref = database.ref('Accepted_Employee');
        var reportdata = [];

        for(var data in creditdata){
            const element = creditdata[data];
            const creditref = ref.doc(element.id).collection('Employees_Credits');
            var creddata = [];
            var PresonNames = [];
            var creditperonsdata = [];
            var employecreditdata = [];
            var Total = 0;
            var SrNo = 1;
            var Credit_Index = 1;
            var Employee_Index = 1;

            await creditref.get().then(async doc => {
                await Promise.all(doc.docs.map(async (res) => {
                    const credits = res.data();
                    var total = 0;
                    var name;
                    Total = Total + credits.Total;
                    total = credits.Total;
                    await  dbref.child(credits.empid).once('value').then((data) => name = data.val().UserName)
                    console.log("Name" + name);
                    for(var credit in credits){
                        const obj = credits[credit];
                        if(obj.PersonName){
                            creddata.push({
                                Name :obj.Name,
                                SrNo : SrNo,
                                Amount : obj.Amount,
                                PersonName : obj.PersonName,
                                By : name
                            })

                            PresonNames.push(obj.PersonName);
                            SrNo = SrNo + 1;
                        }
                    }
                    employecreditdata.push({
                        SrNo : Employee_Index,
                        Name : name,
                        Amount : total,
                    })
                    Employee_Index = Employee_Index + 1;
                }))

            });

            PresonNames = removeduplicate(PresonNames);
            PresonNames.forEach(element => {
                const onePresonCredits = creddata.filter(data => { return data.PersonName === element } );
                const onePersonTotal = findsum(onePresonCredits, 'Amount');
                creditperonsdata.push({
                    SrNo : Credit_Index,
                    Name : element,
                    Amount : onePersonTotal
                })

                Credit_Index = Credit_Index + 1;
            });

            var date = (element.Date).toDate();
            date = moment(date).format('DD/MM/YYYY')
            reportdata.push({
                Name : element.Name,
                Date : date,
                credits :  creddata,
                Total : Total,
                credperondata : creditperonsdata,
                employeedata : employecreditdata
            })
        }

        return reportdata;
    };

    const findsum = (items, prop) => {
        return items.reduce((a,b) => {
            return a + b[prop]
        },0)
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
        await Store_Report(url,filename,'Credit_Reports');
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
        await database.ref('Credit_Reports').child(selecteddata).remove();
        HidemodalD();
        ToastAndroid.show("file Deleted", ToastAndroid.LONG);
    }

    return(
        <View style = {{flex : 1}}>
            {props.Done === false ? (
                <View> 
                    {props.T_Reports.length > 0 ? (
                        <Fileui 
                            data = {props.T_Reports}
                            onReport = {(file,name) => onReport(file,name)}
                            downloadFile = {(file,name) => downloadFile(file,name)}
                            deletpress = {(id) => deletepress(id)}
                        />
                    ):(
                        <Nodata />
                    )}

                    <Icon onPress = {() => setmodal(true) }/>

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
                ) : ( 
                    <Load style = {{flex : 1}}/> 
                )
            }
        </View>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        Fetch_Credit_Reports : () => { dispatch(Fetch_Credit_Reports()) },
    }
}

const mapStateToProps = (state) => {
    return {
       T_Reports : state.Reports.T_Credits,
       Done : state.Reports.Done_T
    }
}

export default connect(mapStateToProps , mapDispatchToProps)(T_Credit);