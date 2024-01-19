const fs = require("fs");
const unzipper = require("unzipper");
const path = require("path");
const { isProd } = require("./utils");
const { execSifShell } = require("./execShell");

/**
 * @description 解析文件
 * @param zipFilePath string 压缩文件临时路径 ./tmp
 * @param zipFileName string 文件名前缀
 */
const unzipFile2Target = (zipFilePath, zipFileName) => {
  const outputFolderPath = isProd ? "/home/temp/outputSif/" : `./tmp/`;
  return new Promise((resolve, reject) => {
    try {
      fs.createReadStream(zipFilePath)
        .pipe(unzipper.Extract({ path: outputFolderPath }))
        .on("close", () => {
          console.log(`${zipFileName} is unzip`);
          // 删除原zip文件
          fs.unlink(zipFilePath, async (err) => {
            if (err) {
              console.error("删除原zip文件失败：", err);
            } else {
              console.log("原zip文件已删除");
              // 执行镜像文件解析脚本
              const code = await execSifShell(outputFolderPath);
              console.log("command ", code);
              if (code === 200) {
                resolve();
              } else {
                reject();
              }
            }
          });
        })
        .on("error", (err) => {
          console.error("解压失败：", err);
          reject("解压失败：");
        });
    } catch (error) {
      // 上报错误
      throw new Error(error);
    }
  });
};

module.exports = {
  unzipFile2Target,
};
