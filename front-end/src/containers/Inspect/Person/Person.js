import React from 'react';

export default function Person(props) {
    return <div>
        <h3>{props.name}</h3>
        <p>{props.createdAt}</p>
    </div>
}
