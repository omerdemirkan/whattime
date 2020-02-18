import React, {useEffect, useState, useRef} from 'react';
import classes from './Inspect.module.css';

import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';
import axios from '../../axios';
import loadInspectSurveyAsync from '../../store/actions/loadInspectSurvey';
import getDisplayDate from '../../helper/getDisplayDate';
import ScrollUpOnLoad from '../../components/ScrollUpOnLoad/ScrollUpOnLoad';
import AuthRequired from '../Auth/AuthRequired';

import Person from './Person/Person';
import Availabilities from '../../components/Availabilities/Availabilities';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import FileCopyIcon from '@material-ui/icons/FileCopy';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '../../components/UI/Button/Button';

function getDisplayPeople(numPeople) {
    return numPeople + (numPeople === 1 ? ' Person' : ' People');
}

function Inspect(props) {

    const fullPath = props.history.location.pathname;
    const surveyId = fullPath.slice(fullPath.lastIndexOf('/') + 1, fullPath.length);
    const shareURL = window.location.protocol + "//" + window.location.host + '/submit/' + surveyId;

    // Available windows for a general number of people:
    const [availableTimes, setAvailableTimes] = useState(null);

    // Available windows for a specific submission:
    const [inspectedPerson, setInspectedPerson] = useState(null);

    const [numAvailable, setNumAvailable] =  useState(null);
    const [userHasSubmitted, setUserHasSubmitted] = useState(null);

    function calculateGeneralAvailability() {
        if (props.survey) {
            let cumulativeTimes = [];
            props.survey.submissions.forEach(submission => {
                let formattedTimes = [];
                for (let i = 0; i < submission.available.length; i += 2) {
                    formattedTimes.push({
                        name: submission.name,
                        time: submission.available[i],
                        isStart: true
                    });
                    formattedTimes.push({
                        name: submission.name,
                        time: submission.available[i + 1],
                        isStart: false
                    });
                }
                cumulativeTimes = cumulativeTimes.concat(formattedTimes);
            });
            cumulativeTimes.sort((a, b) => a.time - b.time);
            
            let availableCounter = 0;
            let allAvailableTimeFrames = [];
            cumulativeTimes.forEach(time => {
                if (time.isStart) {
                    availableCounter++;
                    if (availableCounter === numAvailable) {
                        allAvailableTimeFrames.push({
                            start: time.time
                        });
                    }
                } else {
                    if (availableCounter === numAvailable) {
                        allAvailableTimeFrames[allAvailableTimeFrames.length - 1].end = time.time;
                    }
                    availableCounter--;
                }
            });
            setAvailableTimes(allAvailableTimeFrames);
            setNumAvailable(props.survey.submissions.length);
        }
    }

    function calculateIndividualAvailability(id) {
        
    }

    // Loads inspected survey on mount
    useEffect(() => {

        if (props.accessToken) {
            props.onLoadInspectSurvey(props.accessToken, surveyId);
        }
    }, [props.accessToken]);


    // Functions to update survey after deleting a submission.
    useEffect(() => {
        const loadedSurvey = props.loadedSurveys.filter(survey => survey._id === surveyId)[0] || false;

        if (loadedSurvey) {
            props.onSetSurvey(loadedSurvey);
        }
    }, [props.loadedSurveys]);


    // Sets initial value of numAvailable to the total number of submissions on load.
    // Searches whether or not the user has already submitted.
    useEffect(() => {
        // checking for id serves to avoid executing on previously loaded inspect survey
        if (props.survey && props.survey._id === surveyId) {
            calculateGeneralAvailability()
            if (userHasSubmitted == null) {
                const storedSubmissionIds = JSON.parse(localStorage.getItem("submissionIds")) || [];
                const surveySubmissionsIds = props.survey.submissions.map(submission => submission._id);
    
                let userAlreadySubmitted = false;
                for(var i = 0; i < storedSubmissionIds.length; i++) {
                    if (surveySubmissionsIds.includes(storedSubmissionIds[i])) {
                        userAlreadySubmitted = true;
                        break;
                    }
                }
                setUserHasSubmitted(userAlreadySubmitted);
            }
        }
    }, [props.survey]);


    // Searches available times on survey load and when the user changes the number of availabilities searched for.
    useEffect(() => {
        
        calculateGeneralAvailability();
        
    }, [numAvailable]);

    function deleteSubmissionHandler(id) {
        axios.delete('/user/surveys/' + props.survey._id + '/' + id, {
            headers: {
                Authorization: 'Bearer ' + props.accessToken,
            }
        })
        .then(res => {
            let newSurvey = {...props.survey};
            newSurvey.submissions = newSurvey.submissions.filter(submission => submission._id !== id);
            let surveyIndex = props.loadedSurveys.map(survey => survey._id).indexOf(newSurvey._id);

            if (surveyIndex >= 0) {
                const newLoadedSurveys = [...props.loadedSurveys];
                newLoadedSurveys[surveyIndex] = newSurvey;
                props.onSetSurveys(newLoadedSurveys);
            } else {
                props.onSetSurvey(newSurvey)
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    if (!props.survey) {
        return <div className={classes.Inspect}></div>;
    }

    const numSubmissions = props.survey.submissions.length;

    // Determines the select options to choose numAvailable
    let numAvailableSelectOptions = [];
    for(let i = numSubmissions; i > 0; i--) {
        const defaultDisplay = getDisplayPeople(i)
        numAvailableSelectOptions.push({
            value: i,
            display: i === numSubmissions ? 'Everyone' : defaultDisplay
        });
    }

    return <div className={classes.Inspect}>
        <AuthRequired/>
        <ScrollUpOnLoad/>
        <h1 className={classes.EventHeader}>{props.survey.event}, {getDisplayDate(props.survey.date)}</h1>
        <div className={classes.ShareBox}>
            <CopyToClipboard text={shareURL}
            onCopy={props.onCopyToClipboard}>
            <span className={classes.ShareIcon}><FileCopyIcon fontSize='large'/></span>
            </CopyToClipboard>
            <span className={classes.ShareText}>SHARE</span>
        </div>

        {availableTimes && availableTimes.length > 0 ?
            <div className={classes.AvailabilitiesBox}>
                <h2 className={classes.AvailabilitiesHeader}>Times {numAvailable === numSubmissions ? 'Everyone is' : getDisplayPeople(numAvailable) + (numAvailable === 1 ? ' is ' : ' are ')} Available:</h2>
                <Availabilities 
                date={props.survey.date}
                timeframes={availableTimes}/>
            </div>
        : null}
        {availableTimes && availableTimes.length === 0 && !props.surveyLoading && numSubmissions !== 0 ? 
            <div className={classes.AvailabilitiesBox}>
                <h1 className={classes.AvailabilitiesHeader}>No Availabilities Found</h1>
                <h2 className={classes.AvailabilitiesHeader}>Try Narrowing the Number of People</h2>
            </div>
        : null}

        <div className={classes.Main}>
            
            <div className={classes.SubmissionsBox}>
                <h2 className={classes.SubmissionsHeader}>{numSubmissions} submission{numSubmissions === 1 ? '' : 's'}</h2>
                <div className={classes.PersonsBox}>
                    {props.survey.submissions.map(submission => {
                        return <Person 
                        name={submission.name}
                        createdAt={submission.createdAt}
                        key={submission._id}
                        delete={() => deleteSubmissionHandler(submission._id)}
                        />
                    })}
                    {userHasSubmitted === false ?
                        <div className={classes.SubmitBox}>
                            <a href={shareURL} target="_blank">
                                <Button buttonClasses='Large ' style={{width: '100%', margin: '0'}}>Submit your availabilities</Button>
                            </a>
                        </div>
                    : null}
                </div>
            </div>
            
            
            {availableTimes && numSubmissions > 1 ?
                <div className={classes.InputsBox}>
                    <h3 className={classes.SelectLabel}>How many people are needed?</h3>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={numAvailable}
                    onChange={event => setNumAvailable(event.target.value)}
                    className={classes.NumAvailableSelect}
                    >
                        {numAvailableSelectOptions.map(option => {
                            return <MenuItem value={option.value}>{option.display}</MenuItem>
                        })}
                    </Select>
                </div>
            : null}
        </div>
    </div>
}

const mapStateToProps = state => {
    return {
        loadedSurveys: state.surveys.surveys,
        survey: state.inspect.survey,
        accessToken: state.auth.accessToken,
        surveyLoading: state.inspect.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onSetSurvey: survey => dispatch({type: actionTypes.SET_INSPECT_SURVEY, survey: survey}),
        onCopyToClipboard: () => dispatch({type: actionTypes.OPEN_SNACKBAR, message: 'Link Copied to Clipboard'}),
        onSetSurveys: surveys => dispatch({type: actionTypes.SET_SURVEYS, surveys: surveys}),
        onLoadInspectSurvey: (accessToken, surveyId) => dispatch(loadInspectSurveyAsync(accessToken, surveyId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Inspect);
