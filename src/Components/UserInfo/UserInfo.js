import React, { Component } from "react";
import firebase from "firebase";
import Login from "../Login/Login";
import base, { firebaseApp } from "../../base";
import './UserInfo.css';
import Friend from '../../Containers/Friend/Friend';
import Chat from '../../Containers/Chat/Chat';

class UserInfo extends Component {
    constructor(props){
        super(props)
        this.state = {
            userID: null,
        };
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log(JSON.stringify(user));
            this.authHandler({ user });
            this._getFriends();
        }
        });
    }

    // authHandler = async response => {
    //     const email = response.profileObj.email;
    //     const displayName = response.profileObj.givenName + response.profileObj.familyName;
    //     this.setState({
    //     email: email,
    //     displayName: displayName
    //     });
    // };

    _getFriends = () => {
        firebaseApp.database().ref('/').child(this.state.userID).on('value', (snapshot) => {
            snapshot = snapshot.val();
            this.props.updateFriendList(snapshot.friendList);
        });
    }

    authHandler = authData => {
        const user = authData.user;
        this.props.updateUsername(user.displayName);
        this.props.updateAvatar(user.photoURL);
        this.props.updateUserID(user.uid);
        this.setState({
            userID: user.uid,
        });
        firebaseApp.database().ref('/').child(user.uid).child('onlineStatus').set(
            'online'
        )
        firebaseApp.database().ref('/').child(user.uid).child('avatar').set(
            user.photoURL
        )
        firebaseApp.database().ref('/').child(user.uid).child('username').set(
            user.displayName
        )
    };

    authenticate = provider => {
        try{
            // console.log(JSON.stringify(provider));
            const authProvider = new firebase.auth[`${provider}AuthProvider`]();
            firebaseApp
            .auth()
                .signInWithPopup(authProvider)
                    .then(this.authHandler);
        }
        catch(e){
            console.error(e);
        }
    };

    logout = async () => {
        console.log("logout");
        await firebase.auth().signOut();
        this.props.updateUsername(null);
        this.props.updateAvatar(null);
        this.props.updateUserID(null);

        const time = new Date();
        const hour = time.getHours();
        const minutes = time.getMinutes();
        const result = hour + ":" + minutes + " " + time.toDateString();
        firebaseApp.database().ref('/').child(this.state.userID).child('onlineStatus').set(
            result
        )
    };

    render() {
        const logout = <button onClick={this.logout}>Log Out!</button>;
        if (!this.props.username) {
            return <Login authenticate={this.authenticate} />;
        }
        return (
            <div className = 'view'>
                <Chat/>
                <div>
                    <p>Welcome: {this.props.username}</p>
                    <img className = 'avatar' src = {this.props.avatar}></img>
                </div>
                <div>Friends</div>
                {this.props.friendList && this.props.friendList.map((person, index) => (
                    <div key = {index}>
                        <Friend 
                            userID = {person.userID}
                            index = {index}
                        /> 
                    </div>
                ))}
                <div>{logout}</div>
            </div>
        );
    }
}

export default UserInfo;