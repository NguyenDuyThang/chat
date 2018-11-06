import { connect } from 'react-redux';
import UserInfo from '../../Components/UserInfo/UserInfo';
import { SCREEN_NAME as USERINFO } from './models';
import { 
    updateUsername,
    updateAvatar,
    updateOnlineStatus,
    updateFriendList,
    updateUserID
} from './actions';

const mapStateToProps = ( state ) => ({
    username: state[USERINFO].username,
    avatar: state[USERINFO].avatar,
    onlineStatus: state[USERINFO].onlineStatus,
    friendList: state[USERINFO].friendList
});

const mapDispatchToProps = ( dispatch, props ) => ({
    updateUsername: ( name ) => {
        return dispatch(updateUsername(name));
    },
    updateAvatar: ( avatar ) => {
        return dispatch(updateAvatar(avatar));
    },
    updateOnlineStatus: ( status ) => {
        return dispatch(updateOnlineStatus(status));
    },
    updateFriendList: ( list ) => {
        return dispatch(updateFriendList(list));
    },
    updateUserID: ( id ) => {
        return dispatch(updateUserID(id));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);