---
title: Service Principle Authentication
---

## Example

In this example we use a service principle to authenticate the submission of an experiment to AML.

**NB.** In order to create a service principle you need to be an admin on your subscription.

You can use the Azure Portal to access the details necessary to create a service principle object in the AzureML Python SDK. It is a best practice to pass the secrets needed to create a service principle object in through environment variables. We then use `os.environ` to access these in code.

```python
import os
from azureml.core import Experiment
from azureml.core import ComputeTarget
from azureml.core import ScriptRunConfig
from azureml.core import Workspace
from azureml.core.authentication import ServicePrincipalAuthentication


# create service principle
sp = ServicePrincipalAuthentication(
    tenant_id=os.environ['AML_TENANT_ID'],
    service_principal_id=os.environ['AML_PRINCIPAL_ID'],
    service_principal_password=os.environ['AML_PRINCIPAL_PASS'],
)

# get workspace
ws = Workspace.get(
    name=...,
    subscription_id=...,
    resource_group=...,
    auth=sp,
)

# get compute target
COMPUTE_TARGET = 'my-compute-target'
compute_target = ComputeTarget(workspace=ws, name=COMPUTE_TARGET)

# Add training script to run config
runconfig = ScriptRunConfig(source_directory=".", script="foo_script.py")

# Attach compute target to run config
runconfig.run_config.target = compute_target

# Create experiment
exp = Experiment(ws, 'foo')

# Submit run
run = exp.submit(runconfig)
```

### Getting service principle 

To use the service principle to authenticate you will need

- Tenant ID
- Client ID
- Client Secret

There are a number of ways to get these.

This is a test
=== "Azure Portal"
    Azure portal > Azure Active Directory (AAD) > App Registrations and locate your service principle.
    
    Here you can find your Tenant ID and Client ID. You will then be able to select "Certificates & secrets" and generate a new client secret.

=== "Azure CLI"
    TODO: see [here](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-authenticate-service-principal-powershell) for a start

### Setting environment variables

To avoid hard coding the service principle IDs and secrets you should pass those values via environment variables.

In Ubuntu
```bash
$ export AML_TENANT_ID='your-tenant-id'
$ export AML_PRINCIPAL_ID='your-client-id'
$ export AML_PRINCIPAL_PASS='your-client-secret'
```

In powershell
```bash
> env:AML_TENANT_ID='your-tenant-id'
> env:AML_PRINCIPAL_ID='your-client-id'
> env:AML_PRINCIPAL_PASS='your-client-secret'
```