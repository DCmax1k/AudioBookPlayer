import React, { Component } from 'react';

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

    render() {
        const { directory, directoryPath } = this.props;
        console.log(directory);
        return (
            <div className={'Book ' + (this.state.active ? 'active' : '')} key={this.props.key} style={{backgroundColor: 'grey', margin: "2px 0", height: 'fit-content', overflow: 'hidden'}} onClick={this.toggleActive}>
                <h2 style={{height: 30}}>{directory.folder}</h2>
                {(this.state.active ? (
                    <ul style={{margin: '5px 0'}}>
                        {directory.files.map((file, fileIndex) => (
                            <div>
                                {file}
                                <audio key={fileIndex} controls>
                                    <source src={`/audio/${directory.folder}/${file}`} type='audio/mp3'></source>
                                </audio>
                            </div>
                            
                        ))}
                    </ul>
                ) : (<div>
                    Click here to load audio.
                </div>))}
                
            </div>
        );
    }
}

export default Book;