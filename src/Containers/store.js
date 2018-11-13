import { createStore, combineReducers, compose } from 'redux';
import { firebaseApp } from '../base';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase';
import UserInfoReducer from '../Containers/UserInfo/reducers';
import ChatReducer from '../Containers/Chat/reducers';
import FriendReducer from '../Containers/Friend/reducers';
import { SCREEN_NAME as USERINFO } from '../Containers/UserInfo/models';
import { SCREEN_NAME as CHAT } from '../Containers/Chat/models';
import { SCREEN_NAME as FRIEND } from '../Containers/Friend/models';

const rrfConfig = {

}

const createStoreWithFirebase = compose(
    reactReduxFirebase(firebaseApp, rrfConfig),
)(createStore);

const reducers = combineReducers({
    ['FIREBASE']: firebaseReducer,
    [USERINFO]: UserInfoReducer,
    [CHAT]: ChatReducer,
    [FRIEND]: FriendReducer,
});

const initialState = {};

const store = createStoreWithFirebase(reducers, initialState);

export default store;