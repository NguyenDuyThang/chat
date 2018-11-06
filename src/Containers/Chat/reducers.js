import { handleActions } from 'redux-actions';
import * as actions from './actions';

const defaultState = {
    chatHistory: [],
    chatIndex: -1,
    chatUserID: null
};

const handler = {
    [actions.updateChatHistory]: ( state, action ) => ({
        ...state,
        ...{ chatHistory: action.payload }
    }),
    [actions.updateChatIndex]: ( state, action ) => ({
        ...state,
        ...{ chatIndex: action.payload }
    }),
    [actions.updateChatUserID]: ( state, action ) => ({
        ...state,
        ...{ chatUserID: action.payload }
    })
};

export default handleActions(handler, defaultState);