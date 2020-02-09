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

    return <div>
        <div className={classes.TimePickersBox}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <TimePicker 
                label="Start" 
                minDate={minDate}
                maxDate={maxDate}
                value={startTime} 
                onChange={setStartTime}
                style={{margin: '25px 0'}}
                className={classes.TimePicker}/>
                <TimePicker 
                label="End" 
                minDate={minDate}
                maxDate={maxDate}
                value={endTime} 
                onChange={setEndTime}
                style={{margin: '25px 0'}}
                className={classes.TimePicker}/>
            </MuiPickersUtilsProvider>
        </div>
        

        <Button
        onClick={submitHandler}
        buttonClasses="Medium Center"
        >Add availability</Button>
    </div>
}
