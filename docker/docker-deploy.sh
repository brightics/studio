# Step 1: Login
docker login -u $DOCKER_USER -p $DOCKER_PASS

# Step 2: Tag
docker build -t brightics/studio:latest ./docker

# Step 3: Publish
docker push brightics/studio:latest


# Step 1: Login
docker login docker.pkg.github.com -u $GITHUB_USER -p $GITHUB_PASS

# Step 2: Tag
docker tag brightics/studio:latest docker.pkg.github.com/brightics/studio/brightics-studio:$GIT_TAG

# Step 3: Publish
docker push docker.pkg.github.com/brightics/studio/brightics-studio:$GIT_TAG
