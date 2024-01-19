const OSS = require("ali-oss");
const { isProd, ossClientTimeout } = require("./utils");
const { unzipFile2Target } = require("./upzip");

// 解析oss zip文件
const execZipFile = async (event) => {
  const { data: ossData, ...other } = event;
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
          endpoint: `${region_name}-internal.aliyuncs.com`, // 生产使用区域内网访问
        }
      : {}),
  });
  // console.log("ossClient \n", JSON.stringify(ossClient));
  const fileName = oss.object.key;
  try {
    const zipPath = `./tmp/${fileName}`;
    // zip文件名不要出现特殊字符 . 等
    const zipFileName = fileName.split(".")[0];
    const { res } = await ossClient.get(fileName, `./tmp/${fileName}`);
    if (res.status === 200) {
      //文件获取成功
      await unzipFile2Target(zipPath, zipFileName);
    } else {
      throw new Error(`get file failed:${JSON.stringify(res)}`);
    }
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { execZipFile };
