const Blogs = require('../schemas/blogs');
const Comments = require('../schemas/comments');

const post = async (req, res) => {
    const { id, description } = req.body;

    const comment = new Comments();

    comment.description = description;

    comment.parent = id;

    comment.author = req.sender.username

    await comment.save();

    res.send({
        status: 200
    });
}
const getAll = async (req, res) => {
    const query = await Blogs.aggregate([
        {
            '$match': {
                '$expr': {
                    '$eq': [
                        "$_id", {
                            '$toObjectId': req.params.blogId
                        }
                    ]
                }
            }
        },
        {
            '$lookup': {
                'from': "comments",
                'localField': "_id",
                'foreignField': "parent",
                'as': "comments"
            }
        }]).exec().then((res) => res[0]);

    res.json({
        status: 200,
        message: query
    })

}

const getOne = async (req, res) => {
    const query = await Comments.find({ parent: req.params.commentId });

    res.send({
        status: 200,
        message: query
    });
}


module.exports = {
    post,
    getAll,
    getOne
}