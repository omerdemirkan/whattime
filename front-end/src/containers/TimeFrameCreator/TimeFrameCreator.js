import React, {useState} from 'react';
import classes from './TimeFrameCreator.module.css';

import { TimePicker } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider
} from '@material-ui/pickers';

export default function TimeFrameCreator(props) {
    const minDate = new Date(props.date);
    const maxDate = minDate;
    maxDate.setDate(minDate.getDate() + 1);

    const [startTime, setStartTime] = useState(minDate);
    const [endTime, setEndTime] = useState(minDate);

    const submitHandler = () => {
        props.add({
            start: startTime.getTime(), 
            end: endTime.getTime()
        })
    }

    return <div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <TimePicker 
            label="Start" 
            minDate={minDate}
            maxDate={maxDate}
            value={startTime} 
            onChange={setStartTime} />
            <p>{startTime.toString()}</p>
            <TimePicker 
            label="End" 
            minDate={minDate}
            maxDate={maxDate}
            value={endTime} 
            onChange={setEndTime} />
            <p>{endTime.toString()}</p>
        </MuiPickersUtilsProvider>

        <button onClick={submitHandler}>Add availability</button>
    </div>
}
