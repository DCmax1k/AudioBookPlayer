import React, { Component } from 'react';
import sendData from './util/sendData';

class Book extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            active: this.props.isRecentPlayed ? true : false,
            duration: null,
         };
         this.toggleActive = this.toggleActive.bind(this);
         this.updateDuration = this.updateDuration.bind(this);

    }

    // async setLastPlayedDB() {
    //     // Send last played file and its duration to backend
    //     const {folder, files, duration } = this.props.lastPlayed;
    //     const lastPlayed = {folder, file: files[0], duration,}
    //     await sendData('/dashboard/setlastplayed', {lastPlayed,});
    //     console.log('sent last played');
    // }

    toggleActive() {
        this.setState({
            active: !this.state.active,
        })
    }

    async sendActivity(msg) {
        sendData('/dashboard/activity', {username: this.props.user.username, message: msg})
    }

    updateDuration(e) {
        const fileNameAndTimeArr = e.target.currentSrc.split('/');
        const fileNameAndTime = fileNameAndTimeArr[fileNameAndTimeArr.length - 1];
        let fileName = fileNameAndTime;
        if (fileNameAndTime.includes('#')) {
            fileName = fileNameAndTime.split('#')[0];
        }
        const lastPlayed = {
            folder: this.props.directory.folder,
            files: [fileName],
            duration: e.target.currentTime,
        }
        this.setState({
            duration: e.target.currentTime,
        });
        this.props.setLastPlayed(lastPlayed);
    }

    render() {
        const { directory, lastPlayed, isRecentPlayed } = this.props;
        let startTime = '';
        if (isRecentPlayed) {
            startTime = '#t=' + lastPlayed.duration;
        }
        
        return (
            <div className={'Book ' + (this.state.active ? 'active' : '')} key={directory.folder} style={{backgroundColor: 'lightGrey', margin: "2px 0", height: 'fit-content', overflow: 'hidden', padding: 5, borderRadius: 5,}}>
                <h2  onClick={this.toggleActive} style={{height: 'fit-content', fontSize: 25, color: '#555', width: '100%'}}>{directory.folder}</h2>
                {(this.state.active ? (
                    <ul style={{margin: '5px 0'}}>
                        {directory.files.map((file, fileIndex) => (
                            <div style={{display: 'flex', flexDirection: 'column'}}>
    
                                <div style={{fontSize: 17, color: 'black', width: '100%'}}>
                                    {file}
                                </div>
                                <audio key={fileIndex} controls onTimeUpdate={this.updateDuration} onPlay={() => {this.sendActivity("started playing " + file + ", from " + directory.folder)}}>
                                    <source src={`/audio/${directory.folder}/${file}${startTime}`} type='audio/mp3'></source>
                                </audio>
                            </div>
                            
                        ))}
                    </ul>
                ) : (<div>
                    Click the title to load audio.
                </div>))}
                
            </div>
        );
    }
}

export default Book;