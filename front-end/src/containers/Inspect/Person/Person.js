import React from 'react';
import classes from './Person.module.css';
import TimeAgo from 'timeago-react';

export default function Person(props) {
    return <span className={classes.Person}>
        <div className={classes.Main}>
            <h3 className={classes.Name}>{props.name}</h3>
            <TimeAgo
            className={classes.TimeAgo}
            datetime={props.createdAt} 
            />
        </div>
        
        
    </span>
}
