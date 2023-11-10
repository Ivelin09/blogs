const User = require('../schemas/users');

const post = async (req, res) => {
    const { username, password } = req.body;

    const query = await User.findOne({ username: username });

    if (!query || query.password != password)
        res.json({ message: 'wrong username or password', code: 403 });
    else
        res.json({
            message: 'success',
            token: await jwt.sign({ username: username }, 'secret', { expiresIn: 1000 * 60 * 30 }),
            status: 200
        });
}

module.exports = {
    post
}