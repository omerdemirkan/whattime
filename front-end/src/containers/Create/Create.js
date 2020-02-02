import React, {useEffect} from 'react';
import classes from './Create.module.css';


import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import axios from '../../axios';

import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';

const floorDate = date => {
    date.setHours(0);
    date.setMinutes(0);
    return date;
}

function Create(props) {

    // Redirecting if the user is not authorized
    useEffect(() => {
        if (!props.accessToken && !props.authLoading) {
            props.history.push('/signup');
        }
    }, [props.authLoading]);

    const setDateHandler = date => {
        props.onUpdateSelectedDate(floorDate(date));
    };

    const setEventNameHandler = event => {
        props.onUpdateEventName(event.target.value);
    }

    const setNameTypeHandler = event => {
        props.onUpdateNameType(event.target.value)
    }

    const postSurveyHandler = () => {
        const accessToken = props.accessToken;

        axios.post('/user/surveys', {
            event: props.eventName,
            nameType: props.nameType,
            date: props.selectedDate
        }, {
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        })
        .then(res => {
            props.onResetCreate();
            // props.history.push('/my-surveys/' + res.data.surveyId);
            console.log(res.data.surveyId);
        })
        .catch(err => {
            console.log(err);
        });
    }

    return <div>
        <TextField 
        id="standard-basic" 
        label="Event Name" 
        value={props.eventName}
        onChange={setEventNameHandler}/>

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Date"
            minDate={new Date()}
            value={props.selectedDate}
            onChange={setDateHandler}
            KeyboardButtonProps={{
                'aria-label': 'change date',
            }}
            />
        </MuiPickersUtilsProvider>

        <InputLabel id="demo-simple-select-label">Identifier</InputLabel>
        <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={props.nameType}
        onChange={setNameTypeHandler}
        >
        <MenuItem value={'First Name'}>First Name</MenuItem>
        <MenuItem value={'Full Name'}>Full Name</MenuItem>
        <MenuItem value={'Alias'}>Alias</MenuItem>
        </Select>
        <button onClick={postSurveyHandler}>Submit</button>
    </div>
}

const mapStateToProps = state => {
    return {
        nameType: state.create.nameType,
        eventName: state.create.eventName,
        selectedDate: state.create.selectedDate,
        accessToken: state.auth.accessToken,
        authLoading: state.auth.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onUpdateNameType: nameType => dispatch({type: actionTypes.UPDATE_NAME_TYPE, nameType: nameType}),
        onUpdateEventName: eventName => dispatch({type: actionTypes.UPDATE_EVENT_NAME, eventName: eventName}),
        onUpdateSelectedDate: selectedDate => dispatch({type: actionTypes.UPDATE_SELECTED_DATE, selectedDate: selectedDate}),
        onResetCreate: () => dispatch({type: actionTypes.RESET_CREATE})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Create);
