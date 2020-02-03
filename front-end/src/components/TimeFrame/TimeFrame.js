import React from 'react';
import classes from './TimeFrame.module.css';

function getDisplayTime(date) {
    const hours = date.getHours();
    const modifier = hours >= 12 ? 'PM' : 'AM';
    return (hours % 12) + ':' + date.getMinutes() + modifier;
}

export default function TimeFrame(props) {
    console.log(typeof props.start);
    return <div>
        <p>Start: {props.start}</p>
        <p>End: {props.end}</p>
    </div>
}
