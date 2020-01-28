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

const sameDate = (first, second) => {
    return first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();
}

export default function Create() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [eventName, setEventName] = useState('');
    const [nameType, setNameType] = useState('');

    const setDateHandler = date => {
        const today = new Date()
        if (date >= today || sameDate(date, today)) {
            setSelectedDate(date);
        }
    };

    const setEventNameHandler = event => {
        setEventName(event.target.value);
    }

    const setNameTypeHandler = event => {
        setNameType(event.target.value)
    }

    const postSurveyHandler = (props) => {
        const accessToken = localStorage.getItem('accessToken');

        axios.post('/user/surveys', {
            event: eventName,
            nameType: nameType,
            date: selectedDate
        }, {
            headers: {
                Authorization: 'Bearer ' + accessToken
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
        <TextField 
        id="standard-basic" 
        label="Event Name" 
        value={eventName}
        onChange={setEventNameHandler}/>

        <InputLabel id="demo-simple-select-label">Identifier</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={nameType}
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
            value={selectedDate}
            onChange={setDateHandler}
            KeyboardButtonProps={{
                'aria-label': 'change date',
            }}
            />
        </MuiPickersUtilsProvider>
        <button onClick={postSurveyHandler}>Submit</button>
    </div>
}
