import { createStore, combineReducers } from 'redux';
import UserInfoReducer from '../Containers/UserInfo/reducers';
import ChatReducer from '../Containers/Chat/reducers';
import { SCREEN_NAME as USERINFO } from '../Containers/UserInfo/models';
import { SCREEN_NAME as CHAT } from '../Containers/Chat/models';

const reducers = combineReducers({
    [USERINFO]: UserInfoReducer,
    [CHAT]: ChatReducer
});

const store = createStore(reducers);

export default store;