import React, {useEffect} from 'react';
import classes from './Submit.module.css';
import axios from '../../axios';

import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';

import TimeFrame from '../../components/TimeFrame/TimeFrame';

function Submit(props) {

    useEffect(() => {
        const fullPath = props.history.location.pathname;
        const id = fullPath.slice(fullPath.lastIndexOf('/') + 1, fullPath.length);

        axios.get('/submit/' + id)
        .then(res => {
            props.onSetSurvey(res.data)
        })
        .catch(err => {
            // props.history.push('/');
            console.log(err);
        });
    }, []);

    if (!props.survey) {
        return null
    }

    return <div>
        <h1>{props.survey.event}</h1>
        <p>{props.survey.date}</p>
        <TimeFrame/>
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
