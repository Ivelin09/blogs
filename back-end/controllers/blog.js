const User = require('../schemas/users')
const Blogs = require('../schemas/blogs');
const mongoose = require('mongoose')

const test = async (req, res) => {
    res.json({
        status: 200,
        message: []
    });
}

const post = async (req, res) => {
    const { title, description } = req.body;
    const blog = new Blogs();

    blog.title = title;
    blog.description = description;
    blog.author = req.sender;
    blog.imagePath = req.file ? req.file.path : 'images/none.png'
    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAa')
    await blog.save();
    res.sendStatus(200);
}

const getAll = async (req, res) => {
    let data =
        await Blogs.find({}).then(async (blogs) => {
            let data = [];
            await Promise.all(blogs.map(async (blog) => {
                const object = {
                    title: blog.title,
                    id: blog._id,
                    author: (await User.findOne({ _id: blog.author })).username,
                    imagePath: blog.imagePath
                };

                if (blog.imagePath)
                    object.imagePath = blog.imagePath;

                data.push(object);
            }));
            return data;
        })

    res.json({
        status: 200,
        message: data
    });
}

const getAllFromUser = async (req, res) => {
    const user = User.find({ username: req.query.username }).exec();

    let blogs = await Blogs.aggregate([
        {
            '$match': {
                '$expr': {
                    '$eq': [
                        "$author", {
                            '$toObjectId': user._id
                        }
                    ]
                }
            }
        }])

    console.log(JSON.stringify(blogs, null, 4))

    res.json({
        status: 200,
        message: blogs
    });
}

const getOne = async (req, res) => {
    const blogId = req.params.id;
    const blog = await Blogs.findOne({ _id: blogId });

    res.json({
        status: 200,
        message: blog
    })
}

module.exports = {
    post,
    test,
    getOne,
    getAll,
    getAllFromUser,
}