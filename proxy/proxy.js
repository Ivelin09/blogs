const express = require('express');
const server = express();
const cors = require('cors');

const { createProxyMiddleware, responseInterceptor } = require("http-proxy-middleware")

//server.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
const apiAuthenticate = createProxyMiddleware({
    target: "http://localhost:8000",
    changeOrigin: true,
    pathRewrite: { [`^/api`]: "" },
    secure: true,
    selfHandleResponse: true,
    onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
        console.log(req.method);
        console.log(proxyRes.headers['content-type'])
        if (proxyRes.headers['content-type'] === 'application/json; charset=utf-8') {
            let stringifiedJSON = String.fromCharCode.apply(null, responseBuffer.toJSON('utf8').data);
            data = JSON.parse(stringifiedJSON);

            res.cookie('authorization', data.token, {
                secure: true,
                httpOnly: true
            });
        }
        return responseBuffer;
    }),
});

server.use(apiAuthenticate);

server.listen(5000, () => {
    console.log('proxy is on');
});