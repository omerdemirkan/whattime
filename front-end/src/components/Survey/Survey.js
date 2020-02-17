import React from 'react';
import classes from './Survey.module.css';

import TimeAgo from 'timeago-react';

import getDisplayDate from '../../helper/getDisplayDate'



function Survey(props) {

    function inspectRedirect() {
        props.history.push('/my-surveys/' + props.survey._id);
    }

    return <div className={classes.Survey}>
        <div className={classes.Header}>
            <h2 className={classes.EventName + ' purple'} onClick={inspectRedirect}>{props.survey.event}</h2>
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
