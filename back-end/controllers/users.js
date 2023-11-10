const jwt = require('jsonwebtoken');
const User = require('../schemas/users');
const path = require('path');
const express = require('express');

const { io, userData, http } = require('../sockets.js');

const test = (req, res) => {
    const { username } = req.query;

    const user = User.find({ username: username }).exec();

    res.json({
        imagePath: user.imagePath,
        username: username
    })
}

const post = async (req, res) => {
    const { username, password } = req.body;

    const token = await jwt.sign({ username: username }, 'secret', { expiresIn: 1000 * 60 * 30 * 1000000000000000 });
    const doc = new User();
    doc.username = username;
    doc.password = password;
    console.log('token', token);
    try {
        await doc.save();
    } catch (err) {
        console.log('err', err);
    }

    res.json({
        status: 200,
        message: "success",
        token: token
    });
}

const getAllOnlineUsers = async (req, res) => {
    if (!io.sockets.adapter.rooms.get('page'))
        return;

    const users = [];

    io.sockets.adapter.rooms.get('page').forEach(socketId => {
        if (userData[socketId]) // authorized users
            users.push(userData[socketId].user)
    });


    res.json({
        message: users
    });
}

const profileData = async (req, res) => {

    const { imagePath, username } = await User.findOne({ _id: req.sender._id }).exec();

    res.json({
        imagePath: `${imagePath}`,
        username: username
    });
}

const otherProfileData = async (req, res) => {
    const { username } = req.params;

    const { imagePath } = await User.findOne({ username: username }).exec();

    res.json({
        imagePath: `${imagePath}`,
        username: username
    });
}


const changeProfile = async (req, res) => {
    console.log('file', req.file);
    try {
        await User.findOneAndUpdate({ _id: req.sender._id }, {
            imagePath: req.file.path
        });
    } catch (err) {
        console.log('err', err);
        res.json({
            status: 500,
            message: err
        });
        return;
    }

    res.json({
        status: 200,
        message: "updated successfuly"
    });

}

const get = async (req, res) => {
    res.json({
        username: req.sender.username
    });
}

module.exports = {
    getAllOnlineUsers,
    otherProfileData,
    changeProfile,
    profileData,
    post,
    test,
    get
}