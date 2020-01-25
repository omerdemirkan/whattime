import React from 'react';
import classes from './Navbar.module.css';

// Redux
import {connect} from 'react-redux';

function Navbar(props) {
    console.log(props.authLoading);
    return <div className={classes.Navbar}>
        <h2 className={classes.Logo}>meettime.app</h2>
        
    </div>
}

const mapStateToProps = state => {
    return {
        username: state.auth.username,
        authLoading: state.auth.loading
    }
}

export default connect(mapStateToProps)(Navbar)
