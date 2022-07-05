---
title: Azure CLI
---

# Azure CLI

First, login!

```bash
az login
```

## Useful commands

Get a list of your subscriptions with the az account list command:

```bash
az account list --output table
```

Use az account set with the subscription ID or name you want to switch to.

```bash
az account set --subscription "My Demos"
```

To run only a single command with a different subscription, use the --subscription argument. This argument takes either a subscription ID or subscription name:

```bash
az vm create --subscription "My Demos" --resource-group MyGroup --name NewVM --image Ubuntu
```

## Azure ML CLI

Install the ML extension:

```bash
az extension add -n azure-cli-ml
```

### Get your docker image into your Azure Container Registry

If you want Azure ML to run your code in your docker container use the Azure ML CLI:

Find the name of your existing Azure Container Registries (there will be one created when you spin up an Azure ML workspace)

```bash
az ml workspace show -w <myworkspace> -g <resourcegroup> --query containerRegistry
```

You'll get something like this: `/subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.ContainerRegistry/registries/<registry_name>`.

Login:

```bash
az acr login --name <registry_name>
```

Build your image in the cloud. Navigate to where your dockerfile lives and then run this to create and push the image into your Azure Container Registry:

```bash
az acr build --image myimage:v1 --registry <registry_name> --file Dockerfile .
```