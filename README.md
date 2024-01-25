# 自定义容器镜像创建阿里云函数FC

## 一、流程

## 二、项目文件说明

1. tmp文件夹不可删除，用于服务端node临时存储解压oss上的压缩文件.
2. 入口文件根目录index.js
3. 具体处理逻辑见helper文件夹
   1. util.js 用于工具函数、公共变量存储
   2. unzip 解压处理oss文件
   3. ossClient 用于创建OSS客户端实例
   4. execShell，使用子进程child_procss，调用command 自行sif文件解析脚本（详情TODO）
4. local 用于本地mock测试，***尽量减小oss测试文件大小，本地测试使用的是oss公网流量，会进行计费***
5. Dockerfile
   1. node环境安装
   2. 安装go，编译singularity
   3. 其他环境是否安装？（java、python等）

## 三、help && FAQ （base  Ubuntu ）

1. 补充安装依赖  `libudev-dev` , vim
2. 安装软件中存在交互问询，执行 apt-get install 时添加 -q 参数
3. 执行 类似 singularity exec  xxx.sif python 命令报错

   1. 镜像挂载失败，squashfs文件系统未启用或支持
      1. ```
         FATAL:   container creation failed: mount /proc/self/fd/3->/usr/local/var/singularity/mnt/session/rootfs error: while mounting image /proc/self/fd/3: squashfs filesystem seems not enabled and/or supported by your kernel
         ```
4. 使用 sudo  modprobe  squashfs，提示  `sudo: modprobe: command not found ,缺失 `modprobe ` 工具包 libudev-dev`
   ``阿里云FC容器内 依然报错问题``
   ```shell
       FATAL   [U=0,P=46]         Master()                      container creation failed: mount /proc/self/fd/3->/usr/local/var/singularity/mnt/session/rootfs error: while mounting image /proc/self/fd/3: squashfs filesystem seems not enabled and/or supported by your kernel
   ```
   创建实例选择 GPU实例
5. ```
   // 创建用户命名空间 失败
   root@3664549d2237:/app# singularity exec ./ubuntu1604_py3_cellimage.sif R
   INFO:    Converting SIF file to temporary sandbox...
   FATAL:   while extracting ./ubuntu1604_py3_cellimage.sif: root filesystem extraction failed: extract command failed: ERROR  : Failed to create user namespace: not allowed to create user namespace
   : exit status 1

   ```
   参考文档：https://stackoverflow.com/questions/73618551/error-failed-to-create-user-namespace-user-namespace-disabled-even-after-dis

   文件系统未共享，容器无法访问根目录    使用sudo docker run -t(/-d)  xxx imggeid
6. 启用无特权命名空间创建
   base Debian
   `sudo sysctl -w kernel.unprivileged_userns_clone=1`
7. error: `ERROR   [U=0,P=84]         shared_mount_namespace_init() Failed to unshare root file system: Operation not permitted`
   docker run add parameter `--privileged` to fiexed
8. [Dockerfile优化推荐](https://help.aliyun.com/zh/acr/user-guide/dockerfile-syntax-analysis-function?spm=5176.8351553.top-nav.5.17f01991jFoc6k&scm=20140722.S_help%40%40%E6%96%87%E6%A1%A3%40%402529483.S_BB1%40bl%2BRQW%40ag0%2BBB2%40ag0%2Bhot%2Bos0.ID_2529483-RL_dockerfile%E4%BC%98%E5%8C%96-LOC_console~UND~help-OR_ser-V_3-P0_0)
