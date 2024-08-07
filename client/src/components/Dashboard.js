import React, { Component } from 'react';
import sendData from './util/sendData';
import Loading from './Loading';
import Signup from './Login/Signup';
import AudioPlayer from './AudioPlayer';



class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activity: [],
            user: null,
            loggedIn: false,
            loadingText: 'Logging in...',
            fadeIn: false,
            alerts: [],
            currentScreen: 'audiobooks',
        };
        this.loadingRef = React.createRef();

        this.customAlert = this.customAlert.bind(this);
        this.applyDecay = this.applyDecay.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
        this.getActivity = this.getActivity.bind(this);
        this.changeAdminScreen = this.changeAdminScreen.bind(this);

    }

    async componentDidMount() {
        try {
            const checkLogin = await sendData('/auth', {});
            //const checkLogin = {user: {username: 'DCmax1k', plus: false, settings: {emailVerified: false,}, email: 'dylan@digitalcaldwell.com', rank: 'admin' },status: 'success',};
            if (checkLogin.status === 'success') {
                const user = checkLogin.user;
                this.setState({
                    user,
                    loadingText: 'Welcome back, ' + user.username + '!',
                });
                setTimeout(() => {
                    this.loadingRef.current.fadeOut();
                    setTimeout(() => {
                        this.setState({
                            loggedIn: true,
                        });
                        setTimeout(() => {
                            if (user.rank === 'admin') this.getActivity();
                            this.setState({
                                fadeIn: true,
                            });
                        }, 1);
                    }, 300);
                }, 600);

            } else {
                this.setState({
                    loadingText: checkLogin.message,
                });
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            }
            

        } catch(err) {
            console.error(err);
        }
    }

    async getActivity() {
        const response = await sendData('/dashboard/getactivity', {});
        if (response.status === 'success') {
            this.setState({
                activity: response.data,
            });
        }
    }

    

    async logout() {
        try {
            const response = await sendData('/login/logout', {});
            if (response.status === 'success') {
                window.location.href = '/';
            } else {
                this.customAlert('Error connecting to server. Redirecting...', false);
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            }
        } catch(err) {
            console.error(err);
            this.customAlert('Error connecting to server. Redirecting...', false);
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
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

    closeAlert(alert) {
        const alerts = this.state.alerts;
        let ind = alerts.findIndex((alrt) => alrt.id === alert.id);
        if (ind < 0) return;
        alerts[ind].animate = true;
        this.setState({
            alerts,
        });
        setTimeout(() => {
            const updatedAlerts = this.state.alerts;
            updatedAlerts.splice(ind, 1);
            this.setState({
                alerts: updatedAlerts,
            });

            if (updatedAlerts.length > 0) {
                this.applyDecay(updatedAlerts[0]);
            }
        }, 300);
    }

    applyDecay(alert) {
        setTimeout(() => {
            this.closeAlert(alert);
        }, 3000);
    }

    changeAdminScreen(screen) {
        this.setState({
            currentScreen: screen,
        });
    }

    render() {

        return this.state.loggedIn ? (
            <div className={`Dashboard ${this.state.fadeIn}`}>
                {/* Alert messages */}
                <div className='alerts'>
                    {this.state.alerts.filter((al, i) => i===0).map((alert, i) => {
                        // Auto close alert after 10 seconds
                        return (
                        <div className={`alert ${alert.status} ${alert.animate ? 'animate' : ''}`} key={alert.id}>
                            <img onClick={() => this.closeAlert(alert)} src={alert.status ? '/images/icons/greenHollowCheck.svg' : '/images/icons/redHollowX.svg'} alt='Close notification' />
                            {alert.txt}
                        </div>
                        )
                    })}
                </div>

                {/* Body */}
                <div className='body' style={{width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    
                    Logged in as {this.state.user.username}.
                    <br />
                    <div onClick={this.logout} className='LogoutBtn' style={{height: 50, width: 200, borderRadius: 50, backgroundColor: '#5781C0', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white'}}>
                        Logout
                    </div>
                    <div style={{display: 'flex', width: '100%', minWidth: 360, flexDirection: 'column', alignItems: 'center'}}>

                        {(this.state.user.rank === 'admin') ? (<div style={{width: 400, display: 'flex', justifyContent: 'space-around'}}>
                            <div onClick={() => this.changeAdminScreen('audiobooks')} style={{cursor: 'pointer', padding: '5px', backgroundColor: 'grey', color: 'white', margin: 5, borderRadius: 5}}>Audio Books</div>
                            <div onClick={() => this.changeAdminScreen('activity')} style={{cursor: 'pointer', padding: '5px', backgroundColor: 'grey', color: 'white', margin: 5, borderRadius: 5}}>Activity</div>
                            <div onClick={() => this.changeAdminScreen('createaccount')} style={{cursor: 'pointer', padding: '5px', backgroundColor: 'grey', color: 'white', margin: 5, borderRadius: 5}}>Create Account</div>
                        </div>) : (null)}

                        {(this.state.currentScreen === 'audiobooks') ? (<AudioPlayer />) : (this.state.currentScreen === 'activity') ? (<div className='Activity' style={{color: 'black', width: '100%'}}>
                            {this.state.activity.reverse().map(element => {
                                return (<div>
                                    {element.date} {element.time} {element.user} {element.message}
                                </div>)
                            })}
                        </div>) : (this.state.currentScreen === 'createaccount' ? (<Signup />) : null)}


                    </div>
                </div>
            </div>
        ) : (
            <Loading loadingText={this.state.loadingText} ref={this.loadingRef} />
        );
    }
}

export default Dashboard;