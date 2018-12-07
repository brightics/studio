# Step 1. Build
docker build -t brightics-studio:latest .


# Step 2. Run
If you don't need to store the user data
docker run -d -p 3000:3000 brightics-studio:latest

If you want to store the user data
mkdir data
docker run -d -p 3000:3000 --privileged=true -v "`pwd`/data:/brightics-studio/userdata" brightics-studio:latest
