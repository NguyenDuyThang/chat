import React, { Component } from "react";
import base, { firebaseApp } from "../../base";
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import Images from '../../Images';
import './Friend.css';

class Friend extends Component {
    constructor(props){
        super(props)
        this.state = {
            data: null,
            clicked: false,
            favorited: false,
        }
    }

    componentDidMount(){
        if(this.props.mainUserID){
            this._getFriendData();

            this._getFavoritedStatus();
        }
    }

    _getFavoritedStatus = () => {
        firebaseApp.database().ref('/').child(this.props.mainUserID).on('value', (snapshot) => {
            const favorited = snapshot.val().friendList;

            for(let key in favorited){
                if(favorited[key].userID == this.props.userID){
                    this.setState({favorited: favorited[key].favorited});
                }
            }
        });
    }

    _getFriendData = () => {
        firebaseApp.database().ref('/').child(this.props.userID).on('value', (snapshot) => {
            this.setState({data: snapshot.val()});

            if(this.state.clicked){
                firebaseApp.database().ref('/').child(this.props.mainUserID).on('value', (snapshot) => {
                    const history = snapshot.val().friendList;
                    let temp = null;
                    for(let key in history){
                        if(history[key].userID == this.props.userID){
                            temp = history[key].historyChat;
                        }
                    }

                    let historyChat = [];
                    for(let key in temp){
                        historyChat.push(temp[key]);
                    }
                    
                    this.props.updateChatHistory(historyChat);
                    this.props.updateChatIndex(this.props.index);
                    this.props.updateChatUserID(this.state.data.userID);
                });
            }
        });
    }

    _setFavoriteFriend = () => {
        firebaseApp
            .database()
            .ref('/')
                .child(this.props.mainUserID)
                .child('friendList')
                .child(this.props.index)
                    .update({favorited: this.state.favorited});
    }

    render(){
        if(this.state.data){
            return(
                <span className = 'container'>
                    <button 
                        className = 'button' 
                        onClick = {() => {
                            firebaseApp.database().ref('/').child(this.props.mainUserID).on('value', (snapshot) => {
                                const history = snapshot.val().friendList;
                                let temp = null;
                                for(let key in history){
                                    if(history[key].userID == this.props.userID){
                                        temp = history[key].historyChat;
                                    }
                                }

                                let historyChat = [];
                                for(let key in temp){
                                    historyChat.push(temp[key]);
                                }
                                
                                this.props.updateChatHistory(historyChat);
                                this.props.updateChatIndex(this.props.index);
                                this.props.updateChatUserID(this.state.data.userID);

                                this.setState({clicked: true});
                            });
                        }}>
                        <img
                            className = "avatar"
                            src = {this.state.data.avatar}
                        >
                        </img>
                        <span type="text" id="email">
                            {' '}{this.state.data.username}
                        </span>
                        <div>
                            <span type="text" id="email">
                                {' '}{this.state.data.onlineStatus}
                            </span>
                        </div>
                    </button>
                    <button onClick = {() => {
                        this.setState(
                            {
                                favorited: !this.state.favorited
                            }, 
                            ()=>{
                                this._setFavoriteFriend();
                            }
                        );
                    }}>
                        <img
                            src = {this.state.favorited ? Images.favorited : Images.notFavorited} 
                            className = 'image'
                        />
                    </button>
                </span>
            );
        }
        return null;
    }
}

export default Friend;