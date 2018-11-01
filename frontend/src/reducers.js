import { combineReducers } from 'redux';
import app from './modules/app/reducer';
import data from './modules/data/reducer';

export default combineReducers({ app, data });
