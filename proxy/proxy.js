const express = require('express');
const server = express();

const Cookies = require('cookies');
const cors = require('cors');

server.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

const { createProxyMiddleware, responseInterceptor } = require("http-proxy-middleware")


const apiProxy = createProxyMiddleware({
    target: "http://localhost:8000",
    pathRewrite: { [`^/api`]: "" },
    secure: false,
    onProxyReq: async (proxyReq, req) => {
        console.log(req.headers.cookie);
        const cookies = new Cookies(req);
        const accessToken = cookies.get("authorization");
        if (accessToken) {
            proxyReq.setHeader("Authorization", `Bearer ${accessToken}`);
        }
    },
});

const apiAuthenticate = createProxyMiddleware({
    target: "http://localhost:8000",
    changeOrigin: true,
    pathRewrite: { [`^/api`]: "" },
    secure: true,
    selfHandleResponse: true,
    onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
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

server.use(['/api/register', '/api/login'], apiAuthenticate);
server.use('/api', apiProxy)

server.listen(5000, () => {
    console.log('proxy is on');
});