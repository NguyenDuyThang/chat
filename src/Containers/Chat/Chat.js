import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import Chat from '../../Components/Chat/Chat';
import { SCREEN_NAME as CHAT } from './models';
import { SCREEN_NAME as USER } from '../UserInfo/models';
import { updateChatHistory, updateChatIndex, updateChatUserID } from './actions';

const mapStateToProps = ( state ) => ({
    chatHistory: state[CHAT].chatHistory,
    chatIndex: state[CHAT].chatIndex,
    chatUserID: state[CHAT].chatUserID,
    userID: state[USER].userID,
});

const mapDispatchToProps = ( dispatch, props ) => ({
    updateChatHistory: ( data ) => {
        return dispatch(updateChatHistory(data));
    },
    updateChatIndex: ( index ) => {
        return dispatch(updateChatIndex)(index);
    },
    updateChatUserID: ( id ) => {
        return dispatch(updateChatUserID(id));
    }
});

export default compose(
    firebaseConnect(),
    connect(mapStateToProps, mapDispatchToProps),
)(Chat);