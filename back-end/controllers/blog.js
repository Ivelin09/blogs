const User = require('../schemas/users')
const Blogs = require('../schemas/blogs');

const post = async (req, res) => {
    const { title, description } = req.body;
    console.log(req);
    const blog = new Blogs();

    blog.title = title;
    blog.description = description;
    blog.author = req.sender;
    blog.imagePath = req.file ? req.file.path : 'images/none.png'

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
    getOne,
    getAll
}