import React, {useState} from 'react';
import classes from './Create.module.css';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const sameDate = (first, second) => {
    return first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();
}

export default function Create() {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const dateChangeHandler = date => {
        const today = new Date()
        if (date >= today || sameDate(date, today)) {
            setSelectedDate(date);
        }
    };

    return <div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Date picker inline"
            value={selectedDate}
            onChange={dateChangeHandler}
            KeyboardButtonProps={{
                'aria-label': 'change date',
            }}
            />
        </MuiPickersUtilsProvider>
        
    </div>
}
