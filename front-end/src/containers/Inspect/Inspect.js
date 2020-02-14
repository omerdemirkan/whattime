import React, {useEffect, useState} from 'react';
import classes from './Inspect.module.css';

import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';
import axios from '../../axios';

import Person from './Person/Person';
import Availabilities from '../../components/Availabilities/Availabilities';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import FileCopyIcon from '@material-ui/icons/FileCopy';

function Inspect(props) {

    const fullPath = props.history.location.pathname;
    const id = fullPath.slice(fullPath.lastIndexOf('/') + 1, fullPath.length);

    const [availableTimes, setAvailableTimes] = useState(null);

    useEffect(() => {
        const survey = props.loadedSurveys.filter(survey => survey._id === id)[0] || false;

        if (!survey) {
            props.history.push('/my-surveys');
        } else {
            props.onSetSurvey(survey);
        }
    }, [props.loadedSurveys]);

    useEffect(() => {
        if (props.survey) {
            let cumulativeTimes = [];
            props.survey.submitions.forEach(submition => {
                let formattedTimes = []
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
            
            const numSubmitions = props.survey.submitions.length;
            let availableCounter = 0;
            let allAvailableTimeFrames = [];
            cumulativeTimes.forEach(time => {
                if (time.isStart) {
                    availableCounter++;
                    if (availableCounter === numSubmitions) {
                        allAvailableTimeFrames.push({
                            start: time.time
                        });
                    }
                } else {
                    if (availableCounter === numSubmitions) {
                        allAvailableTimeFrames[allAvailableTimeFrames.length - 1].end = time.time;
                    }
                    availableCounter--;
                }
            });
            setAvailableTimes(allAvailableTimeFrames);
        }
    }, [props.survey]);

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

    const shareURL = window.location.protocol + "//" + window.location.host + '/submit/' + id;
    const numSubmitions = props.survey.submitions.length;

    return <div className={classes.Inspect}>
        <h1 className={classes.EventHeader}>{props.survey.event}</h1>
        <div className={classes.ShareBox}>
            <CopyToClipboard text={shareURL}
            onCopy={props.onCopyToClipboard}>
            <span className={classes.ShareIcon}><FileCopyIcon fontSize='large'/></span>
            </CopyToClipboard>
            <span className={classes.ShareText}>SHARE</span>
        </div>

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
            <div className={classes.AvailabilitiesBox}>
                {availableTimes ?
                    <Availabilities 
                    date={props.survey.date}
                    timeframes={availableTimes}/>
                : null}
            </div>
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
        onSetSurveys: surveys => dispatch({type: actionTypes.SET_SURVEYS, surveys: surveys})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Inspect);
