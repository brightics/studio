## Step 0. Prerequisite

You have to setup Docker before beginning.

If you've not installed Docker on your laptop yet, the following website can help you.

https://docs.docker.com/install/

## Step 1. Build

You have to build the Docker image At least once before use.

```console
$ docker build -t brightics-studio:latest .
```


## Step 2-1. Run without a volume

If you don't need to store any user data

```console
$ docker run -d -p 3000:3000 brightics-studio:latest
```

It may take approximately 20 seconds for all components of brightics-studio to start.


## Step 2-2. Run with a volume

If you want to store the user data you were working on

```console
$ mkdir userdata
$ docker run -d -p 3000:3000 --privileged=true -v "`pwd`/userdata:/brightics-studio/userdata" brightics-studio:latest
```

The user data directory will may be created as root.

If you want to change the owner of the directory, execute the following statement.

```console
$ sudo chown `id -un`:`id -un` -R userdata
```


## Step 3. Stop and Remove

```console
$ docker ps | grep brightics-studio:latest | awk '{system("docker stop " $1 "; docker rm " $1)}'
```
