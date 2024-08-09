import React, { Component } from 'react';
import Book from './Book';
import sendData from './util/sendData';

class AudioPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            data: [],
            sorted: [],
            query: '',
            lastPlayed: {
                folder: '',
                files: [],
                duration: 0,
            },
         };

         this.setFiles = this.setFiles.bind(this);
         this.sortFiles = this.sortFiles.bind(this);
         this.updateQuery = this.updateQuery.bind(this);
         this.setLastPlayed = this.setLastPlayed.bind(this);
    }

    async componentDidMount() {


        const res = await fetch('/api/list-files');
        const resJSON = await res.json();
        //const resJSON = [{"folder": "Book 1","files": ["edemame.mp3","lythnx.mp3"]},{"folder": "Book 2","files": ["milliondollarbaby.mp3","watchThisVertPreview.mp3"]}];

        this.setFiles(resJSON);
    }

    setFiles(data) {
        const user = this.props.user;
        const lastPlayed = user.lastPlayed;
        let lastPlayedBook = {folder: '', files: ['']};
        if (lastPlayed.folder !== '') {
            lastPlayedBook.folder = lastPlayed.folder;
            lastPlayedBook.files = [lastPlayed.file];
            lastPlayedBook.duration = lastPlayed.duration;
        }

        this.setState({
            data,
            sorted: data,
            lastPlayed: lastPlayedBook,
        });
        
    }

    setLastPlayed(lastPlayed) {
        this.setState({
            lastPlayed,
        });
        const user = this.props.user;
        user.lastPlayed = lastPlayed;
        this.props.setUser(user);
    }

    updateQuery(e) {
        this.setState({
            query: e.target.value,
        });
        this.sortFiles(e.target.value);
    }

    sortFiles(query) {
        let sorted = [];
        const { data } = this.state;
        if (query === '') {
            this.setState({
                sorted: data,
            });
        } else {
            const queryName = query.toLowerCase();
            data.forEach(f => {
                const folderName = f.folder.toLowerCase();
                if (folderName.includes(queryName)) sorted.push(f);
                return;
            });
            this.setState({
                sorted,
            });
        }
    }

    formatSecondsToTime(secs) {
        if (!secs || isNaN(secs)) return "00h:00m:00s";

        const h = Math.floor(secs/3600);
        const m = Math.floor((secs-(h*3600))/60);
        const s = Math.floor(secs-(h*3600)-(m*60));
        return `${h}h:${m}m:${s}s`;
    }
        

    render() {
        return (
            <div className="AudioPlayer" style={{minWidth: 360, width: '90vw', maxHeight: '95vh', overflowY: 'scroll', overflowX: 'hidden'}}>
                <h1 style={{height: 'fit-content', fontSize: 28, color: '#333', width: '100%'}}>Last Played - <span style={{color: '#5881c1'}}>{this.state.lastPlayed.folder}, {this.state.lastPlayed.files[0]}</span> </h1>
                <h1 style={{height: 'fit-content', fontSize: 28, color: '#333', width: '100%'}}>Resume at <span style={{color: '#5881c1'}}>{this.formatSecondsToTime(this.state.lastPlayed.duration)}</span></h1>
                <h1 style={{height: 'fit-content', fontSize: 28, color: '#333', width: '100%'}}>Resume currently broken for mobile<span style={{color: '#5881c1'}}> Fix coming soon</span></h1>
                {this.state.lastPlayedSource === '' ? "Your most recent played audio will appear here." : (<Book directory={this.state.lastPlayed} user={this.props.user} setLastPlayed={this.setLastPlayed} lastPlayed={this.state.lastPlayed} isRecentPlayed={true} />)}
                <h1 style={{height: 'fit-content', fontSize: 28, color: '#333', width: '100%'}}>All Audio Books</h1>
                <div style={{height: 40, width: '100%', display: 'flex', position: 'relative'}}>
                    <img src='/images/icons/search.svg' alt='search' style={{position: 'absolute', top: '50%', left: 5, transform: 'translateY(-50%)', height: 30, width: 30, pointerEvents: 'none', }} />
                    <input placeholder='Search audio book' onChange={this.updateQuery} type='text' style={{height: '100%', width: '100%', paddingLeft: 40, outline: 'none', border: '1px solid black', borderRadius: 10, }} />
                </div>
                {this.state.sorted.map((directory, index) => (
                    <Book key={index} directory={directory} user={this.props.user} setLastPlayed={this.setLastPlayed} lastPlayed={this.state.lastPlayed} isRecentPlayed={false} />
                ))}


            </div>
        );
    }
}

export default AudioPlayer;