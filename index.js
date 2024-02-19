'use strict';

const express = require('express');
const { execZipFile } = require('./helper/ossClient')

// Constants
const PORT = 9000;
const HOST = '0.0.0.0';
const REQUEST_ID_HEADER = 'x-fc-request-id'

const app = express();
// 解析JSON格式的请求体
app.use(express.json({type:['application/json', 'application/octet-stream']}))

app.get('/health', (req, res) => {
  res.send('Hello FunctionCompute, /\n server is runninng on 9000');
});

// controller
app.post('/main-exec', async (req, res) => {
 console.log(`FC Invoke Start`)
 try {
  //  console.log(req.body,'params');;
   const paramsData = req.body;
   await execZipFile(paramsData);
   res.send('OK');
 } catch (e) {
   console.error(e.stack || e);
   return res.status(404).send(e.stack || e);
 }
});


var server = app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

server.timeout = 0; // 设置从不超时
server.keepAliveTimeout = 0; // keepalive, never timeout