Brightics Studio
================

<img src="docs/images/brightics_sample.png" width="960px" height="468px" alt="Brightics Studio"></img>

## Overview

Brightics Studio is a web-based data analysis workflow tool for the data scientists.<br>
Its intuitive and interactive GUI leads you to find potential insights from the data.<br>
It supports analytic functions by wrapping popular python libraries such as scikit-learn and pandas,<br>
so the beginners and data scientists who are not familiar with programming can easily handle these modules.<br>
You can extend functions through Brightics Toolkit and put them into your workflows directly.<br>
Various charts and report generator are also provided to visualize data in several ways. 


## Documentation
Please visit our web site http://www.brightics.ai

## Getting started
### Prerequisite
 * JDK 1.8+ (64bit)
 * Python 3.6 (64bit)

### Setting up the environment variables
Make sure java, python and node are executable.

Example for windows:

    SET JAVA_HOME=<Your Java installation path>
    SET PYTHON_HOME=<Your Python installation path>
    SET PATH=%PATH;%PYTHON_HOME%\bin;%JAVA_HOME%\bin;%NODE_HOME%\bin

Example for linux like systems:

    export JAVA_HOME=<Your Java installation path>
    export PYTHON_HOME=<Your Python installation path>
    export PATH=$PATH:$PYTHON_HOME/bin:$JAVA_HOME/bin:$NODE_HOME/bin
    
Most common cases you don't need to set above parameters because those projects automatically add paths during installation. 

### Installation
Unzip the downloaded file in somewhere.

	/brightics-studio/brightics-server : core home
	/brightics-studio/visual-analytics : GUI home
	/brightics-studio/lib : external libs

### Launch
Go to unzipped directory and run.

	start-brightics.cmd : for windows
	start-brightics.sh : for linux and mac
	
### Create python environment (Optional)
When you use stable release, you can skip this process.<br>
Because our package has all required python libraries in its own environment.<br>

If for some reasons that the files are crashed, you should remove and reconstruct a environment directory under lib/brightics\_python\_env.<br>
This guide covers setting up python environment from the beginning.<br> 
Some of python packages need Microsoft Visual C++ Build Tools.<br>
Please make sure [Microsoft Visual C++ 14.0](https://go.microsoft.com/fwlink/?LinkId=691126) installed when you run a setup command in windows.<br>
Reference : [Python wiki for WindowsCompilers](https://wiki.python.org/moin/WindowsCompilers)

    setup.cmd <pip options> : for windows
    setup.sh <pip options> : for linux and mac
    

## Development
### Extend
To extend functions, see the user manual about Brightics Toolkit.
http://www.brightics.ai
    
### Build
Build core packages with maven.

	mvn clean package -DskipTests [Options] -Popensource

## License
Visual Analytics(Web GUI) project is licensed under the terms of the Brightics Visual Analytics LICENSE, please check Notice below.<br>
The others are licensed under the terms of the Apache 2.0 license.

### Notice
Source codes of the Web GUI are not yet fully opened due to some license issues from its submodules.<br>
The purpose of personal use for commercial or non-commercial is allowed but only the redistribution is prohibited.<br>
See [the documentation about this license](BRIGHTICS_VA_LICENSE) for more details.<br>
We work hard to solve these issues and soon it will be public.

## Contact us
If you like to use brightics studio, please let us know your usage and feedback.<br>
Or you have questions while using brightics studio, don't hesitate and feel free to contact brightics@samsung.com.
