const { exec, execSync } = require("child_process");

const execSifShell = (folder) => {
  // 要执行的Linux命令
  const command = `echo "这是追加的内容1" >> ${folder}/test.txt`;
  return new Promise((resolve, reject) => {
    // 执行命令
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`执行错误： ${error}`);
        reject(error)
      }
      resolve(200);
    });
  });
};

module.exports = {
  execSifShell,
};
