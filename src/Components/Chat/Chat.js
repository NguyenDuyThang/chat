import React, { Component } from 'react';
import './Chat.css';
import base, { firebaseApp } from "../../base";
import InfiniteScroll from 'react-infinite-scroller';

class Chat extends Component{
    constructor(props){
        super(props)
        this.state = {
            content: ''
        }
    }

    render(){
        return(
            <span className = 'chat'>
                <div className = "chat">
                    <ul className = 'chat-view'>
                        {this.props.chatHistory.map((data, index) => {
                            let side = null;
                            if(data.charAt(0) == 'm'){
                                side = 'right';
                            }
                            else if(data.charAt(0) == 't'){
                                side = 'left';
                            }
                            data = data.slice(1, data.length);

                            return <p key = {index}>
                                {side == 'right' ? 'Friend: ' : 'You: '}{data}
                            </p>
                        })}
                    </ul>
                    <input
                        className = 'input'
                        value = {this.state.content}
                        onChange = {(event) => {
                            this.setState({content: event.target.value});
                        }}
                    ></input>
                    <button 
                        className = 'button-send'
                        onClick = {() => {
                            if(this.state.content != '' && this.props.chatIndex != -1){
                                //console.log("Index: " + this.props.chatIndex + "USER ID:" + this.props.userID + "USER CHAT ID: " + this.props.chatUserID);
                                //const index = this.props.chatHistory.length;
                                const sendToMe = 'm' + this.state.content;
                                firebaseApp
                                    .database()
                                    .ref('/')
                                        .child(this.props.userID)
                                        .child('friendList')
                                        .child(this.props.chatIndex)
                                        .child('historyChat').push(sendToMe);

                                const sendToFriend = 't' + this.state.content;
                                firebaseApp
                                    .database()
                                    .ref('/')
                                        .child(this.props.chatUserID)
                                        .child('friendList')
                                        .child(this.props.chatIndex)
                                        .child('historyChat').push(sendToFriend);

                                let temp = this.props.chatHistory;
                                temp.push(sendToFriend);
                                
                                this.props.updateChatHistory(temp);
                                this.setState({content: ''});
                            }
                        }}
                    >Send</button>
                </div>
            </span>
        );
    }
}

export default Chat;