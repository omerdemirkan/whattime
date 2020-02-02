import React, {useEffect} from 'react';
import classes from './Submit.module.css';
import axios from '../../axios';

import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';

import TimeFrame from '../../components/TimeFrame/TimeFrame';
import TimeFrameCreator from '../TimeFrameCreator/TimeFrameCreator';

function Submit(props) {

    useEffect(() => {
        const fullPath = props.history.location.pathname;
        const id = fullPath.slice(fullPath.lastIndexOf('/') + 1, fullPath.length);

        axios.get('/submit/' + id)
        .then(res => {
            props.onSetSurvey(res.data)
        })
        .catch(err => {
            props.history.push('/');
        });
    }, []);

    if (!props.survey) {
        return null
    }

    return <div>
        <h1>Event: {props.survey.event}</h1>
        <p>Date{props.survey.date}</p>
        <p>Creator: {props.survey.creator}</p>
        <div>
            <h1>What times will you be available?</h1>
            {props.survey ?
                <TimeFrameCreator date={props.survey.date}/>
            : null}
            
        </div>
    </div>
}

const mapStateToProps = state => {
    return {
        survey: state.submit.survey
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onSetSurvey: survey => dispatch({type: actionTypes.SET_SURVEY, survey: survey})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Submit);
