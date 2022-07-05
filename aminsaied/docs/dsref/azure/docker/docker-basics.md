---
title: Docker Basics
sidebar_position: 0
---

## Example - build and run local docker image from dockerfile

Start with a dockerfile. The name can (should?) be `dockerfile` with no extension. Here's an example.

```dockerfile
FROM mcr.microsoft.com/azureml/base

ARG AZURE_SDK_VERSION=1.7.0
ARG SKLEARN_VERSION=0.23.1

RUN pip install --upgrade pip
RUN pip install azureml-core==${AZURE_SDK_VERSION} azureml-sdk==${AZURE_SDK_VERSION}
RUN pip install scikit-learn==${SKLEARN_VERSION}
```

(Assuming you have docker installed and are in a shell where you can run docker commands. Test by running `docker images` for example.)  

Navigate to the directory housing your dockerfile and run the following:

```bash
docker build --tag aml:1.0 .
```

**NB.** Take note of the `.` at the end of the command. We are specifying the current working directory.  

**NB.** The `--tag` here of the form `<name>:<version>` of the image.

If you run `docker images` you should now see your image as tagged.

```
REPOSITORY  TAG     IMAGE ID        CREATED         SIZE
aml         1.0     38540699060f    4 minutes ago   1.68GB
...
```

To run this image as a container:

```bash
docker run --name test -it aml:1.0
```

**NB.**  
- The `--name` flag will assign a name (in this case `test`) to the container
- The `-i` flag (alternatively `--interactive`) will "Keep STDIN open even if not attached"
- The `-t` flag will "Allocate a pseudo-TTY"

The above command will land you in an interactive shell in a container built from the `aml:1.0` image. To exit the container run `exit`, which will return you.  

## See running containers

The docker ps command ([docs](https://docs.docker.com/engine/reference/commandline/ps/)) allows you to see containers.

```bash
docker ps
```

Adding the `-a` flag will show all container, both stopped and running.

## Copy files from host to running container

_From [this](https://stackoverflow.com/questions/22907231/copying-files-from-host-to-docker-container) stack overflow question._

```bash
docker cp foo.txt mycontainer:/foo.txt
```

where `mycontainer` is a container ID, not an image ID.

To copy files _from_ the container:

```bash
docker cp mycontainer:/foo.txt foo.txt
```

To copy multiple files to/from the container:

```bash
docker cp src/. mycontainer:/target
docker cp mycontainer:/src/. target
```

