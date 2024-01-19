
# 自定义容器镜像创建阿里云函数FC

## 一、流程


## 二、项目文件说明

1. tmp文件夹不可删除，用于服务端node解压oss上的对应.
2. 入口文件更目录index.js
3. 具体处理逻辑见helper文件夹
   1. util.js 用于工具函数、公共变量存储
   2. unzip 解压处理oss文件
   3. ossClient 用于创建OSS客户端实例
   4. execShell，使用子进程child_procss，调用command 自行sif文件解析脚本（详情TODO）
4. local 用于本地mock测试
5. Dockerfile
   1. node环境安装
   2. 安装go，编译singularity
   3. 其他环境是否安装？（java、python等）
