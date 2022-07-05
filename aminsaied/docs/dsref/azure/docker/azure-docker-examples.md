---
title: Azure ML Docker Examples
sidebar_position: 1
---

Some examples of working with docker in Azure (ML).

## Example: Pull an image from MCR and run locally

To pull this image

```
mcr.microsoft.com/azureml/bert:pretrain-openmpi3.1.2-cuda10.0-cudnn7-ubuntu16.04
```

and run it locally, do:

```bash
$ docker pull mcr.microsoft.com/azureml/bert:pretrain-openmpi3.1.2-cuda10.0-cudnn7-ubuntu16.04
$ docker run -it mcr.microsoft.com/azureml/bert:pretrain-openmpi3.1.2-cuda10.0-cudnn7-ubuntu16.04
root@99ab01080c61:/#
```

## Example: Dockerfiles & Azure ML

**Step 1 - Write dockerfile**  

Start with a dockerfile

```dockerfile
# ./Dockerfile
FROM mcr.microsoft.com/azureml/base

RUN pip install --upgrade pip
RUN pip install azureml-core==1.7.0 azureml-sdk==1.7.0 scikit-learn==0.23.1
```

**Step 2 - Azure Container Registry**  

Push this image to the Azure Container Registry associated to your Azure ML Workspace:

1. Find the name of your existing Azure Container Registries (there will be one created when you spin up an Azure ML workspace)

    ```bash
    az ml workspace show -w <myworkspace> -g <resourcegroup> --query containerRegistry
    ```

    You'll get something like this:
    
    ```bash
    /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/
        Microsoft.ContainerRegistry/registries/<registry_name>
    ```

    Make a note of the `<registry_name>`.

    ??? failure "Error: Workspace not found"
    
        If you get an error that the workspace cannot be found you may need to set your subscription:

        ```bash
        # by name
        az account set --subscription "My Demos"

        # or by id
        az account set --subscription 42ae47bd-b19b-42c1-b0b9-19fd5be9d51b
        ```

- Login:

    ```bash
    az acr login --name <registry_name>
    ```

- Build your image in the cloud. Navigate to your dockerfile and run this to create and push the image into your Azure Container Registry:

    ```bash
    az acr build --image myimage:v1 --registry <registry_name> --file Dockerfile .
    ```

**Step 3 - Reference the container in your Azure ML launch script**  

In this example we use the Azure ML python sdk to kick off the job. We need to reference our image here.

```python
# get workspace
ws = Workspace.get(...)

# Add training script to run config
src = ScriptRunConfig(
    source_directory=".",
    script="script.py",
)

# to run on local compute
src.run_config.environment.python.user_managed_dependencies = True
src.run_config.environment.docker.base_image = <azure-container-registry-image-name>

# Create experiment
exp = Experiment(...)

# Submit run
run = exp.submit(src)
```

To be explicit, when I ran the command

```bash
az acr build --image amsaied/async:v1 --registry amsaiedamlws8d0e0159 --file dockerfile .
```

Within the output you'll see this:

```
image:
    registry: amsaiedamlws8d0e0159.azurecr.io
    repository: amsaied/async
    tag: v1
```

which I can reference like this

```
amsaiedamlws8d0e0159.azurecr.io/amsaied/async:v1
```

for example

```python
src.run_config.environment.python.user_managed_dependencies = True
src.run_config.environment.docker.base_image = 'amsaiedamlws8d0e0159.azurecr.io/amsaied/async:v1'
```

:::tip "Warning: AML + WSL != Docker"
As of 2020/06/12, Azure ML does not support running docker locally from WSL.
:::