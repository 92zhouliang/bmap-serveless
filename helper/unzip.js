const fs = require("fs");
const yauzl = require("yauzl");
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
      yauzl.open(zipFilePath, { lazyEntries: true }, (err, zipfile) => {
        if (err) throw err;
        // 遍历ZIP文件中的每个条目
        zipfile.readEntry();
        zipfile.on("entry", (entry) => {
          // 如果条目是文件，则解压到指定目录
          if (!entry.fileName.endsWith("/")) {
            zipfile.openReadStream(entry, (err, readStream) => {
              if (err) throw err;
              // 创建目标文件路径
              const filePath = `${outputFolderPath}${entry.fileName}`;

              // 将读取的数据流写入目标文件
              const dir = path.dirname(filePath);
              if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
              }
              const ws = fs.createWriteStream(filePath);
              readStream.pipe(ws);
              ws.on("finish", () => {
                zipfile.readEntry();
              });
            });
          } else {
            // 如果是文件夹，继续读取下一个条目
            zipfile.readEntry();
          }
        });
        zipfile.on("close", () => {
          console.log(`${zipFileName}已完全解压`);
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
        });
      });
    } catch (error) {
      // 上报错误
      throw new Error(error);
    }
  });
};
unzipFile2Target('./helper/sourceCode.zip','sourceCode');
module.exports = {
  unzipFile2Target,
};
