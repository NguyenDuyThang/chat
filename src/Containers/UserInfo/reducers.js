import { handleActions } from 'redux-actions';
import * as actions from './actions';

const defaultState = {
    username: '',
    userID: null,
    avatar: null,
    onlineStatus: null,
    friendList: []
};

const handler = {
    [actions.updateUsername]: ( state, action ) => ({
        ...state,
        ...{ username: action.payload }
    }),
    [actions.updateAvatar]: ( state, action ) => ({
        ...state,
        ...{ avatar: action.payload }
    }),
    [actions.updateOnlineStatus]: ( state, action ) => ({
        ...state,
        ...{ onlineStatus: action.payload }
    }),
    [actions.updateFriendList]: ( state, action ) => ({
        ...state,
        ...{ friendList: action.payload }
    }),
    [actions.updateUserID]: ( state, action ) => ({
        ...state,
        ...{ userID: action.payload }
    })
};

export default handleActions(handler, defaultState);