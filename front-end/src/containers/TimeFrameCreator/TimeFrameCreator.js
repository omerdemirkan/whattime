import React, {useState} from 'react';
import classes from './TimeFrameCreator.module.css';

import { TimePicker } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider
} from '@material-ui/pickers';

export default function TimeFrameCreator(props) {

    const [startTime, setStartTime] = useState(props.date);
    const [endTime, setEndTime] = useState(props.date);

    console.log(typeof props.date);

    return <div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <TimePicker 
            label="Start" 
            defaultValue={props.date}
            value={startTime} 
            onChange={setStartTime} />
            <p>{startTime.toString()}</p>
            <TimePicker 
            label="End" 
            defaultValue={props.date}
            value={endTime} 
            onChange={setEndTime} />
            <p>{endTime.toString()}</p>
        </MuiPickersUtilsProvider>

        <button onClick={() => props.add({start: startTime, end: endTime})}>Add availability</button>
    </div>
}
