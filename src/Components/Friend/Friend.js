import React, { Component } from "react";
import base, { firebaseApp } from "../../base";
import './Friend.css';

class Friend extends Component {
    constructor(props){
        super(props)
        this.state = {
            data: null,
            clicked: false,
        }
    }

    componentDidMount(){
        firebaseApp.database().ref('/').child(this.props.userID).on('value', (snapshot) => {
            this.setState({data: snapshot.val()});
            console.log("Data: " + JSON.stringify(snapshot.val()));
            if(this.state.clicked){
                firebaseApp.database().ref('/').child(this.props.mainUserID).on('value', (snapshot) => {
                    const temp = snapshot.val().friendList[this.props.index].historyChat;
                    let history = [];
                    for(let key in temp){
                        history.push(temp[key]);
                    }
                    
                    this.props.updateChatHistory(history);
                    this.props.updateChatIndex(this.props.index);
                    this.props.updateChatUserID(this.state.data.userID);
                });
            }

            
        });
    }

    render(){
        if(this.state.data){
            return(
                <button 
                    className = 'button' 
                    onClick = {() => {
                        firebaseApp.database().ref('/').child(this.props.mainUserID).on('value', (snapshot) => {
                            const temp = snapshot.val().friendList[this.props.index].historyChat;
                            let history = [];
                            for(let key in temp){
                                history.push(temp[key]);
                            }
                            
                            this.props.updateChatHistory(history);
                            this.props.updateChatIndex(this.props.index);
                            this.props.updateChatUserID(snapshot.val().friendList[this.props.index].userID);
                            //console.log("CHat USER ID: " + this.state.data.userID);
                            //console.log("Data click: " + JSON.stringify(snapshot.val()));

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
            );
        }
        return null;
    }
}

export default Friend;