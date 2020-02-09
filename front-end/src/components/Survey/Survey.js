import React from 'react';
import classes from './Survey.module.css';

import TimeAgo from 'timeago-react';

function getDisplayDate(date) {
    const fullDate = new Date(date);
    let displayDate = getMonthName(fullDate.getMonth()) + ' ' + fullDate.getDate() + ', ' + fullDate.getFullYear();

    return displayDate;
}

function getMonthName(monthNum) {
    switch(monthNum) {
        case 0:
            return 'January';
        case 1:
            return 'February';
        case 2:
            return 'March';
        case 3:
            return 'April';
        case 4:
            return 'May';
        case 5:
            return 'June';
        case 6:
            return 'July';
        case 7:
            return 'August';
        case 8:
            return 'September';
        case 9:
            return 'October';
        case 10:
            return 'November';
        case 11:
            return 'December';
        default:
            return 'Error in getMonthName()'
    }
}

function Survey(props) {

    function inspectRedirect() {
        props.history.push('/my-surveys/' + props.survey._id);
    }

    return <div className={classes.Survey}>
        <div className={classes.Header}>
            <h2 className={classes.EventName} onClick={inspectRedirect}>{props.survey.event}</h2>
            <p className={classes.CreatedAt}>
                created <TimeAgo
                datetime={props.survey.createdAt} 
                />
            </p>
        </div>
        
        <p>{props.survey.submitions.length} submitions</p>
        <p>Date: {getDisplayDate(props.survey.date)}</p>
        
    </div>
}

export default Survey;
