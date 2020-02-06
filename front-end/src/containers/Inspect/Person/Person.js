import React from 'react';
import TimeAgo from 'timeago-react';

export default function Person(props) {
    return <div>
        <h3>{props.name}</h3>
        <TimeAgo
        datetime={props.createdAt} 
        />
    </div>
}
