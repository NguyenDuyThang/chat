import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import Friend from '../../Components/Friend/Friend';
import { SCREEN_NAME as CHAT } from '../Chat/models';
import { SCREEN_NAME as USER } from '../UserInfo/models';
import { updateChatHistory, updateChatIndex, updateChatUserID } from '../Chat/actions';

const mapStateToProps = ( state ) => ({
    chatHistory: state[CHAT].chatHistory,
    mainUserID: state[USER].userID,
});

const mapDispatchToProps = ( dispatch, props ) => ({
    updateChatHistory: ( data ) => {
        return dispatch(updateChatHistory(data));
    },
    updateChatIndex: ( index ) => {
        return dispatch(updateChatIndex(index));
    },
    updateChatUserID: ( id ) => {
        return dispatch(updateChatUserID(id));
    },
});

export default compose(
    firebaseConnect(),
    connect(mapStateToProps, mapDispatchToProps),
)(Friend);