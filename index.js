'use strict';

const express = require('express');

// Constants
const PORT = 9000;
const HOST = '0.0.0.0';
// const REQUEST_ID_HEADER = 'x-fc-request-id'

// // 配置OSS客户端
// const client = new oss({
//   region: '<your-region>', // 例如：'oss-cn-hangzhou'
//   accessKeyId: '<your-access-key-id>',
//   accessKeySecret: '<your-access-key-secret>',
//   bucket: '<your-bucket-name>'
// });

const app = express();
// 解析JSON格式的请求体
app.use(express.json({type:['application/json', 'application/octet-stream']}))


// 初始化回调示例，需要在函数配置中配置初始化回调
app.post('/initialize', (req, res) => {
  console.log(req.body)
  res.send('Hello FunctionCompute, /initialize\n');
});

// 定义一个POST路由，处理OSS触发的事件
app.post('/oss-trigger', (req, res) => {
  const event = JSON.parse(req.body);
  const fileName = event.Records[0].oss.object.key;
  console.log(fileName,'file')
  res.status(200).send({
    trigger:'oss-trigger',
    fileName,
    event
  })
  // const fileContent = new Promise((resolve, reject) => {
  //   client.getObject(fileName, (err, result) => {
  //     if (err) {
  //       reject(err);
  //     } else {
  //       resolve(result.body.toString());
  //     }
  //   });
  // });

  // fileContent.then((content) => {
  //   console.log(`File content: ${content}`);
  //   res.status(200).send('OK');
  // }).catch((err) => {
  //   console.error(`Error processing file: ${err}`);
  //   res.status(500).send('Internal Server Error');
  // });
});
app.post('/trigger-0fdff7ji',(req,res)=>{
  const event = JSON.parse(req.body);
  const fileName = event.Records[0].oss.object.key;
  console.log(fileName,'file')
  res.status(200).send({
    trigger:'trigger-0fdff7ji',
    fileName,
    event
  })
})
// 事件函数调用
app.post('/invoke', (req, res) => {
 // console.log(JSON.stringify(req.headers));
 var rid = req.headers[REQUEST_ID_HEADER]
 console.log(`FC Invoke Start RequestId: ${rid}`)
 try {
   // get body to do your things
   var bodyStr = req.body.toString();
   console.log(bodyStr);
   JSON.parse(bodyStr);
 } catch (e) {
   console.error(e.stack || e);
   return res.status(404).send(e.stack || e);
 }

 res.send('OK');
 console.log(`FC Invoke End RequestId: ${rid}`)
});

var server = app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

server.timeout = 0; // 设置从不超时
server.keepAliveTimeout = 0; // keepalive, never timeout