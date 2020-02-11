import React from 'react';
import classes from './Availabilities.module.css';

export default function Availabilities(props) {
    const minDate = new Date(props.date).getTime();
    return <div className={classes.AvailabilitiesBox}>
        <div className={classes.Availabilities}>
        {props.timeframes.map(timeframe => {
            const startPercentage = (timeframe.start - minDate) / 864000;
            const windowPercentage = (timeframe.end - timeframe.start) / 864000;
            return <div 
            className={classes.Window}
            style={{width: windowPercentage + '%', left: startPercentage + '%'}}
            ></div>
        })}
    </div>
    </div>
}
