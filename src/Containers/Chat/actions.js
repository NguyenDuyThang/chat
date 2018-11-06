import { createAction } from 'redux-actions';
import { SCREEN_NAME } from './models';

export const updateChatHistory = createAction(`${SCREEN_NAME}_updateChatHistory`);
export const updateChatIndex = createAction(`${SCREEN_NAME}_updateChatIndex`);
export const updateChatUserID = createAction(`${SCREEN_NAME}_updateChatUserID`);