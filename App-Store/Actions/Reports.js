import { database } from '../../config/config';

export const Reports = 'Report_Data';
export const P_Reports = 'P_Reports';
export const T_Credit_Report = 'T_Credit_Report';
export const P_Purchase_Report = 'P_Purchase_Report';

export const done_reports = 'done_reports';
export const done_p_reports = 'done_p_report';
export const done_t_reports = 'done_t_report';
export const done_p_p_reports = 'done_p_p_report'

export const set_done_reports = (value) => {
    return { type : done_reports, data : value };
}

export const set_done_p_reports = (value) => {
    return { type : done_p_reports, data : value };
}

export const set_done_t_reports = (value) => {
    return { type : done_t_reports, data : value };
}

export const set_done_p_p_reports = (value) => {
    return { type : done_p_p_reports, data : value };
}

export const Set_Reports = (Data) => {
    console.log(Data)
    return { type : Reports  , Data : Data }
};

export const Set_P_Reports = (Data) => {
    console.log(Data)
    return { type : P_Reports  , P_Data : Data }
};

export const Set_T_Credit_Report = (Data) => {
    console.log(Data)
    return { type : T_Credit_Report , T_Data : Data }
};

export const Set_P_Purchase_Report = (Data) => {
    console.log(Data)
    return { type : P_Purchase_Report , P_P_Data : Data }
};

export const Fetch_Reports = () => {
    return function(dispatch){
        var reportsdata = [];
        const ref = database.ref('Reports');
        ref.orderByChild('Date').on('value',
        function(data){
            reportsdata = [];
            data.forEach(value => {
                let report = value.val();
                reportsdata.push({
                    Name : report.Name,
                    file : report.file,
                    id : value.key
                })
            }),
            reportsdata.reverse();

            console.log(reportsdata)
            dispatch(Set_Reports(reportsdata));
            dispatch(set_done_reports(false));
        })
    }
};

export const Fetch_Credit_Reports = () => {
    return function(dispatch){
        var reportsdata = [];
        const ref = database.ref('Credit_Reports');
        ref.orderByChild('Date').on('value',
        function(data){
            reportsdata = [];
            data.forEach(value => {
                let report = value.val();
                reportsdata.push({
                    Name : report.Name,
                    file : report.file,
                    id : value.key
                })
            }),
            reportsdata.reverse();

            console.log(reportsdata)
            dispatch(Set_T_Credit_Report(reportsdata));
            dispatch(set_done_t_reports(false));
        })
    }
};

export const Fetch_Person_Credit_Reports = () => {
    return function(dispatch){
        var reportsdata = [];
        const ref = database.ref('Person_Credit_Reports');
        ref.orderByChild('Date').on('value',
        function(data){
            reportsdata = [];
            data.forEach(value => {
                let report = value.val();
                reportsdata.push({
                    Name : report.Name,
                    file : report.file,
                    id : value.key
                })
            }),
            reportsdata.reverse();

            console.log(reportsdata)
            dispatch(Set_P_Reports(reportsdata));
            dispatch(set_done_p_reports(false));
        })
    }
}

export const Fetch_Person_Purchase_Reports = () => {
    return function(dispatch){
        var reportsdata = [];
        const ref = database.ref('Person_Purchase_Reports');
        ref.orderByChild('Date').on('value',
        function(data){
            reportsdata = [];
            data.forEach(value => {
                let report = value.val();
                reportsdata.push({
                    Name : report.Name,
                    file : report.file,
                    id : value.key
                })
            }),
            reportsdata.reverse();

            console.log(reportsdata)
            dispatch(Set_P_Purchase_Report(reportsdata));
            dispatch(set_done_p_p_reports(false));
        })
    }
}