FROM centos:7

WORKDIR /opt

# set basic environment
RUN yum install -y git java-1.8.0-openjdk-devel bzip2 \
 && yum groupinstall -y "Development Tools" \
 && curl -s http://apache.mirror.cdnetworks.com/maven/maven-3/3.6.0/binaries/apache-maven-3.6.0-bin.tar.gz | tar xzv \
 && curl -s https://nodejs.org/download/release/v8.11.2/node-v8.11.2-linux-x64.tar.gz | tar xzv \
 && curl -LO https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh \
 && sh Miniconda3-latest-Linux-x86_64.sh -b -p /opt/miniconda3

ENV PYTHON_HOME=/opt/miniconda3 \
    JAVA_HOME=/usr/lib/jvm/java \
    NODEJS_HOME=/opt/node-v8.11.2-linux-x64 \
    M2_HOME=/opt/apache-maven-3.6.0

ENV PATH=$PYTHON_HOME/bin:$JAVA_HOME/bin:$NODEJS_HOME/bin:${M2_HOME}/bin:$PATH


# clone and package
RUN mkdir /git \
 && cd /git \
 && git clone https://github.com/brightics/studio.git \
 && cd /git/studio \
 && mvn clean package -DskipTests


# setup
WORKDIR /brightics-studio
RUN mv /git/studio/build/target/dist/brightics-studio / \
 && cd /brightics-studio \
 && sed -i "s/\%\*\ //g" setup.sh \
 && ./setup.sh


# expose the port for visual-analytics
EXPOSE 3000


ADD entrypoint.sh /etc/entrypoint.sh
RUN chmod +x /etc/entrypoint.sh
ENTRYPOINT ["/etc/entrypoint.sh"]
