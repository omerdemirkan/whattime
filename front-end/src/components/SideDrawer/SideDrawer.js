import React from 'react';
import classes from './SideDrawer.module.css';

import { NavLink } from 'react-router-dom';

export default function SideDrawer(props) {

    const logoutButtonPressedHandler = () => {
        props.setLogoutModal(true)
    }

    console.log(props.auth);
    return <div className={classes.SideDrawer} style={props.show === true ? {transform: 'translate(0)'} : null}>
        {props.auth === true ?
            <ul className={classes.NavList}>
                <li className={classes.NavItem}>
                    <NavLink className={classes.Link} to='/my-surveys'>My Surveys</NavLink>
                </li>
                <li className={classes.NavItem}>
                    <NavLink className={classes.Link} to='/create'>Create</NavLink>
                </li>
                <li className={classes.NavItem}>
                    <span onClick={logoutButtonPressedHandler} className={classes.Link}>Logout</span>
                </li>
            </ul>
        : null}

        {props.auth === false ?
            <ul className={classes.NavList}>
                <li className={classes.NavItem}>
                    <NavLink className={classes.Link} to='/'>Home</NavLink>
                </li>
                <li className={classes.NavItem}>
                    <NavLink className={classes.Link} to='/signup'>Sign Up</NavLink>
                </li>
                <li className={classes.NavItem}>
                    <NavLink className={classes.Link} to='/login'>Log In</NavLink>
                </li>
            </ul>
        : null}
    </div>
}
