import { createAction } from 'redux-actions';
import { SCREEN_NAME } from './models';

export const updateUsername = createAction(`${SCREEN_NAME}_updateUsername`);
export const updateAvatar = createAction(`${SCREEN_NAME}_updateAvatar`);
export const updateOnlineStatus = createAction(`${SCREEN_NAME}_updateOnlineStatus`);
export const updateFriendList = createAction(`${SCREEN_NAME}_updateFriendList`);
export const updateUserID = createAction(`${SCREEN_NAME}_updateUserID`);