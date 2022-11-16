FROM sds.redii.net/brightics-container-dev/centos:7_v3

WORKDIR /opt

ADD BrighticsStudio-linux.tgz /opt/
COPY libstdc++.so.6 /lib64/

EXPOSE 3000
EXPOSE 9097

ADD entrypoint.sh /etc/entrypoint.sh
RUN chmod +x /etc/entrypoint.sh
ENTRYPOINT ["/etc/entrypoint.sh"]