const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

/**
 * @description 使用了Express框架和Multer中间件来处理文件上传。
 * 用户可以通过POST请求访问/api/execute接口，上传一个SIF文件和一个shell文件。
 * 服务器会将这些文件的内容写入临时文件，并执行Singularity命令
*/
app.post('/api/execute', upload.single('file'), (req, res) => {
  const filePath = `uploads/${req.file.filename}`;
  const shellFilePath = `uploads/${req.body.shellFileName}`;

  // 读取文件内容
  fs.readFile(filePath, 'utf8', (err, sifContent) => {
    if (err) {
      res.status(500).send('Error reading SIF file');
      return;
    }

    fs.readFile(shellFilePath, 'utf8', (err, shellContent) => {
      if (err) {
        res.status(500).send('Error reading shell file');
        return;
      }

      // 将文件内容写入临时文件
      fs.writeFile('/tmp/user_image.sif', sifContent, (err) => {
        if (err) {
          res.status(500).send('Error writing SIF file');
          return;
        }

        fs.writeFile('/tmp/user_shell.sh', shellContent, (err) => {
          if (err) {
            res.status(500).send('Error writing shell file');
            return;
          }

          // 执行Singularity命令
          exec('singularity exec /tmp/user_image.sif /tmp/user_shell.sh', (error, stdout, stderr) => {
            if (error) {
              res.status(500).send('Error executing Singularity command');
              return;
            }

            // 返回结果
            res.status(200).send('Execution completed successfully');
          });
        });
      });
    });
  });
});

app.listen(9000, () => {
  console.log('Server is running on port 3000');
});
