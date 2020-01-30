import React, {useEffect} from 'react';
import './App.css';
import axios from './axios';

import {connect} from 'react-redux';
import * as actionTypes from './store/actions/actionTypes';

import { Switch, Route } from 'react-router-dom'

import Navbar from './containers/Navbar/Navbar';
import HomePage from './components/HomePage/HomePage';
import Login from './containers/Login/Login';
import SignUp from './containers/SignUp/SignUp';
import Create from './containers/Create/Create';
import MySurveys from './containers/MySurveys/MySurveys'
import Inspect from './containers/Inspect/Inspect';
import Submit from './containers/Submit/Submit';

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

        localStorage.setItem('accessToken', refreshedAccessToken);
      })
      .catch(err => {
        if (err) {
          props.onAuthenticationFailure();
        }
      });
    } else {
      props.onAuthenticationFailure();
    }
    window.scrollTo(0, 0)
  }, []);



  return <div className="App">
    <Navbar/>
    <Switch>
      <Route path='/my-surveys/:id' component={Inspect}/>
      <Route path='/my-surveys' component={MySurveys}/>
      <Route path="/submit/:id" component={Submit}/>
      <Route path='/create' component={Create}/>
      <Route path='/signup' component={SignUp} />
      <Route path='/login' component={Login} />
      <Route path='/' component={HomePage} />
    </Switch>
  </div>
}

const mapDispatchToProps = dispatch => {
  return {
    onAuthenticationSuccess: (username, accessToken) => dispatch({type: actionTypes.AUTHENTICATION_SUCCESS, username: username, accessToken: accessToken}),
    onAuthenticationFailure: () => dispatch({type: actionTypes.AUTHENTICATION_FAILURE})
  }
}

export default connect(null, mapDispatchToProps)(App);
