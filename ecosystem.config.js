module.exports = {
  apps: [
    {
      {
        name: "bmap-node", //name
        script: "./index.js", //相对于pm2 start 的相对路径
        //cwd: "", //要启动的应用程序的目录
        instances: 2, //要启动实例的数量,
        watch: true, //是否启动监听
        //env: { NODE_ENV: "development" }, //	将出现在您的应用程序中的 env 变量
        // env_xxx: {
        //   NODE_ENV: "xxx", //使用pm2注入xxx变量进行切换
        // },
        log_date_format: "YYYY-MM-DD HH:mm Z", //日志时间格式
        // error_file: "./log/index-error.log", //错误文件路径
        // out_file: "./log/index-out.log", //输出日志文件路径
        max_restarts: 10, //最大重启数
        restart_delay: 4000, //重启延迟时间ms
        autorestart: true, //是否自动重启
        //cron_restart: "", //定时重启 使用cron表达式
      }
    },
  ],

  deploy: {
    production: {
      user: "SSH_USERNAME",
      host: "SSH_HOSTMACHINE",
      ref: "origin/master",
      repo: "GIT_REPOSITORY",
      path: "DESTINATION_PATH",
      "pre-deploy-local": "",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
  },
};
