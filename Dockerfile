# 使用官方的Ubuntu基础镜像
FROM ubuntu:20.04

# 切换到root用户
#USER root

# 更新软件包列表并安装必要的依赖 squashfs-tools-ng
RUN apt-get update && apt-get upgrade -y && apt-get install sudo
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN sudo apt-get install -y -qq \  
    net-tools \
    vim \
    curl \
    tzdata \
    build-essential \
    libssl-dev \
    uuid-dev \  
    libudev-dev \ 
    libgpgme-dev \    
    squashfs-tools \    
    libseccomp-dev \    
    wget \    
    pkg-config \    
    git \    
    cryptsetup-bin && \    
    apt-get clean && \
    rm -rf /tmp/* /var/cache/* /usr/share/doc/* /usr/share/man/* /var/lib/apt/lists/*

# 进入usr/local
WORKDIR /usr/local

# 下载Node.js 16.20.0版本    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash - && sudo  apt-get install -y nodejs

RUN echo "export NODE_HOME=/usr/local/node" >> /etc/profile && \
    echo "export PATH=$NODE_HOME/bin:$PATH" >> /etc/profile && /bin/bash -c "source /etc/profile"


# 安装go1.14.12
RUN export VERSION=1.14.12 OS=linux ARCH=amd64 && \  
    wget https://dl.google.com/go/go$VERSION.$OS-$ARCH.tar.gz && \ 
    tar -xzvf go$VERSION.$OS-$ARCH.tar.gz && \ 
    rm go$VERSION.$OS-$ARCH.tar.gz

# 配置go PATH
ENV GOPATH /go
ENV PATH $PATH:/usr/local/go/bin:$GOPATH/bin
# ENV GOPROXY=https://goproxy.cn

# 下载 singularity脚本 https://github.com/sylabs/singularity.git
RUN git clone https://gitclone.com/github.com/sylabs/singularity.git && \    
    cd singularity && \    
    git checkout v3.7.1

# singularity
WORKDIR /usr/local/singularity

# 编译前修改makefile使用的 goPath
RUN sed -i '$i\GOPROXY := https:\/\/goproxy.cn' mlocal/frags/go_common_opts.mk

# 编译singularity
RUN ./mconfig && \    
    make -C ./builddir && \    
    sudo make -C ./builddir install

# 设置工作目录
WORKDIR /app

# 将当前目录下的所有文件复制到工作目录
COPY . /app

# 安装依赖
RUN npm install

# 暴露端口
EXPOSE 9000

# 定义环境变量
ENV NODE_ENV production

# 挂载主机目录到容器中
USER root
VOLUME /path/to/host/directory

# 运行命令
# ENTRYPOINT ["node"]
CMD [ "npm","run", "start","--privileged=true"]
