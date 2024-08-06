const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const {sendWelcomeEmail, sendVerifyNewEmail, sendEmail, send2fa} = require('./util/sendEmail');

const activity = [];

function formatDate(date) {
    const d = new Date(date);
    const DAY = d.getDate();
    const MONTH = d.getMonth() + 1;
    const YEAR = d.getFullYear();

    return `${MONTH}/${DAY}/${YEAR}`;
}

router.post('/activity', authToken, async (req, res) => {
    const user = await User.findById(req.userId);
    const {message} = req.body;
    const date = new Date();
    const time = `[ ${String(date.getHours()).padStart(2, '0')} : ${String(date.getMinutes()).padStart(2, '0')} ]`;
    activity.push({user: user.username, date: formatDate(date), time, message});
});

router.post('/getactivity', authToken, async (req, res) => {
    const user = await User.findById(req.userId);
    if (user.rank !== 'admin') return res.json({data: [], status: 'success'});
    res.json({
        data: activity,
        status: 'success',
    });
});

function authToken(req, res, next) {
    const token = req.cookies['auth-token'];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.userId = user.userId;
        next();
    });
}

module.exports = router;