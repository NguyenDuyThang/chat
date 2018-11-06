import React, { Component } from "react";
import './Login.css';

class Login extends Component {
    _onSucces = (response) => {
        console.log('Success: ' + JSON.stringify(response.profileObj));
        this.props.authenticate("Google");
    }

    _onFail = (response) => {
        console.log('Fail: ' + JSON.stringify(response));
    }

    render(){
        return(
            // <GoogleLogin
            //     clientId="284653487513-4lhp6lv431q0rvdqf6qir9cethaicfmk.apps.googleusercontent.com"
            //     buttonText="Login with Google"
            //     onSuccess = {() => {this.props.authenticate("Google")}}
            //     onFailure = {this._onFail}
            // />
            <button className = "google-login" onClick = {() => {this.props.authenticate("Google")}}>
                <text className = "google-logintext">
                    Login with Google
                </text>
            </button>
        );
    }
}

export default Login;