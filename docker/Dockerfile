# Stage 1: builder
FROM centos:centos7 as builder


WORKDIR /opt


# set basic environment
RUN yum install -y git java-1.8.0-openjdk-devel bzip2
RUN yum groupinstall -y "Development Tools"
RUN curl -s http://apache.mirror.cdnetworks.com/maven/maven-3/3.6.3/binaries/apache-maven-3.6.3-bin.tar.gz | tar xzv
RUN curl -s https://nodejs.org/download/release/v8.11.2/node-v8.11.2-linux-x64.tar.gz | tar xzv
RUN curl -LO https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
RUN sh Miniconda3-latest-Linux-x86_64.sh -b -p /opt/miniconda3


ENV PYTHON_HOME=/opt/miniconda3
ENV JAVA_HOME=/usr/lib/jvm/java
ENV NODEJS_HOME=/opt/node-v8.11.2-linux-x64
ENV M2_HOME=/opt/apache-maven-3.6.3
ENV PATH=$PYTHON_HOME/bin:$JAVA_HOME/bin:$NODEJS_HOME/bin:${M2_HOME}/bin:$PATH


# clone and package
RUN mkdir /git
RUN cd /git && git clone https://github.com/brightics/studio.git
RUN cd /git/studio && mvn clean package -DskipTests


# setup
WORKDIR /brightics-studio


RUN mv /git/studio/build/target/dist/brightics-studio /
RUN sed -i "s/\"127.0.0.1\",/\"0.0.0.0\",/g" /brightics-studio/visual-analytics/conf.json
RUN sed -i "s/\%\*\ //g" /brightics-studio/setup.sh
RUN ./setup.sh
RUN rm -rf /brightics-studio/lib/etc /brightics-studio/lib/graphviz /brightics-studio/lib/hadoop /brightics-studio/lib/shortcut



# Stage 2
FROM centos:centos7


COPY --from=builder /brightics-studio /brightics-studio


WORKDIR /opt


RUN curl -s https://cdn.azul.com/zulu/bin/zulu8.46.0.19-ca-jre8.0.252-linux_x64.tar.gz | tar xzv && \
    yum install -y graphviz && \
    yum clean all && \
    rm -rf /var/cache/yum
    

ENV PYTHON_HOME=/brightics-studio/lib/brightics_python_env \
    JAVA_HOME=/opt/zulu8.46.0.19-ca-jre8.0.252-linux_x64 \
    NODEJS_HOME=/brightics-studio/lib/node


ENV PATH=$PYTHON_HOME/bin:$JAVA_HOME/bin:$NODEJS_HOME:$PATH


WORKDIR /brightics-studio


# expose the port for visual-analytics
EXPOSE 3000


ADD entrypoint.sh /etc/entrypoint.sh


RUN chmod +x /etc/entrypoint.sh


ENTRYPOINT ["/etc/entrypoint.sh"]
