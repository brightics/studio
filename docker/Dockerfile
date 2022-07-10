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

RUN conda create -y -n python python=3.6.6
SHELL ["conda", "run", "-n", "python", "/bin/bash", "-c"]
RUN mv /git/studio/build/target/dist/brightics-studio /
RUN sed -i "s/\"127.0.0.1\",/\"0.0.0.0\",/g" /brightics-studio/visual-analytics/conf.json
RUN sed -i "s/\%\*\ //g" /brightics-studio/setup.sh
RUN ./setup.sh
RUN /brightics-studio/lib/brightics_python_env/bin/pip install kss==1.2.4
RUN /brightics-studio/lib/brightics_python_env/bin/python -m spacy download en_core_web_sm
RUN mv /brightics-studio/lib/nltk_data /brightics-studio/lib/brightics_python_env/
RUN rm -rf /brightics-studio/lib/etc /brightics-studio/lib/graphviz /brightics-studio/lib/hadoop /brightics-studio/lib/shortcut /brightics-studio/lib/node/node_modules/npm/changelogs /brightics-studio/lib/node/node_modules/npm/doc /brightics-studio/lib/node/node_modules/npm/html /brightics-studio/lib/node/node_modules/npm/man /brightics-studio/lib/node/node_modules/npm/scripts /brightics-studio/lib/node/node_modules/npm/*.md /brightics-studio/lib/node/node_modules/npm/AUTHORS /brightics-studio/lib/node/node_modules/npm/TODO.org /brightics-studio/lib/node/node_modules/npm/.github /opt/zulu8.46.0.19-ca-jre8.0.252-linux_x64/man 


# Stage 2
FROM centos:centos7

COPY --from=builder /brightics-studio /brightics-studio
COPY --from=builder /opt/miniconda3 /opt/miniconda3

WORKDIR /opt

RUN yum install -y graphviz && \
    yum clean all && \
    rm -rf /var/cache/yum && \
    curl -s https://cdn.azul.com/zulu/bin/zulu8.46.0.19-ca-jre8.0.252-linux_x64.tar.gz | tar xzv

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
