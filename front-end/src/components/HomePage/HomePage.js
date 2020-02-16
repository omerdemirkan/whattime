import React from 'react';
import classes from './HomePage.module.css';

// SVG images
import shapes from '../../images/shapes.svg';
import clock from '../../images/clock.svg';
import timeline from '../../images/timeline.svg';
import mail from '../../images/mail.svg';
import calendar from '../../images/calendar.svg';

import Button from '../UI/Button/Button';
import { Link } from 'react-router-dom'
import useMediaQuery from '@material-ui/core/useMediaQuery';


export default function HomePage() {

    const screenIsSmall = useMediaQuery('(max-width:600px)');

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
                        style={{height: '50px', width: screenIsSmall ? '90vw' : '250px', margin: '10px 0'}}
                        >Sign Up For Free</Button>
                    </Link>

                    <Link to='/login'>
                        <Button
                        buttonClasses='Large Border'
                        style={{height: '50px', width: screenIsSmall ? '90vw' : '250px', margin: '10px 0'}}>Log In</Button>
                    </Link>
                </div>
            </div>
            <img 
            src={clock}
            className={classes.Clock}/>
        </div>
        <div className={classes.SecondaryBox}>
            <div className={classes.Pair}>
                <img src={mail} className={classes.PairImage}/>
                <p className={classes.PairText}>No more frantic back-and-forth emails and messages to organize one event.</p>
            </div>
            <div className={classes.Pair}>
                <img src={timeline} className={classes.PairImage}/>
                <p className={classes.PairText}>No more juggling availabilities to find out what times people will be available.</p>
                
            </div>
            <div className={classes.Pair}>
                <img src={calendar} className={classes.PairImage}/>
                <p className={classes.PairText}>No more calculating time zones for your international online group.</p>
            </div>
        </div>
    </div>
}
