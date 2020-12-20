FROM python:3.8-buster

ENV PYTHONUNBUFFERED 1

RUN mkdir -p /home/biterobot/

WORKDIR /home/biterobot/
COPY biterobot/. ./

COPY requirements.txt ./

RUN apt-get -y update \
&& pip3 install --upgrade pip \
&& pip3 install --no-cache-dir -r requirements.txt \
&& apt-get -y clean \
&& rm -rf \
/var/lib/apt/lists/* \
/tmp/* \
/var/tmp/*


EXPOSE 80/tcp
