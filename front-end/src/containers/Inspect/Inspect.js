import React, {useEffect} from 'react';
import classes from './Inspect.module.css';

import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';

import Person from './Person/Person';

function Inspect(props) {
    const fullPath = props.history.location.pathname;
    const id = fullPath.slice(fullPath.lastIndexOf('/') + 1, fullPath.length);

    useEffect(() => {
        const numSurveys = props.surveys.length
        if (numSurveys === 0) {
            props.history.push('/my-surveys');
        } else {
            const survey = props.surveys.filter(survey => survey._id === id)[0];
            props.onSetSurvey(survey);
        }
    }, [props.surveys]);

    

    if (!props.survey) {
        return null;
    }

    let shareURL = window.location.protocol + "//" + window.location.host + '/submit/' + id;
    return <div>
        <h1>{props.survey.event}</h1>
        <p>{props.survey.submitions.length} submitions</p>
        <p>{shareURL}</p>
        {props.survey.submitions.map(submition => {
            return <Person 
            name={submition.name}
            createdAt={submition.createdAt}
            />
        })}
    </div>
}

const mapStateToProps = state => {
    return {
        surveys: state.surveys.surveys,
        survey: state.inspect.survey
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onSetSurvey: survey => dispatch({type: actionTypes.SET_INSPECT_SURVEY, survey: survey})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Inspect);
