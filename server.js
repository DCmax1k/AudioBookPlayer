const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

// CONSTANTS
const directoryPath = 'C:\\Users\\Dylan Caldwell\\Desktop\\Studio Projects\\Audio Book Player\\audio';

// Imports
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/client/build'));
app.use(cookieParser());
app.use('/audio', express.static(directoryPath));

// Main route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/build/index.html');
});
app.get('/dashboard', (req, res) => {
    res.sendFile(__dirname + '/client/build/index.html');
});

// DB models
const User = require('./models/User');

// Routes
const dashboardRoute = require('./routes/dashboard');
app.use('/dashboard', dashboardRoute);

const loginRoute = require('./routes/login');
app.use('/login', loginRoute);

const getDirectoryStructure = (dir) => {
    const result = [];

    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            const subDirFiles = fs.readdirSync(filePath).filter(subFile => !fs.statSync(path.join(filePath, subFile)).isDirectory());
            result.push({
                folder: file,
                files: subDirFiles
            });
        }
    });

    return result;
};

// Endpoint to get list of directories and their files
app.get('/api/list-files', (req, res) => {
    try {
        const directoryStructure = getDirectoryStructure(directoryPath);
        res.json(directoryStructure);
    } catch (err) {
        res.status(500).send('Unable to scan directory: ' + err);
    }
});


app.post('/auth', authToken, async (req, res) => {

    try {
        const user = await User.findOne({_id: req.userId});
        if (!user) {
            return res.json({status: 'error', message: 'Bad authentication! Redirecting...'})
        };

        // Hide crucial information to not send client
        user.password = '';

        res.json({
            status: 'success',
            user,
        });
    } catch(err) {
        console.error(err);
    }
    
});

// Sitemap
let sitemap;
app.get('/sitemap.xml', async (req, res) => {
    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');

    if (sitemap) {
        res.send(sitemap);
        return;
    }

    try {
      const smStream = new SitemapStream({ hostname: 'https://www.keypassguard.app/' });
      const pipeline = smStream.pipe(createGzip());

      smStream.write({ url: '/'});
      smStream.write({ url: '/agreements/termsofuse'});
      smStream.write({ url: '/agreements/privacypolicy'});

      // cache the response
      streamToPromise(pipeline).then(sm => sitemap = sm);
      
      smStream.end();

      // Show errors and response
      pipeline.pipe(res).on('error', (e) => {throw e});
    } catch (e) {
        console.log(e);
    }
});

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT || 3007, () => {
        console.log('Serving on port 3007...');
    });
});

function authToken(req, res, next) {
    const token = req.cookies['auth-token'];
    if (!token) return res.status(401).json({message: 'No authentication provided! Redirecting to login...'});
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({message: 'Error logging in. Incorrect information provided.'})
        req.userId = user.userId;
        next();
    });
}