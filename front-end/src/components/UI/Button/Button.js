import React from 'react';
import classes from './Button.module.css';

export default function Button(props) {
    const classNamesArray = props.buttonClasses ? props.buttonClasses.split(' ') : [];
    let classNamesString = '';
    classNamesArray.forEach(className => {
        classNamesString += (classes[className] + ' ' || '')
    });

    return <button {...props} className={classNamesString} >
        {props.children}
    </button>
}