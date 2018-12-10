# Step 0. Prerequisite
You have to setup docker.

If you've not installed docker on your laptop yet, the following website can help you.

https://docs.docker.com/install/

# Step 1. Build
```console
$ docker build -t brightics-studio:latest .
```


# Step 2. Run
If you don't need to store the user data
```console
$docker run -d -p 3000:3000 brightics-studio:latest
```

If you want to store the user data
```console
$ mkdir userdata
$ docker run -d -p 3000:3000 --privileged=true -v "`pwd`/userdata:/brightics-studio/userdata" brightics-studio:latest
```
