import React, {useRef, useState, useEffect} from 'react';
import classes from './Navbar.module.css';
import {NavLink} from 'react-router-dom';

// Redux
import {connect} from 'react-redux';

function Navbar(props) {

    const [navBackground, setNavBackground] = useState(false);
    const navRef = useRef();
    navRef.current = navBackground;
    useEffect(() => {
      const handleScroll = () => {
        const show = window.scrollY > 80
        if (navRef.current !== show) {
          setNavBackground(show)
        }
      }
      document.addEventListener('scroll', handleScroll)
      return () => {
        document.removeEventListener('scroll', handleScroll)
      }
    }, [])


    // Navbar is empty until authentication is determined.
    console.log(window.pageYOffset);
    return <div className={classes.Navbar} style={navBackground ? {backgroundColor: 'grey'} : null}>
        {!props.authLoading ? 
        <h2 className={classes.Logo}>meettime.app</h2>
        : null}
        {!props.authLoading && props.username ?
            <ul className={classes.NavList}>
                <li className={classes.NavItem}>
                    <NavLink className={classes.NavLink} to='/surveys'>My Surveys</NavLink>
                </li>
                <li className={classes.NavItem}>
                    <NavLink className={classes.NavLink} to='/create'>Create</NavLink>
                </li>
            </ul>
        : null}
        {!props.authLoading && !props.username ?
            <ul className={classes.NavList}>
                <li className={classes.NavItem}>
                    <NavLink className={classes.NavLink} to='/login'>Login</NavLink>
                </li>
                <li className={classes.NavItem}>
                    <NavLink className={classes.NavLink} to='/signup'>Sign Up</NavLink>
                </li>
            </ul>
        : null}

    </div>
}

const mapStateToProps = state => {
    return {
        username: state.auth.username,
        authLoading: state.auth.loading
    }
}

export default connect(mapStateToProps)(Navbar)
