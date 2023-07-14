const express = require('express');
const cookieParser = require('cookie-parser')
const server = express();

const { createProxyMiddleware } = require("http-proxy-middleware")
const Cookies = require('cookies');

const cors = require('cors')

server.use(cors({ origin: '*', credentials: true }));
server.use(cookieParser())

const apiProxy = createProxyMiddleware({
    target: "http://localhost:8000",
    pathRewrite: { [`^/api`]: "" },
    secure: true,
    onProxyReq: async (proxyReq, req) => {
        const cookies = new Cookies(req);
        const accessToken = cookies.get("authorization");

        if (accessToken) {
            proxyReq.setHeader("Authorization", `Bearer ${accessToken}`);
        }
    },
});
const apiAuthenticate = createProxyMiddleware({
    target: "http://localhost:8000",
    pathRewrite: { [`^/api`]: "" },
    secure: true,
    onProxyRes: async (proxyRes, req, res) => {
        const cookies = new Cookies(req, res);
        cookies.set("authorization", "11111111111111111111111", {
            secure: true
        });

        proxyRes.pipe(res)
    }
});

server.use("/api/register", apiAuthenticate);
server.use("/api", apiProxy);


server.listen(5000, () => {
    console.log('proxy is on');
})