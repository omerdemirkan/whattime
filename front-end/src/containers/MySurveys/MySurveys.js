import React, {useEffect, useState} from 'react';
import classes from './MySurveys.module.css';
import {connect} from 'react-redux';
import loadSurveysAsync from '../../store/actions/loadSurveys';
import AuthRequired from '../Auth/AuthRequired';
import ScrollUpOnLoad from '../../components/ScrollUpOnLoad/ScrollUpOnLoad';
import { Link } from 'react-router-dom';
import Button from '../../components/UI/Button/Button';
import axios from '../../axios';
import * as actionTypes from '../../store/actions/actionTypes';

// Refresh
import RefreshIcon from '@material-ui/icons/Refresh';
import CircularProgress from '@material-ui/core/CircularProgress';
import Purple from '../../components/ThemeProviders/Purple';

import noData from '../../images/no-data.svg';

import Survey from '../../components/Survey/Survey';

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

function MySurveys(props) {

    const [ showRefreshButton, setShowRefreshButton ] = useState(false);

    async function refreshButtonClickedHandler() {
        setShowRefreshButton(false);
        props.onLoadSurveys(props.accessToken, 0, true);
    }

    useEffect(() => {
        if (props.accessToken && props.surveys.length === 0) {
            props.onLoadSurveys(props.accessToken, 0, true)
        } else if (props.accessToken) {
            setShowRefreshButton(true);
        }
    }, [props.accessToken]);

    const deleteSurveyHandler = id => {
        axios.delete('/user/surveys/' + id, {
            headers: {
                Authorization: 'Bearer ' + props.accessToken
            }
        })
        .then(res => {
            const newSurveys = props.surveys.filter(survey => survey._id !== id)
            props.onSetSurveys(newSurveys);
        })
        .catch(err => {
            console.log(err);

        });
    }



    let refreshBox = null;

    if (showRefreshButton && !props.surveysLoading) {
        refreshBox = <div className={classes.RefreshBox}>
            <RefreshIcon
            onClick={refreshButtonClickedHandler}
            fontSize='large'
            className={classes.RefreshButton}/>
        </div>
    } else if (!showRefreshButton && props.surveysLoading) {
        refreshBox = <div className={classes.RefreshBox}>
            <Purple>
                <CircularProgress/>
            </Purple>
        </div>
    }


    
    return <div className={classes.MySurveys}>
        <AuthRequired history={props.history}/>
        <ScrollUpOnLoad/>

        {refreshBox}
        
        {props.username ? <h1 className={classes.Header}>{capitalize(props.username)}'s Surveys</h1>: null}
        {props.surveys.length === 0 && !props.surveysLoading ?
            <div className={classes.NoSurveysBox}>
                <h2 className={classes.NoSurveysHeader}>Hmm, looks a bit empty. Would you like to create a survey?</h2>
                <Link to='/create'>
                    <Button buttonClasses='Large'>Yes, Take Me There!</Button>
                </Link>
                <img className={classes.NoSurveysImage} src={noData}/>
            </div>
        : null}

        <div className={classes.SurveysBox}>
            {props.surveys.map((survey, index) => {
                return <Survey
                delay={(index * .1) + 's'}
                key={survey._id} 
                survey={survey}
                history={props.history}
                delete={() => deleteSurveyHandler(survey._id)}/>
            })}
        </div>
        
    </div>
}

const mapStateToProps = state => {
    return {
        accessToken: state.auth.accessToken,
        surveys: state.surveys.surveys,
        surveysLoading: state.surveys.loading,
        username: state.auth.username
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLoadSurveys: (accessToken, currentPosts, reset) => dispatch(loadSurveysAsync(accessToken, currentPosts, reset)),
        onSetSurveys: surveys => dispatch({type: actionTypes.SET_SURVEYS, surveys: surveys})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MySurveys);
