import React from 'react';
import classes from './HomePage.module.css';
import shapes from '../../images/shapes.svg';

export default function HomePage() {
    return <div className={classes.HomePage}>
        <img 
        src={shapes}
        className={classes.Shapes}/>
    </div>
}
