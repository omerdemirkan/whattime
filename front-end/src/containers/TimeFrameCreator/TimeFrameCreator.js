import React, {useState} from 'react';
import classes from './TimeFrameCreator.module.css';

import { TimePicker } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import Button from '../../components/UI/Button/Button';

export default function TimeFrameCreator(props) {
    const minDate = new Date(props.date);
    const maxDate = new Date(props.date);
    maxDate.setDate(minDate.getDate() + 1);

    const [startTime, setStartTime] = useState(minDate);
    const [endTime, setEndTime] = useState(minDate);

    const submitHandler = () => {
        props.add({
            start: startTime.getTime(), 
            end: endTime.getTime()
        })
    }

    return <div className={classes.TimeFrameCreator}>
        <div className={classes.TimePickerBox}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <TimePicker 
                label="Start" 
                minDate={minDate}
                maxDate={maxDate}
                value={startTime} 
                onChange={setStartTime}
                className={classes.TimePicker}/>
                <TimePicker 
                label="End" 
                minDate={minDate}
                maxDate={maxDate}
                value={endTime} 
                onChange={setEndTime}
                className={classes.TimePicker}/>

            </MuiPickersUtilsProvider>
        </div>

        <Button
        onClick={submitHandler}
        buttonClasses="Large Border"
        style={{width: '100%'}}
        >ADD AVAILABILITY</Button>
    </div>
}
