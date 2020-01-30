import React, {useEffect} from 'react';
import classes from './Inspect.module.css';

import * as actionTypes from '../../store/actions/actionTypes';
import { connect } from 'react-redux';

function Inspect(props) {
    const fullPath = props.history.location.pathname;
    const id = fullPath.slice(fullPath.lastIndexOf('/') + 1, fullPath.length);

    useEffect(() => {
        const numSurveys = props.surveys.length
        if (numSurveys === 0) {
            props.history.push('/my-surveys');
        }
    }, [props.surveys]);

    const survey = props.surveys.filter(survey => survey._id === id)[0];

    if (!survey) {
        return null;
    }

    let shareURL = window.location.protocol + "//" + window.location.host + '/submit/' + id;
    console.log(shareURL);
    return <div>
        <h1>{survey.event}</h1>
        <p>{survey.submitions.length} submitions</p>
        <p>{shareURL}</p>
    </div>
}

const mapStateToProps = state => {
    return {
        surveys: state.surveys.surveys
    }
}

export default connect(mapStateToProps)(Inspect);
