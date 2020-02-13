import React from 'react';
import classes from './Availabilities.module.css';
import Window from './Window/Window';

export default function Availabilities(props) {

    return <div className={classes.AvailabilitiesBox}>
        <div className={classes.Availabilities}>
            {props.timeframes.map(timeframe => {
                return <Window
                date={props.date}
                timeframe={timeframe}
                key={timeframe.start}
                deleteByStartTime={props.deleteByStartTime ? props.deleteByStartTime : null}
                minDate={new Date(props.date).getTime()}/>
            })}
        </div>

    </div>
}
