import React from 'react';
import classes from './Window.module.css';

export default function Window(props) {
    const startPercentage=(props.timeframe.start - props.minDate) / 864000
    const windowPercentage=(props.timeframe.end - props.timeframe.start) / 864000
    return <div 
    className={classes.Window}
    style={{width: windowPercentage + '%', left: startPercentage + '%'}}
    >
        <span className={classes.Start}></span>
        <span className={classes.End}></span>
    </div>
}
