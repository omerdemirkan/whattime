import React from 'react';
import classes from './Survey.module.css';

function Survey(props) {

    function inspectRedirect() {
        props.history.push('/my-surveys/' + props.survey._id);
    }

    return <div>
        <h1 onClick={inspectRedirect}>{props.survey.event}</h1>
        <p>{props.survey.submitions.length} submitions</p>
    </div>
}

export default Survey;
