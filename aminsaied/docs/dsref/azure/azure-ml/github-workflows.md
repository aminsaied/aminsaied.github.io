# GitHub Workflows

Goal: Add GitHub action to your repo to run Azure ML jobs.

Typical use case: Run suite of tests in AzureML.

Steps:
1. Add secret to github to authenticate the workflow
2. Create github action


## Step 1 - Azure, meet GitHub. Github, meet Azure.

https://docs.microsoft.com/en-us/azure/developer/github/connect-from-azure


```
az login
az ad sp create-for-rbac --name {app-name} --role contributor --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group} --sdk-auth
```

Concretely:

```
az ad sp create-for-rbac --name "amsaied-sp" --role contributor \
    --scopes /subscriptions/${SUB_ID}/resourceGroups/amsaied-rg \
    --sdk-auth
```

This returns json output like this:

```json
{
    "clientId": "<GUID>",
    "clientSecret": "<GUID>",
    "subscriptionId": "<GUID>",
    "tenantId": "<GUID>",
    (...)
}
```

Keep that information handy!

Go to GitHub > Your repo > Settings > Secrets > Create Secret

Call it something like `AZURE_CREDENTIALS` and paste the json response from above as the value.

## Step 2 - Create the GitHub Action

```yaml
name: azureml canary

on:
  workflow_dispatch:  # allows manual triggering of workflow against any branch
  schedule:
  - cron: '5 8 * * 0'  # runs once a week at 8.05 on day 0 (Monday)

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: check out repo
      uses: actions/checkout@v2
    - name: setup python
      uses: actions/setup-python@v2
      with: 
        python-version: "3.8"
    - name: requirements
      run: pip install azureml-sdk>=1.20.0
    - name: azure login
      uses: azure/login@v1
      with:
        creds: ${{secrets.AZURE_CREDENTIALS}}
    - name: release canary
      run: python examples/azureml/azureml_submit.py --backend ddp-amp --process_count 2 --wait
```