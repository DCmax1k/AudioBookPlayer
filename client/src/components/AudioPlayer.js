import React, { Component } from 'react';
import Book from './Book';

const directoryPath = 'C:\\Users\\Dylan Caldwell\\Desktop\\Studio Projects\\Audio Book Player\\audio';

class AudioPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            data: [],
            sorted: [],
         };

         this.setFiles = this.setFiles.bind(this);
    }

    async componentDidMount() {

        const res = await fetch('/api/list-files');
        const resJSON = await res.json();
        //const resJSON = [{"folder": "Book 1","files": ["edemame.mp3","lythnx.mp3"]},{"folder": "Book 2","files": ["milliondollarbaby.mp3","watchThisVertPreview.mp3"]}];

        this.setFiles(resJSON);
    }

    setFiles(data) {
        this.setState({
            data,
            sorted: data,
        });
    }

    render() {
        return (
            <div className="AudioPlayer" style={{width: 360, overflowY: 'scroll', overflowX: 'hidden'}}>
                <h1>Books</h1>
                {this.state.sorted.map((directory, index) => (
                    <Book key={index} directory={directory} directoryPath={directoryPath} />
                ))}


            </div>
        );
    }
}

export default AudioPlayer;