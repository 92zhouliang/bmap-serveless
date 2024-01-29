const { exec } = require('child_process');

const initialize = ()=>{
  return new Promise((resolve,reject)=>{
    exec(`chmod +x /code/helper/initial.sh && ${__dirname}/initial.sh`, (error, stdout, stderr) => {
      if (error) {
        reject(`error:${error}`);
      }
      console.log(`输出： ${stdout}`);
      resolve(200)
    });
  }).catch(err=>console.log(err))
}


module.exports = {
  initialize
}