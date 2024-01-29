#!/bin/bash

apt-get update && apt-get upgrade -y && apt-get install sudo

sudo apt-get install -y -qq \  
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

# 安装go1.14.12
export VERSION=1.14.12 OS=linux ARCH=amd64 &&  wget https://dl.google.com/go/go$VERSION.$OS-$ARCH.tar.gz &&     tar -xzvf go$VERSION.$OS-$ARCH.tar.gz &&     rm go$VERSION.$OS-$ARCH.tar.gz

# 配置go PATH
export GOPATH=/go
export PATH=$PATH:/usr/local/go/bin:$GOPATH/bin
export GOPROXY=https://goproxy.io,direct

# 下载 singularity脚本 https://github.com/sylabs/singularity.git
git clone https://gitclone.com/github.com/sylabs/singularity.git &&    cd singularity &&   git checkout v3.5.1

# singularity
cd /usr/local/singularity

# 编译前修改makefile使用的 goPath
sed -i '$i\GOPROXY := https:\/\/goproxy.io,direct/' mlocal/frags/go_common_opts.mk

# 编译singularity
./mconfig &&     make -C ./builddir &&    sudo make -C ./builddir install
