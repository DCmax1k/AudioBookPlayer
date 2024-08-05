import React, { Component } from 'react';
import sendData from './util/sendData';
import Login from './Login/Login';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {


        }
    }

    async componentDidMount() {
        // Check login
        try {
            const checkLogin = await sendData('/auth', {});
            if (checkLogin.status === 'success') {
                window.location.href = '/dashboard';
            }

        } catch(err) {
            console.error(err);
        }
    }

    customAlert(message, good) {
        const id = Math.random() + '' + Date.now();
        const alerts = this.state.alerts;
        const alert = {
            id,
            txt: message,
            status: good,
            animate: false,
        };
        alerts.push(alert);
        this.setState({
            alerts,
        });

        if (alerts.length === 1) {
            this.applyDecay(alert);
        }
    }

    render() {
        return (
            <div className='Index' style={{width: '100vw'}}>
                <Login customAlert={this.customAlert} /> 
            </div>
        )
    }
}

export default Index;