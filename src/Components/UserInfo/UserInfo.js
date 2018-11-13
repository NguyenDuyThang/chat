import React, { Component } from "react";
import firebase from "firebase";
import Login from "../Login/Login";
import { firebaseApp } from "../../base";
import './UserInfo.css';
import Friend from '../../Containers/Friend/Friend';
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import Chat from '../../Containers/Chat/Chat';
import Images from '../../Images';

class UserInfo extends Component {
    constructor(props){
        super(props)
        this.state = {
            userID: null,
            searchContent: '',
            allUsers: null,
        };
    }

    componentDidMount(){
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this._getAllUsers();
                this.authHandler({ user });
                this._getFriends();
            }
        });
    }

    _getFriends = () => {
        firebaseApp.database().ref('/').child(this.state.userID).on('value', (snapshot) => {
            snapshot = snapshot.val();

            const t = snapshot.friendList;
            const temp = [];
            for(let key in t){
                temp.push(t[key]);
            }

            const favorited = temp.filter((item, index) => {
                return item.favorited == true;
            })

            const notFavorited = temp.filter((item, index) => {
                return item.favorited == false;
            })

            let result = favorited;
            result = result.concat(notFavorited);

            firebaseApp
            .database()
            .ref('/')
                .child(this.state.userID)
                .child('friendList')
                .set(result);

            result = result.map((item, index) => {
                let res = {
                    index: index,
                    ...item
                }
                return res;
            })

            this.props.updateFriendList(result);
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
        firebaseApp.database().ref('/').child(user.uid).child('userID').set(
            user.uid
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

    _searchFriends = (content) => {
        if(content == ''){
            this._getFriends();
        }
        else{
            let temp = this.props.friendList;

            let result = [];
            temp.forEach((item, index) => {
                firebaseApp.database().ref('/').child(item.userID).on('value', (snapshot) => {
                    const username = snapshot.val().username;
                    
                    if(username.indexOf(content) != -1){
                        result.push(item);
                    }
                });
            });

            this.props.updateFriendList(result);
        }
    }

    _getAllUsers = () => {
        firebaseApp.database().ref('/').on('value', (snapshot) => {
            const temp = snapshot.val();
            this.setState({allUsers: temp});
        });
    }

    _addNewFriendsTo = (userID) => {
        if(this.props.friendList.length > 0){
            const temp = this.state.allUsers;
            let tempList = this.props.friendList;
            const friendList = [];

            for(let key in temp){
                if(userID != temp[key].userID){
                    //alert(JSON.stringify(item.userID + ":::" + temp[key].userID));
                    let userExisted = false;
                    tempList.forEach((item, index) => {
                        if(item.userID == temp[key].userID){
                            userExisted = true;
                        }
                    })

                    if(!userExisted){
                        const friend = {
                            favorited: false,
                            historyChat: "",
                            userID: temp[key].userID
                        }

                        const me = {
                            favorited: false,
                            historyChat: "",
                            userID: userID
                        }

                        friendList.push(friend);

                        firebaseApp.database().ref('/').child(userID).child('friendList').push(friend);

                        const t = temp[key].friendList;
                        let existed = false;
                        for(let key in t){
                            if(t[key].userID == userID){
                                existed = true;
                            }
                        }

                        if(!existed){
                            firebaseApp.database().ref('/').child(temp[key].userID).child('friendList').push(me);
                        }
                    }
                }
            }
            tempList = tempList.concat(friendList);

            this.props.updateFriendList(tempList);
        }
    }

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
                <div className = 'search'>
                    <input
                        placeholder = 'Search friends'
                        onChange = {(event) => {
                            if(event.target.value == ""){
                                this._getFriends();
                            }
                            this.setState({searchContent: event.target.value});
                        }}
                    ></input>
                    <button
                        onClick = {() => {
                            this._searchFriends(this.state.searchContent);
                        }}
                    >
                        Search
                    </button>
                </div>
                {this.props.friendList && this.props.friendList.map((person, index) => {
                    return (
                        <div key = { (+new Date()) + "-" + index}>
                            <Friend
                                userID = {person.userID}
                                index = {person.index}
                            /> 
                        </div>
                    )
                })}
                <div>
                {logout}
                <span className = 'refresh'>
                    <button
                        onClick = {() => {
                            this._addNewFriendsTo(this.state.userID);
                        }}
                    >
                        Refresh list
                    </button>
                </span>
                </div>
            </div>
        );
    }
}

export default UserInfo;