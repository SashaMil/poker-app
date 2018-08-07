import { all } from 'redux-saga/effects';
import userSaga from './userSaga';
import loginSaga from './loginSaga';
import tableSaga from './tableSaga';


export default function* rootSaga() {
  yield all([
    userSaga(),
    loginSaga(),
    tableSaga(),
    // watchIncrementAsync()
  ]);
}
