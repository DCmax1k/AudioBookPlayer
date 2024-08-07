import React, { Component } from 'react';
import sendData from '../util/sendData';

import Input from './Input';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            email: '',
            signupBtnText: 'Submit',
        }

        this.changeUsername = this.changeUsername.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.changeEmail = this.changeEmail.bind(this);
        this.submitData = this.submitData.bind(this);

    }

    changeUsername(value) {
        this.setState({
            username: value,
        });
    }
    
    changePassword(value) {
        this.setState({
            password: value,
        });
    }

    changeEmail(value) {
        this.setState({
            email: value,
        });
    }

    submitData() {
        this.signup({username: this.state.username, password: this.state.password, email: this.state.email})
    }
    async signup(data) {
        // Check login
        try {
            this.setState({
                signupBtnText: 'Loading...'
            });
            const checkLogin = await sendData('/login/createaccount', {username: data.username, email: data.email, password: data.password});
            if (checkLogin.status === 'success') {
                return window.location.href = '/dashboard';
            }
            this.setState({
                signupBtnText: 'Submit'
            });
            //alert(checkLogin.message);
            this.props.customAlert(checkLogin.message, false);

        } catch(err) {
            console.error(err);
        }
    }

    render() {
        return (
            <div className="Signup Login">
                <h1>Create Account</h1>
                <div className='hr' style={{width: "calc(100px + 40%)"}}></div>
                <Input onInput={this.changeUsername} className="indexLogin" placeholder={"Username"} type="text" />
                <Input onInput={this.changeEmail} className="indexLogin" placeholder={"Email"} type="email" />
                <Input onInput={this.changePassword} className="indexLogin" placeholder={"Password"} type="password" enter={this.submitData} />
                <div onClick={this.submitData} className='btn' style={{backgroundColor: "#4A7C59", color: "#FFFFFF"}}>{this.state.signupBtnText}</div>
                <div style={{marginTop: "3vh", marginBottom: 5, fontSize: "1.7vh"}}>Already have an account?</div>
                <div onClick={this.props.switchPage} className='btn' style={{backgroundColor: "#DFDFDF", color: "#222222"}}>Log in here!</div>
            </div>
        );
    }
}

export default Signup;