import React, { Component, Fragment } from "react";
import firebase from "firebase";
import Login from "../Login/Login";
import base, { firebaseApp } from "../../base";

class UserInfo extends Component {
    constructor(props){
        super(props)
        this.state = {
            email: null,
            displayName: null
        };
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
        if (user) {
            this.authHandler({ user });
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

    authHandler = authData => {
        const user = authData.user;
        this.setState({
            email: user.email,
            displayName: user.displayName
        });
    };

    authenticate = provider => {
        try{
            // console.log(JSON.stringify(provider));
            const authProvider = new firebase.auth[`${provider}AuthProvider`]();
            console.log(JSON.stringify(authProvider));
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
        this.setState({ email: null, displayName: null });
    };

    render() {
        const logout = <button onClick={this.logout}>Log Out!</button>;
        if (!this.state.email) {
        return <Login authenticate={this.authenticate} />;
        }
        return (
            <Fragment>
                <div className="user-info">
                <label>User name: </label>
                <span type="text" id="email">
                    {' '}{this.state.displayName}
                </span>
                </div>
                <div className="user-info">
                    <label>Email: </label>
                    <span type="text" id="email">
                        {' '}{this.state.email}
                    </span>
                </div>
                <div>{logout}</div>
            </Fragment>
        );
    }
}

export default UserInfo;