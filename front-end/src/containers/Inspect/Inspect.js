import React, {useEffect, useState} from 'react';
import classes from './Inspect.module.css';

import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';
import axios from '../../axios';
import loadInspectSurveyAsync from '../../store/actions/loadInspectSurvey';
import getDisplayDate from '../../helper/getDisplayDate';

import Person from './Person/Person';
import Availabilities from '../../components/Availabilities/Availabilities';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import FileCopyIcon from '@material-ui/icons/FileCopy';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

function getDisplayPeople(numPeople) {
    return numPeople + (numPeople === 1 ? ' Person' : ' People');
}

function Inspect(props) {

    const fullPath = props.history.location.pathname;
    const surveyId = fullPath.slice(fullPath.lastIndexOf('/') + 1, fullPath.length);
    const shareURL = window.location.protocol + "//" + window.location.host + '/submit/' + surveyId;

    const [availableTimes, setAvailableTimes] = useState(null);
    const [numAvailable, setNumAvailable] =  useState(null);

    // Searches for whether or not the survey inspected is already loaded, 
    // if it isn't it is manually loaded with an async action creator.
    // Also functions to update survey after deleting a submition.
    useEffect(() => {
        const survey = props.loadedSurveys.filter(survey => survey._id === surveyId)[0] || false;

        if (survey) {
            props.onSetSurvey(survey);
        } else if (props.accessToken) {
            props.onLoadInspectSurvey(props.accessToken, surveyId);
        }
    }, [props.loadedSurveys, props.accessToken]);

    useEffect(() => {
        if (props.survey && !numAvailable) {
            setNumAvailable(props.survey.submitions.length)
        }
    }, [props.survey]);

    useEffect(() => {
        if (props.survey) {
            let cumulativeTimes = [];
            props.survey.submitions.forEach(submition => {
                let formattedTimes = [];
                for (let i = 0; i < submition.available.length; i += 2) {
                    formattedTimes.push({
                        name: submition.name,
                        time: submition.available[i],
                        isStart: true
                    });
                    formattedTimes.push({
                        name: submition.name,
                        time: submition.available[i + 1],
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
        }
    }, [numAvailable]);

    function deleteSubmitionHandler(id) {
        axios.delete('/user/surveys/' + props.survey._id + '/' + id, {
            headers: {
                Authorization: 'Bearer ' + props.accessToken,
            }
        })
        .then(res => {
            let newSurvey = {...props.survey};
            newSurvey.submitions = newSurvey.submitions.filter(submition => submition._id !== id);
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
        return null;
    }

    const numSubmitions = props.survey.submitions.length;

    // Determines the select options to choose numAvailable
    let numAvailableSelectOptions = [];
    for(let i = numSubmitions; i > 0; i--) {
        const defaultDisplay = getDisplayPeople(i)
        numAvailableSelectOptions.push({
            value: i,
            display: i === numSubmitions ? 'Everyone' : defaultDisplay
        });
    }

    return <div className={classes.Inspect}>
        <h1 className={classes.EventHeader}>{props.survey.event}, {getDisplayDate(props.survey.date)}</h1>
        <div className={classes.ShareBox}>
            <CopyToClipboard text={shareURL}
            onCopy={props.onCopyToClipboard}>
            <span className={classes.ShareIcon}><FileCopyIcon fontSize='large'/></span>
            </CopyToClipboard>
            <span className={classes.ShareText}>SHARE</span>
        </div>

        {availableTimes && numSubmitions > 0 ?
            <div className={classes.AvailabilitiesBox}>
                <h1 className={classes.AvailabilitiesHeader}>What time {numAvailable === numSubmitions ? 'is Everyone' : (numAvailable === 1 ? 'is ' : 'are ') + getDisplayPeople(numAvailable)} available?</h1>
                <Availabilities 
                date={props.survey.date}
                timeframes={availableTimes}/>
            </div>
        : null}

        <div className={classes.Main}>
            
            <div className={classes.SubmitionsBox}>
                <h2 className={classes.SubmitionsHeader}>{numSubmitions} submition{numSubmitions === 1 ? '' : 's'}</h2>
                <div className={classes.PersonsBox}>
                    {props.survey.submitions.map(submition => {
                        return <Person 
                        name={submition.name}
                        createdAt={submition.createdAt}
                        key={submition._id}
                        delete={() => deleteSubmitionHandler(submition._id)}
                        />
                    })}
                </div>
            </div>
            
            
            {availableTimes && numSubmitions > 1 ?
                <div className={classes.InputsBox}>
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
        accessToken: state.auth.accessToken
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
