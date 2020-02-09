import React from 'react';
import classes from './TimeFrame.module.css';
import getDisplayTime from '../../helper/getDisplayTime';

export default function TimeFrame(props) {
    return <div>
        <p>{getDisplayTime(props.start)} - {getDisplayTime(props.end)}</p>
    </div>
}
