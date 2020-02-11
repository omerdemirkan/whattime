import React, {useEffect, useState} from 'react';
import classes from './Submit.module.css';
import axios from '../../axios';
import getDisplayDate from '../../helper/getDisplayDate';

import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';

import TimeFrame from '../../components/TimeFrame/TimeFrame';
import TimeFrameCreator from '../TimeFrameCreator/TimeFrameCreator';
import TextField from '@material-ui/core/TextField';
import Button from '../../components/UI/Button/Button';

function Submit(props) {
    const fullPath = props.history.location.pathname;
    const id = fullPath.slice(fullPath.lastIndexOf('/') + 1, fullPath.length);

    const [name, setName] = useState('');

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

    const addTimeFrameHandler = timeframe => {
        if (timeframe.start < timeframe.end) {
            let overlapFound = false;
            props.timeframes.forEach(tf => {
                if ((tf.start <= timeframe.start && tf.end >= timeframe.start) || (tf.start <= timeframe.end && tf.end >= timeframe.end)) {
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

    const removeTimeFrameHandler = startTime => {
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
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        });
    }

    return <div>
        <h1 className={classes.EventHeader}>{props.survey.event}: {getDisplayDate(props.survey.date)}</h1>
        <h2 className={classes.DateHeader}>What times will you be available?</h2>
        <div className={classes.Main}>
            <div className={classes.TimeFrameCreatorBox}>

                {props.survey ?
                    <TimeFrameCreator 
                    date={props.survey.date}
                    add={addTimeFrameHandler}
                    />
                : null}
                
            </div>

            {props.timeframes.length > 0 ?
                <div className={classes.TimeFramesBox}>
                    {props.timeframes.map(timeframe => {
                        return <TimeFrame 
                        start={timeframe.start} 
                        end={timeframe.end}
                        key={timeframe.start}
                        delete ={() => removeTimeFrameHandler(timeframe.start)}
                        />
                    })}
                </div>
            : null}
        </div>

        {props.timeframes.length > 0 ?
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
                buttonClasses='Large'
                style={{width: '100%'}}
                disabled={name.length < 4 || props.timeframes.length === 0}
                >SUBMIT</Button>
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
