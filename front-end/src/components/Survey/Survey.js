import React from 'react';
import classes from './Survey.module.css';

import TimeAgo from 'timeago-react';

import getDisplayDate from '../../helper/getDisplayDate'



function Survey(props) {

    function inspectRedirect() {
        props.history.push('/my-surveys/' + props.survey._id);
    }

    const numSubmitions = props.survey.submitions.length;

    return <div className={classes.Survey}>
        <div className={classes.Header}>
            <h3 className={classes.EventName + ' purple'} onClick={inspectRedirect}>{props.survey.event}</h3>
            <p className={classes.CreatedAt}>
                created <TimeAgo
                datetime={props.survey.createdAt} 
                />
            </p>
        </div>
        
        <p>{numSubmitions} submition{numSubmitions === 1 ? null : 's'}</p>
        <p>Date: {getDisplayDate(props.survey.date)}</p>
        
    </div>
}

export default Survey;
