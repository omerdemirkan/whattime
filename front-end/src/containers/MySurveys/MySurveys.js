import React, {useEffect} from 'react';
import classes from './MySurveys.module.css';
import {connect} from 'react-redux';
import loadSurveysAsync from '../../store/actions/loadSurveys';
import AuthRequired from '../Auth/AuthRequired';
import ScrollUpOnLoad from '../../components/ScrollUpOnLoad/ScrollUpOnLoad';
import { Link } from 'react-router-dom';
import Button from '../../components/UI/Button/Button';

import noData from '../../images/no-data.svg';

import Survey from '../../components/Survey/Survey';

function MySurveys(props) {
    useEffect(() => {
        if (props.accessToken && props.surveys.length === 0) {
            props.onLoadSurveys(props.accessToken, 0)
        }
    }, [props.accessToken]);

    return <div className={classes.MySurveys}>
        <AuthRequired history={props.history}/>
        <ScrollUpOnLoad/>
        <h1 className={classes.Header}>My Surveys</h1>
        {props.surveys.length === 0 && !props.surveysLoading ?
            <div className={classes.NoSurveysBox}>
                <img className={classes.NoSurveysImage} src={noData}/>
                <h2 className={classes.NoSurveysHeader}>Hmm, looks a bit empty. Would you like to create a survey?</h2>
                <Link to='/create'>
                    <Button buttonClasses='Large'>Yes, Take Me There!</Button>
                </Link>
            </div>
        : null}
        <div className={classes.SurveysBox}>
            {props.surveys.map(survey => {
                return <Survey
                key={survey._id} 
                survey={survey}
                history={props.history}/>
            })}
        </div>
        
    </div>
}

const mapStateToProps = state => {
    return {
        accessToken: state.auth.accessToken,
        surveys: state.surveys.surveys,
        surveysLoading: state.surveys.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLoadSurveys: (accessToken, currentPosts) => dispatch(loadSurveysAsync(accessToken, currentPosts))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MySurveys);
