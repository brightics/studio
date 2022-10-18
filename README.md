# Brightics Studio v1.3

[![Version](https://img.shields.io/github/v/release/brightics/studio)](https://github.com/brightics/studio/releases)
[![Release Date](https://img.shields.io/github/release-date/brightics/studio)](https://github.com/brightics/studio/releases)
[![Build Status](https://travis-ci.com/brightics/studio.svg?branch=master)](https://travis-ci.com/brightics/studio)
![CodeQL](https://github.com/brightics/studio/workflows/CodeQL/badge.svg)
![Download Counts](https://img.shields.io/github/downloads/brightics/studio/total.svg)
![Latest Counts](https://img.shields.io/github/downloads/brightics/studio/latest/total)
[![docker star](https://img.shields.io/docker/stars/brightics/studio)](https://hub.docker.com/r/brightics/studio)
<a href="../../graphs/contributors"><img src="https://img.shields.io/github/contributors/brightics/studio.svg" /></a>
[![community](https://img.shields.io/badge/Help-Community-brightgreen)](https://www.brightics.ai/community/categories)
[![youtube](https://img.shields.io/youtube/views/DR13sLVWXYs?style=social)](https://www.youtube.com/brighticsTV)

<img src="docs/images/brightics_sample.png" alt="Brightics Studio"></img>

[[English](README_en.md)]
[[한국어](README.md)]

## Overview

---

- Brightics Studio는 데이터 과학자를 위한 웹 기반 데이터 분석 워크플로우 도구입니다.
- Brightics Studio는 직관적인 사용자 인터페이스를 제공하며 대화형 GUI를 통해 데이터에서 잠재적인 통찰력을 찾을 수 있습니다.
- Brightics Studio는 scikit-learn 및 pandas와 같은 인기 있는 파이썬 라이브러리를 포함하여 분석을 위한 인터페이스를 제공합니다.
- Brightics Studio를 사용하여 시티즌 데이터 과학자와 전문 데이터 과학자 모두 데이터 분석 프로젝트를 수행할 수 있습니다.
- Brightics Toolkit을 통해 생성한 사용자 정의 함수를 Brightics 워크플로에서 사용할 수 있습니다.
- 다양한 방법으로 데이터를 시각화할 수 있도록 차트 및 보고서 생성 기능을 제공합니다.

## Documentation

---

[Brightics 홈페이지](https://www.brightics.ai)에서 확인할 수 있습니다.

## Getting started

---

릴리즈 파일 혹은 docker 이미지를 이용하여 Brightics Studio를 설치할 수 있습니다.


### Prerequisite
#
* 데이터베이스와 상호 작용하는 일부 기능에는 [Oracle Instant Client](http://www.oracle.com/technetwork/database/database-technologies/instant-client/overview/index.html) 와 같은 클라이언트 라이브러리가 필요합니다.
* Apple M1 processor 기반 장치에서는 동작하지 않을 수 있습니다. [Docker Support](#docker-support)를 참고하여 Brightics Studio Docker 이미지를 사용할 수 있습니다.

### Installation - release file
#
  * Download

      릴리스 파일은 github 릴리스 또는 [다운로드 페이지](https://www.brightics.ai/downloads) 에서 다운로드 할 수 있습니다.

      다운로드한 파일을 실행하면 파일이 자동으로 추출됩니다.

      ```
      BrighticsStudio-\<version\>-\<os name\>.exe : for windows
      BrighticsStudio-\<version\>-\<os name\>.sh : for linux and mac
      ```  
  
      디렉토리의 세부 사항은 다음과 같습니다:  
  
      ```
      /brightics-studio/brightics-server : core home
      /brightics-studio/visual-analytics : GUI home
      /brightics-studio/lib : external libs
      ```  
  
  * Launch

      실행하기 전에 아무것도 준비할 필요가 없습니다. 릴리스에는 패키지 자체의 모든 요구 사항이 포함되어 있습니다.        
      압축을 푼 디렉토리로 이동하여 실행합니다.

      ```
      Brightics-Studio-Launcher.exe : Launcher for windows
      start-brightics.cmd : for windows
      start-brightics.sh : for linux and mac
      ```

      > **Notes**
      > 
      > 설치 경로에 한글이 포함된 경우 Tokenizer(한국어) 기능이 제대로 작동하지 않습니다.   
      > 이 기능을 사용하기 위해서는 전체 경로에 한글이 포함되지 않은 폴더에 Brightics Studio를 설치해야 합니다.  


  * Patch

      새 버전이 출시되면 아래 파일을 최신 버전의 brightics-studio로 이동하여 데이터와 프로젝트를 유지해야 합니다.
      
        ```
        /brightics-studio/visual-analytics/brightics.db
        /brightics-studio/brightics-server/data/*
        ```

  * Run

      Brightics Studio는 start-brightics.cmd(또는 start-brightics.sh) 실행 후 Chrome 브라우저에 팝업됩니다. 

      Brightics Studio가 자동으로 팝업되지 않는 경우 수동으로 http://127.0.0.1:3000 으로 이동하여 Brightics Studio를 사용하십시오.  

      ※ macOS 에서 http://127.0.0.1:3000에 접속이 되지 않는 경우 [Brightics AI 포탈 FAQ](https://www.brightics.ai/community/FAQ) 의 "Brightics Studio Mac 버전 설치 오류가 발생합니다."를 확인해주세요.
      
  * **Optional** : macOS 사용자는 [Homebrew](https://brew.sh/) 를 사용하여 [graphviz](http://graphviz.org/download/) 를 설치해야 Decision Tree의 트리 그림을 그릴 수 있습니다.   
  하지만 설치가 쉽지 않다면 넘어가도 됩니다.
      ```
      brew install graphviz
      ```  
  
    
### Installation - docker
#
  * Docker

      작업환경에 [Docker](https://www.docker.com/get-started/)를 설치합니다. 

  * Docker Image  

      Brightics Studio Docker 이미지는 [Docker Hub](https://hub.docker.com/r/brightics/studio) 에서 제공됩니다. [Docker Hub](https://hub.docker.com/r/brightics/studio) 페이지로 이동하여 지시에 따라 설치합니다.


## Contact us
---
Brightics Studio가 마음에 드셨다면 사용 후기와 피드백 부탁드립니다.  
또는 Brightics Studio 사용 중 궁금한 사항이 있으시면 주저하지 마시고 brightics@samsung.com으로 연락주세요.

## License
---

Visual Analytics(Web GUI) project is licensed under the terms of the Brightics Visual Analytics LICENSE, please check Notice below.  
The others are licensed under the terms of the Apache 2.0 license.

### Notice
#
Source codes of the Web GUI are not yet fully opened due to some license issues from its submodules.  
The purpose of personal use for commercial or non-commercial is allowed but only the redistribution is prohibited.  
See [the documentation about this license](BRIGHTICS_VA_LICENSE) for more details.  
We are working hard to solve these issues and soon it will be public.

### Contributors
#
This project exists thanks to all the people who contribute.
<a href="../../graphs/contributors"><img src="https://opencollective.com/brightics-studio/contributors.svg?width=890&button=false" /></a>
