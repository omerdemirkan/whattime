import React, {useEffect} from 'react';
import './App.css';

import {connect} from 'react-redux';
import * as actionTypes from './store/actions/actionTypes';

import axios from './axios';

import Navbar from './containers/Navbar/Navbar';

function App(props) {

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      axios.get('/auth/verify', {
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      })
      .then(res => {

        const refreshedAccessToken = res.data.accessToken;
        const username = res.data.username;

        props.onAuthenticationSuccess(username, refreshedAccessToken);

        console.log(refreshedAccessToken);
        localStorage.setItem('accessToken', refreshedAccessToken);
      })
      .catch(err => {
        console.log(err);
      });
    }
  }, []);

  return <div className="App">
    <Navbar/>
    
  </div>
}

const mapDispatchToProps = dispatch => {
  return {
    onAuthenticationSuccess: (username, accessToken) => dispatch({type: actionTypes.AUTHENTICATION_SUCCESS, username: username})
  }
}

export default connect(null, mapDispatchToProps)(App);
