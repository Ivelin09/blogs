const jwt = require("jsonwebtoken");
const User = require('./schemas/users');
const Cookies = require('cookies');

module.exports = async function (req, res, next) {
    const cookies = new Cookies(req);
    const authorization = cookies.get("authorization");

    console.log(authorization)

    if (!authorization) {
        res.json({
            status: 401,
            message: "invalid token"
        });
        return;
    }

    const token = jwt.verify(authorization, 'secret');

    const senderObj = await User.findOne({ username: token.username });

    console.log("asd", senderObj);
    if (!senderObj)
        res.json({
            status: 401,
            message: "The token you're using is invalid"
        })

    req.sender = senderObj;
    next();
}