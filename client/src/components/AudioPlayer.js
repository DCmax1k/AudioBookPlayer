import React, { Component } from 'react';
import Book from './Book';

class AudioPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            data: [],
            sorted: [],
            query: '',
         };

         this.setFiles = this.setFiles.bind(this);
         this.sortFiles = this.sortFiles.bind(this);
         this.updateQuery = this.updateQuery.bind(this);
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

    render() {
        return (
            <div className="AudioPlayer" style={{minWidth: 360, width: '90vw', maxHeight: '95vh', overflowY: 'scroll', overflowX: 'hidden'}}>
                <h1 style={{height: 'fit-content', fontSize: 28, color: '#333', width: '100%'}}>Recently added to Audio Books</h1>
                <div style={{height: 40, width: '100%', display: 'flex', position: 'relative'}}>
                    <img src='/images/icons/search.svg' alt='search' style={{position: 'absolute', top: '50%', left: 5, transform: 'translateY(-50%)', height: 30, width: 30, pointerEvents: 'none', }} />
                    <input placeholder='Search audio book' onChange={this.updateQuery} type='text' style={{height: '100%', width: '100%', paddingLeft: 40, outline: 'none', border: '1px solid black', borderRadius: 10, }} />
                </div>
                {this.state.sorted.map((directory, index) => (
                    <Book key={index} directory={directory} />
                ))}


            </div>
        );
    }
}

export default AudioPlayer;