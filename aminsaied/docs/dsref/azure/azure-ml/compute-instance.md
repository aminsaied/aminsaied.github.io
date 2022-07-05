---
title: Compute Instances
---

What is a compute instance (CI)? It is Azure ML's answer to virtual machines (VMs). A compute instance is attached to your Azure ML Workspace.

## Managing your compute instance from the terminal

Goals:

- Use SSH to connect to your CI
- Use Azure CLI to start/stop your CI

Note: When creating your CI make sure you use the option "enable SSH" and provide your SSH public key.

### Install Azure CLI

Install the Azure ML CLI extension

```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
az extension add -n azure-cli-ml
```

### Create Compute Instance

Navigate to your workspace at ml.azure.com > Compute > Compute instances > + New

When creating your CI make sure to enable SSH. Once your compute is created you will see an SSH option under Application URI. This will give you the IP address associated to your CI, as well as the Port. You will see something like this:

```
User name
azureuser

Publib IP address
53.250.37.121

Private IP address
10.0.0.4

Port number 
50000

Login using local account
ssh azureuser@53.250.37.121 -p 50000
```

Note: This IP address / port are stable.

### Update SSH Config

To simplify SSH'ing into your CI you can update you SSH config file:

```bash
nano ~/.ssh/config
```

```
Host my-ci
  HostName 53.250.37.121
  User azureuser
  Port 50000
```

If your CI is running you can now run

```bash
ssh my-ci
```

Note - if you want to start or stop your CI you can use the Azure ML CLI

```bash
az ml computetarget computeinstance start -n <compute-instance-name> -w <workspace-name> -g <resource-group-name>
```

or 

```bash
az ml computetarget computeinstance stop -n <compute-instance-name> -w <workspace-name> -g <resource-group-name>
```









