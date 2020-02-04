import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { BrowserRouter } from 'react-router-dom'

// Redux
import {combineReducers, createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';
import authReducer from './store/reducers/auth';
import createReducer from './store/reducers/create';
import surveysReducer from './store/reducers/surveys';
import submitReducer from './store/reducers/submit';
import notificationReducer from './store/reducers/notification';

import thunk from 'redux-thunk';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
    auth: authReducer,
    create: createReducer,
    surveys: surveysReducer,
    submit: submitReducer,
    notification: notificationReducer
});

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

ReactDOM.render(<Provider store={store}><BrowserRouter><App /></BrowserRouter></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
