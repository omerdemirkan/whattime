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

    const addTimeFrameHandler = timeframe => {
        if (timeframe.start < timeframe.end) {
            let overlapFound = false;
            props.timeframes.forEach(tf => {
                if ((tf.start <= timeframe.start && tf.end >= timeframe.end) || (tf.start >= timeframe.start && tf.end <= timeframe.end)) {
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
                props.onOpenModal('Boojie');
                console.log('Not a valid duration (overlap found)');
            }
        } else {
            // Modal: Not a valid duration
                props.onOpenModal('Boojie');
            console.log('Not a valid duration');
        }
    }

    return <div>
        <h1>Event: {props.survey.event}</h1>
        <p>Date{props.survey.date}</p>
        <p>Creator: {props.survey.creator}</p>
        <div>
            <h1>What times will you be available?</h1>
            {props.survey ?
                <TimeFrameCreator 
                date={props.survey.date}
                add={addTimeFrameHandler}
                />
            : null}
            {props.timeframes.map(timeframe => {
                return <TimeFrame 
                start={timeframe.start} 
                end={timeframe.end}/>
            })}
            
        </div>
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
        onSetSurvey: survey => dispatch({type: actionTypes.SET_SURVEY, survey: survey}),
        onSetTimeFrames: timeframes => dispatch({type: actionTypes.SET_TIMEFRAMES, timeframes: timeframes}),
        onOpenModal: message => dispatch({type: actionTypes.OPEN_MODAL, message: message})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Submit);
