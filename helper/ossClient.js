const OSS = require("ali-oss");

// 解析oss zip文件
const execZipFile = async (event) => {
  const { data: ossData, ...other } = event;
  console.log(other, "event other");
  const { region, oss } = ossData;
  const ossClient = new OSS({
    region: `oss-${region}`,
    bucket: "bmap-base-image",
    accessKeyId: "LTAI5tSHfDTRehnyGgrZvCEb", // process.env.OSS_ACCESS_KEY_ID
    accessKeySecret: "I2ZdqSLH0oD40qUEZPm8koz623ovKe", //process.env.OSS_ACCESS_KEY_SECRET
    timeout: 1000 * 90, //ms
    // internal:true,
    // endpoint:'oss-cn-beijing-internal.aliyuncs.com'
  });
  console.log(JSON.stringify(oss));
  const fileName = oss[0].object.key;
  try {
    const result = await ossClient.get(fileName, `./tmp/${fileName}`);
    console.log(result, "file");
  } catch (error) {
    console.log("err:", error);
  }
};

module.exports = { execZipFile };
