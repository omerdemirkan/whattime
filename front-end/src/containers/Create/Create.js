import React, {useState} from 'react';
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

const sameDate = (first, second) => {
    return first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();
}

function Create(props) {

    const setDateHandler = date => {
        const today = new Date()
        if (date >= today || sameDate(date, today)) {
            props.onUpdateSelectedDate(date);
        }
    };

    const setEventNameHandler = event => {
        props.onUpdateEventName(event.target.value);
    }

    const setNameTypeHandler = event => {
        props.onUpdateNameType(event.target.value)
    }

    const postSurveyHandler = () => {
        const accessToken = localStorage.getItem('accessToken');

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
            props.history.push('/my-surveys/' + res.data.surveyId);
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

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Date"
            value={props.selectedDate}
            onChange={setDateHandler}
            KeyboardButtonProps={{
                'aria-label': 'change date',
            }}
            />
        </MuiPickersUtilsProvider>
        <button onClick={postSurveyHandler}>Submit</button>
    </div>
}

const mapStateToProps = state => {
    return {
        nameType: state.create.nameType,
        eventName: state.create.eventName,
        selectedDate: state.create.selectedDate
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
