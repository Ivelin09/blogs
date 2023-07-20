const jwt = require('jsonwebtoken');
const User = require('../schemas/users');

const post = async (req, res) => {
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
}

module.exports = {
    post
}