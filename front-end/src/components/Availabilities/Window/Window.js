import React from 'react';
import classes from './Window.module.css';

import getDisplayTime from '../../../helper/getDisplayTime';

export default function Window(props) {
    const startPercentage=(props.timeframe.start - props.minDate) / 864000
    const windowPercentage=(props.timeframe.end - props.timeframe.start) / 864000
    return <div 
    className={classes.Window}
    style={{width: windowPercentage + '%', left: startPercentage + '%'}}
    >
        <span style={windowPercentage < 5 ? {transform: 'translate(-100%)'} : {}} className={classes.Start}>{getDisplayTime(props.timeframe.start)}</span>
        <span style={windowPercentage < 5 ? {transform: 'translate(100%)'} : {}} className={classes.End}>{getDisplayTime(props.timeframe.end)}</span>
    </div>
}
