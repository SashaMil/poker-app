import { combineReducers } from 'redux';
import user from './userReducer';
import login from './loginReducer';
import table from './tableReducer';


const store = combineReducers({
  user,
  login,
  table,
});

export default store;
