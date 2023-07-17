const express = require('express');
const server = express();

const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const authorize = require('./auth');

const User = require('./schemas/users')
const Blogs = require('./schemas/blogs')

const cors = require('cors');
const upload = require('./uploadFile');

const path = require('path');

server.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

mongoose.connect('mongodb://localhost:27017/blogs');

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use('/images', express.static(path.join(__dirname, 'images')));


server.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const token = await jwt.sign({ username: username }, 'secret', { expiresIn: 1000 * 60 * 30 * 1000000000000000 });
    const doc = new User();
    doc.username = username;
    doc.password = password;
    try {
        await doc.save().then(() => console.log("saved"));
    } catch (err) {
        console.log("Err", err);
        res.json({
            status: 401,
            message: 'This username is taken'
        });
        return;
    }

    res.json({
        status: 200,
        message: "success",
        token: token
    });
});

server.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const query = await User.findOne({ username: username });
    console.log(query);

    if (!query || query.password != password)
        res.json({ message: 'wrong username or password', code: 403 });
    else
        res.json({
            message: 'success',
            token: await jwt.sign({ username: username }, 'secret', { expiresIn: 1000 * 60 * 30 }),
            status: 200
        });
    console.log(query);
});

server.post('/createBlog', authorize, upload.single('image'), async (req, res) => {
    const { title, description } = req.body;
    const blog = new Blogs();

    blog.title = title;
    blog.description = description;
    blog.author = req.sender;

    console.log(req.file);
    if (req.file)
        blog.imagePath = req.file.path;

    await blog.save();
    res.sendStatus(200);
});

server.get('/blogs', async (req, res) => {
    let data =
        await Blogs.find({}).then(async (blogs) => {
            let data = [];
            await Promise.all(blogs.map(async (blog) => {
                const object = {
                    title: blog.title,
                    id: blog._id,
                    author: (await User.findOne({ _id: blog.author })).username
                };

                console.log(blog);
                if (blog.imagePath)
                    object.imagePath = blog.imagePath;

                data.push(object);
            }));
            return data;
        })

    console.log('res', data);
    res.json({
        status: 200,
        message: data
    });

});

server.listen(8000, () => {
    console.log('Server is on')
})