import React from 'react';
import classes from './Window.module.css';

import getDisplayTime from '../../../helper/getDisplayTime';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export default function Window(props) {
    const startPercentage=(props.timeframe.start - props.minDate) / 864000;
    const windowPercentage=(props.timeframe.end - props.timeframe.start) / 864000;
    const screenIsSmall = useMediaQuery('(max-width:900px)');
    const smallWindow = screenIsSmall ? 12 : 8;
    return <div 
    className={classes.Window}
    style={{width: windowPercentage + '%', left: startPercentage + '%'}}
    >
        {/* Special translations for very small timeframes to avoid visual overlap */}
        <span style={windowPercentage < smallWindow ? {transform: 'translate(-100%)'} : {}} className={classes.Start}>{getDisplayTime(props.timeframe.start)}</span>
        <span style={windowPercentage < smallWindow ? {transform: 'translate(100%)'} : {}} className={classes.End}>{getDisplayTime(props.timeframe.end)}</span>
        {props.deleteByStartTime ? 
            <div className={classes.DeleteBox}>
                <span 
                className={classes.Delete}
                onClick={() => props.deleteByStartTime(props.timeframe.start)}>DELETE</span>
            </div>
        : null}
    </div>
}
