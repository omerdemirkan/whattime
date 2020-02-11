import React from 'react';
import classes from './TimeFrame.module.css';
import getDisplayTime from '../../helper/getDisplayTime';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';

export default function TimeFrame(props) {
    return <div className={classes.TimeFrame}>
        <CloseRoundedIcon 
        size='small' 
        className={classes.CloseIcon}
        onClick={() => props.delete()}
        />
        
        <span className={classes.TextBox}>
            <p className={classes.Text}>{getDisplayTime(props.start)} - {getDisplayTime(props.end)}</p>
            
        </span>
    </div>
}
