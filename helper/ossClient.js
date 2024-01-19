const OSS = require("ali-oss");
const { isProd,ossClientTimeout } = require("./utils");

// 解析oss zip文件
const execZipFile = async (event) => {
  const { data: ossData, ...other } = event;
  console.log(other, "event other");
  const { region, oss } = ossData;
  const region_name = `oss-${region}`;
  const ossClient = new OSS({
    region: region_name,
    bucket: "bmap-base-image",
    accessKeyId: "LTAI5tSHfDTRehnyGgrZvCEb", // process.env.OSS_ACCESS_KEY_ID
    accessKeySecret: "I2ZdqSLH0oD40qUEZPm8koz623ovKe", //process.env.OSS_ACCESS_KEY_SECRET
    timeout: ossClientTimeout, //ms
    ...(isProd
      ? {
          internal: true,
          endpoint: `${region_name}-internal.aliyuncs.com`,
        }
      : {}),
  });
  console.log('oss \n',JSON.stringify(oss));
  const fileName = oss.object.key;
  try {
    const {res} = await ossClient.get(fileName, `./tmp/${fileName}`);
    if(res.status === 200) {
      //文件获取成功

    }else{
      throw new Error(`get file failed:${JSON.stringify(res)}`)
    }
  } catch (error) {
    console.log("err:", error);
  }
};

module.exports = { execZipFile };
