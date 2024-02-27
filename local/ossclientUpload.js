const OSS = require('ali-oss');
const path = require("path");
const fs = require('fs')

const timeout =1000* 60 *30 ;
const client = new OSS({
  // yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
  region: 'oss-cn-beijing',
  // 从环境变量中获取访问凭证。运行本代码示例之前，请确保已设置环境变量OSS_ACCESS_KEY_ID和OSS_ACCESS_KEY_SECRET。
  accessKeyId: '',
  accessKeySecret: '',
  // 填写存储空间名称。
  bucket: 'bmap-base-image',
  timeout,
});

const progress = (p, _checkpoint) => {
  // Object的上传进度。
  console.log(p); 
  // 分片上传的断点信息。
  console.log(_checkpoint); 
};

const headers = {  
  // 指定Object的存储类型。
  'x-oss-storage-class': 'Standard', 
  // 指定Object标签，可同时设置多个标签。
  'x-oss-tagging': 'Tag=miniraw', 
  // 指定初始化分片上传时是否覆盖同名Object。此处设置为true，表示禁止覆盖同名Object。
  'x-oss-forbid-overwrite': true
}

// 开始分片上传。
async function multipartUpload() {
  const objectName ='/imgdir/ubuntu20.04-node.raw';
  const filePath = path.normalize('E:\\VM-export\\ubuntu20.04-node.raw');
  const partSize =2* 800 * 1024 * 1024; //6*  800 *10M
  try {
    // 初始化分片上传
    console.time('multipartUpload');
    const result = await client.multipartUpload(objectName,filePath, {
      progress,
      timeout,
      parallel:3,
      partSize
    });
    console.timeEnd('multipartUpload')
    
    // const result = await client.initMultipartUpload(objectName, {});
    // // 获取上传ID
    // const uploadId = result.uploadId;

    // // 计算分片数量
    // const fileSize = fs.statSync(filePath).size;
    // const partCount = Math.ceil(fileSize / partSize);

    // // 上传分片
    // for (let i = 0; i < partCount; i++) {
    //   const start = i * partSize;
    //   const end = Math.min(start + partSize, fileSize);
    //   const partNumber = i + 1;

    //   // 读取分片数据
    //   const partData = fs.readFileSync(filePath, { start, end });

    //   // 上传分片
    //   await client.uploadPart({
    //     bucket: result.bucket,
    //     key: result.name,
    //     uploadId: uploadId,
    //     partNumber: partNumber,
    //     body: partData
    //   });
    // }

    // // 完成分片上传
    // await client.completeMultipartUpload({
    //   bucket: result.bucket,
    //   key: result.name,
    //   uploadId: uploadId,
    //   parts: result.parts
    // });

    console.log('文件上传成功');
  } catch (err) {
    console.error('文件上传失败：', err);
  }
  // try {
  //   // 依次填写Object完整路径（例如exampledir/exampleobject.txt）和本地文件的完整路径（例如D:\\localpath\\examplefile.txt）。Object完整路径中不能包含Bucket名称。
  //   // 如果本地文件的完整路径中未指定本地路径（例如examplefile.txt），则默认从示例程序所属项目对应本地路径中上传文件。
  //   const result = await client.multipartUpload(objectName, path.normalize('E:\\VM-export\\ubuntu64mini.raw'), {
  //     progress,
  //     headers,
  //     parallel:2,
  //     partSize,
  //     timeout,
  //     // 指定meta参数，自定义Object的元信息。通过head接口可以获取到Object的meta数据。
  //     // meta: {
  //     //   year: 2024,
  //     //   people: 'test',
  //     // },
  //   });
  //   console.log(result);
  //   // 填写Object完整路径，例如完整路径中不能包含Bucket名称。
  //   // const head = await client.head(objectName);
  //   // console.log(head);
  // } catch (e) {
  //   // 捕获超时异常。
  //   if (e.code === 'ConnectionTimeoutError') {
  //     console.log('TimeoutError');
  //     // do ConnectionTimeoutError operation
  //   }
  //   console.log(e);
  // }
}

multipartUpload();
