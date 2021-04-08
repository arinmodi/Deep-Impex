import { Reports, P_Reports, T_Credit_Report, done_reports, done_p_reports, done_t_reports, done_p_p_reports, P_Purchase_Report } from '../Actions/Reports';

const intialState = {
    Reports_Data : [], // Purchase Report
    P_Credits : [], // Person Credit Report
    T_Credits : [], // Total Credit Report
    P_P_Reports : [], // Person Purchase Reports
    Done_R : true, // Purchase Report
    Done_P : true, // Person Credit Report
    Done_T : true, // Total Credit Report
    Done_P_P : true // Person Purchase Reports

}


const Reports_reducer = (state = intialState , action) => {
    switch(action.type){
        case  Reports : 
            return { ...state , Reports_Data: action.Data}

        case P_Reports : 
            return {...state, P_Credits : action.P_Data }

        case T_Credit_Report : 
            return {...state, T_Credits : action.T_Data}

        case P_Purchase_Report : 
            return {...state, P_Purchase : action.P_P_Data}

        case done_reports : {
            return { ...state, Done_R : action.data }
        }

        case done_p_reports : {
            return { ...state, Done_P : action.data }
        }

        case done_t_reports : {
            return { ...state, Done_T : action.data }
        }

        case done_p_p_reports : {
            return { ...state, Done_P_P : action.data }
        }


        default : 
            return state
    }
};


export default Reports_reducer;