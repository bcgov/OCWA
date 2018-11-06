import { combineReducers } from 'redux';
import app from './modules/app/reducer';
import data from './modules/data/reducer';
import requests from './modules/requests/reducer';

export default combineReducers({ app, data, requests });
