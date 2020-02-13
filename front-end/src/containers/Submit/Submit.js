import React, {useEffect, useState} from 'react';
import classes from './Submit.module.css';
import axios from '../../axios';
import getDisplayDate from '../../helper/getDisplayDate';

import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';

import TimeFrameCreator from '../TimeFrameCreator/TimeFrameCreator';
import TextField from '@material-ui/core/TextField';
import Button from '../../components/UI/Button/Button';
import Availabilities from '../../components/Availabilities/Availabilities';

function Submit(props) {
    const fullPath = props.history.location.pathname;
    const id = fullPath.slice(fullPath.lastIndexOf('/') + 1, fullPath.length);

    const [name, setName] = useState('');
    const [stage, setStage] = useState(0);

    useEffect(() => {
        const fullPath = props.history.location.pathname;
        const id = fullPath.slice(fullPath.lastIndexOf('/') + 1, fullPath.length);

        axios.get('/submit/' + id)
        .then(res => {
            // Making sure that the user hasn't already submitted
            const storedSubmitionIds = JSON.parse(localStorage.getItem("submitionIds")) || [];
            const surveySubmitionsIds = res.data.submitionIds;

            let userAlreadySubmitted = false;
            for(var i = 0; i < storedSubmitionIds.length; i++) {
                if (surveySubmitionsIds.includes(surveySubmitionsIds[i])) {
                    userAlreadySubmitted = true;
                    break;
                }
            }
            
            if (userAlreadySubmitted) {
                setStage(3);
            } else {
                setStage(1);
            }
            props.onSetSurvey(res.data);
        })
        .catch(err => {
            console.log(err);
            props.history.push('/');
        });
    }, []);

    const addTimeFrameHandler = timeframe => {
        if (timeframe.start < timeframe.end) {
            let overlapFound = false;
            props.timeframes.forEach(tf => {
                if ((tf.start <= timeframe.start && tf.end >= timeframe.start) 
                || (tf.start <= timeframe.end && tf.end >= timeframe.end) 
                || (timeframe.start <= tf.start && timeframe.end >= tf.start) 
                || (timeframe.start <= tf.end && timeframe.end >= tf.end)) {
                    overlapFound = true;
                }
            });
            if (!overlapFound) {
                let timeframes = [...props.timeframes];
                timeframes.push(timeframe);
                timeframes.sort((a, b) => a.start - b.start);
                props.onSetTimeFrames(timeframes)
            } else {
                // Modal: Not a valid duration
                props.onOpenModal('Overlap found with another availability');
            }
        } else {
            // Modal: Not a valid duration
            props.onOpenModal('Not a valid duration. Be sure to set start times before end times');
        }
    }

    const deleteByStartTime = startTime => {
        props.onSetTimeFrames(props.timeframes.filter(timeframe => timeframe.start !== startTime))
    }

    const updateNameHandler = event => {
        const newName = event.target.value
        if (newName.length <= 30) {
            setName(newName)
        }
    }

    const submitHandler = () => {
        let allTimes = [];
        props.timeframes.forEach(timeframe => {
            allTimes.push(timeframe.start);
            allTimes.push(timeframe.end);
        });

        axios.post('/submit/' + id, {
            submition: {
                available: allTimes,
                name: name
            }
        })
        .then(res => {
            let storedSubmitionIds = JSON.parse(localStorage.getItem("submitionIds")) || [];
            storedSubmitionIds.push(res.data);
            localStorage.setItem("submitionIds", JSON.stringify(storedSubmitionIds));
            
            setStage(3);
        })
        .catch(err => {
            console.log(err);
        });
    }
    
    if (!props.survey && stage === 1) {
        return null;
    }

    return <div className={classes.Submit}>
        {props.survey ? <h1 className={classes.EventHeader}>{props.survey.event}: {getDisplayDate(props.survey.date)}</h1> : null}
        
        {/* display is dependent on stage and is defined earlier */}
        {stage === 1 ? 
            <>
                <h2 className={classes.PromptHeader}>What times will you be available?</h2>
                <div className={classes.TimeFrameCreatorBox}>

                    <TimeFrameCreator 
                    date={props.survey.date}
                    add={addTimeFrameHandler}
                    />
                    
                </div>
                <Availabilities 
                date={props.survey.date}
                timeframes={props.timeframes}
                deleteByStartTime={deleteByStartTime}/>
                
                <Button
                buttonClasses='Large Center'
                style={{position: 'absolute', bottom: '0'}}
                onClick={() => setStage(2)}
                disabled={props.timeframes.length === 0}>NEXT</Button>
            </>
        : null}

        {stage === 2 ? 
            <>
                <h2 className={classes.PromptHeader}>What times will you be available?</h2>
                <div className={classes.SubmitBox}>
                    <TextField 
                    id="standard-basic" label={'Your ' + props.survey.nameType}
                    value={name}
                    onChange={updateNameHandler}
                    className={classes.NameField}
                    autoComplete='off'
                    style={{marginBottom: '30px'}}
                    />
                    <Button 
                    onClick={submitHandler}
                    buttonClasses='Large Border'
                    style={{width: '100%'}}
                    disabled={name.length < 4 || props.timeframes.length === 0}
                    >SUBMIT</Button>
                </div>
                <Button
                buttonClasses='Large Center'
                style={{position: 'absolute', bottom: '0'}}
                onClick={() => setStage(1)}>BACK</Button>
            </>
        : null}

        {stage === 3 ?
            <div>
                <h2 className={classes.StageThreeHeader}>Thanks for the submition!</h2>
            </div>
        : null}
    </div>
}

const mapStateToProps = state => {
    return {
        survey: state.submit.survey,
        timeframes: state.submit.timeframes
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onSetSurvey: survey => dispatch({type: actionTypes.SET_SUBMIT_SURVEY, survey: survey}),
        onSetTimeFrames: timeframes => dispatch({type: actionTypes.SET_TIMEFRAMES, timeframes: timeframes}),
        onOpenModal: message => dispatch({type: actionTypes.OPEN_MODAL, message: message})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Submit);
