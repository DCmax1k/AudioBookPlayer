import React, { Component } from 'react';
import sendData from './util/sendData';

class Book extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            active: false,
         };
         this.toggleActive = this.toggleActive.bind(this);
    }

    toggleActive() {
        this.setState({
            active: !this.state.active,
        })
    }

    async sendActivity(msg) {
        sendData('/dashboard/activity', {message: msg})
    }

    render() {
        const { directory } = this.props;
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
                                <audio key={fileIndex} controls onPlay={() => {this.sendActivity("started playing " + file + ", from " + directory.folder)}}>
                                    <source src={`/audio/${directory.folder}/${file}`} type='audio/mp3'></source>
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