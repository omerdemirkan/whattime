import React from 'react';
import classes from './HomePage.module.css';

// SVG images
import shapes from '../../images/shapes.svg';
import clock from '../../images/clock.svg'

import Button from '../UI/Button/Button';
import { Link } from 'react-router-dom'

export default function HomePage() {
    return <div className={classes.HomePage}>
        
        <div className={classes.Hero}>

            {/* Background svg: */}
            <img 
            src={shapes}
            className={classes.Shapes}/>
            <div className={classes.HeroTextArea}>
                <h1 className={classes.MainHeroHeader}>Get your team on the same page.</h1>
                <h3 className={classes.SecondaryHeroHeader}>Find out what times everyone is available</h3>
                <div className={classes.ButtonsBox}>
                    <Link to='/signup'>
                        <Button
                        buttonClasses='Large Fill'
                        style={{height: '50px', width: '250px', margin: '10px 0'}}
                        >Sign Up For Free</Button>
                    </Link>

                    <Link to='/login'>
                        <Button
                        buttonClasses='Large Border'
                        style={{height: '50px', width: '250px', margin: '10px 0'}}>Log In</Button>
                    </Link>
                </div>
            </div>
            <img 
            src={clock}
            className={classes.Clock}/>
        </div>
        <div className={classes.SecondaryBox}>
            
        </div>
    </div>
}
