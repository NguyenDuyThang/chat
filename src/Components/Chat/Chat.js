import React, { Component } from 'react';
import './Chat.css';
import { firebaseApp } from "../../base";
import reducers from '../../Containers/Chat/reducers';

class Chat extends Component{
    constructor(props){
        super(props)
        this.state = {
            content: '',
            fileUpload: null,
            fileName: '',
            metaData: null
        }
    }

    _handleSendMessage = () => {
        if(this.state.content != '' && this.props.chatIndex != -1){
            const sendToMe = 'm' + this.state.content;
            const chatUserID = this.props.chatUserID;
            const userID = this.props.userID;
            firebaseApp
                .database()
                .ref('/')
                    .child(userID)
                    .child('friendList')
                    .child(this.props.chatIndex)
                    .child('historyChat').push(sendToMe);

            const indexToSend = [];
            firebaseApp
                .database()
                .ref('/')
                    .child(chatUserID)
                    .child('friendList').on('value', (snapshot) => {
                        const temp = snapshot.val();

                        for(let key in temp){
                            if(temp[key].userID == userID){
                                indexToSend.push(key);
                                break;
                            }
                        }
                    });

                const sendToFriend = 't' + this.state.content;

                firebaseApp
                    .database()
                    .ref('/')
                        .child(chatUserID)
                        .child('friendList')
                        .child(indexToSend[0])
                        .child('historyChat').push(sendToFriend);

                let temp = this.props.chatHistory;
                temp.push(sendToMe);
                
                this.props.updateChatHistory(temp);
            
            this.setState({content: ''});
        }
    }

    _handleImage = (event) => {
        if (event.target.files[0]) {
            const file = event.target.files[0];
            const metaData = {
                contentType: file.type,
            }
            this.setState({fileName: (+new Date())  + '-' + file.name});
            this.setState({metaData: metaData});

            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                //let blob = new Blob([reader.result], { type: "image/jpg" });
                this.setState({fileUpload: file});
            }
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

                            let link = null;

                            if(
                                (
                                    data.indexOf('.jpg') != -1 || data.indexOf('.png') != -1 || data.indexOf('.jpeg') != -1
                                ) 
                                &&  (
                                        data.indexOf('http') != -1 || data.indexOf('https') != -1
                                    )
                                )
                            {
                                link = <a href = {data}>
                                {data}
                                <div>
                                    <img
                                        src = {data}
                                        className = 'image-link'
                                    ></img>
                                </div>
                                </a>
                            }

                            return <li key = {index} className = {side == 'right' ? 'right-text' : 'left-text'}>
                                {side == 'right' ? 'You: ' : 'Friend: '}{link == null ? data : link}
                            </li>
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
                            // firebaseApp.storage().ref('T9HrOmq - Imgur.jpg').getDownloadURL().then((url) => {
                            //     this.setState({fileUpload: url});
                            // });
                            if(this.state.fileUpload){
                                firebaseApp
                                    .storage()
                                    .ref()
                                        .child(this.state.fileName)
                                            .put(this.state.fileUpload, this.state.metaData)
                                            .then((snapshot) => {
                                                snapshot.ref.getDownloadURL()
                                                .then((url) => {
                                                    this.setState(
                                                        {
                                                            content: url,
                                                            fileUpload: null
                                                        }, 
                                                        () => {this._handleSendMessage()}
                                                    );
                                                });
                                            }
                                        );
                            }
                            else{
                                this._handleSendMessage();
                            }
                        }}
                    >Send</button>
                    <input
                        className = 'pick-image'
                        type = "file"
                        onChange = {(event) => {
                            this._handleImage(event);
                        }}
                    />
                </div>
            </span>
        );
    }
}

export default Chat;