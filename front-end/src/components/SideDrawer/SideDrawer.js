import React from 'react';
import classes from './SideDrawer.module.css';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { NavLink } from 'react-router-dom';

export default function SideDrawer(props) {

    const logoutButtonPressedHandler = () => {
        props.setLogoutModal(true)
        props.close()
    }

    return <div className={classes.SideDrawer} style={props.show === true ? {transform: 'translate(0)'} : null}>
        {props.auth === true ?
            <ul className={classes.NavList}>
                <li className={classes.NavItem}>
                    <NavLink className={classes.Link} activeStyle={{color: '#6C63FF'}} to='/my-surveys' onClick={() => props.close()}>My Surveys</NavLink>
                </li>
                <li className={classes.NavItem}>
                    <NavLink className={classes.Link} activeStyle={{color: '#6C63FF'}} to='/create' onClick={() => props.close()}>Create</NavLink>
                </li>
                <li className={classes.NavItem}>
                    <span onClick={logoutButtonPressedHandler} className={classes.Link}>Logout</span>
                </li>
            </ul>
        : null}

        {props.auth === false ?
            <ul className={classes.NavList}>
                <li className={classes.NavItem}>
                    <NavLink exact className={classes.Link} activeStyle={{color: '#6C63FF'}} to='/' onClick={() => props.close()}>Home</NavLink>
                </li>
                <li className={classes.NavItem}>
                    <NavLink className={classes.Link} activeStyle={{color: '#6C63FF'}} to='/signup' onClick={() => props.close()}>Sign Up</NavLink>
                </li>
                <li className={classes.NavItem}>
                    <NavLink className={classes.Link} activeStyle={{color: '#6C63FF'}} to='/login' onClick={() => props.close()}>Log In</NavLink>
                </li>
            </ul>
        : null}
    </div>
}
