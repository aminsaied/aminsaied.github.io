---
title: Azure Web Apps
sidebar_position: 1
---

## Creating an azure webapp

The simplest way to create an azure webapp is using the az cli tool.

e.g.

```bash
cd build  # build folder with the generated html files
az webapp up --sku F1 -n my-webapp -g my-rg --subscription $SUB_ID --html
```

This will create a new webapp "my-webapp" in the resource group "my-rg" under your
subscription.

In manually make updates you would do something like

```bash
yarn build
cd build
az webapp up -n my-webapp -g my-rg --subscription $SUB_ID --html
```

## Automating deployment with GitHub actions

Notes from: https://github.com/Azure/login

The above steps allow you to manually build and deploy your webapp. Let's
automate this with GitHub actions to run on PRs to `main` branch.

First we need to create a service principle for authentication:

```
az ad sp create-for-rbac --name "{sp-name}" --sdk-auth --role contributor \
    --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group}
```

For example:

```
az ad sp create-for-rbac --name "babel-webapp-sp" --sdk-auth --role contributor --scopes /subscriptions/$SUB_ID/resourceGroups/babel-rg
```

If this works you will see something like

```json
{
  "clientId": "<GUID>",
  "clientSecret": "<GUID>",
  "subscriptionId": "<GUID>",
  "tenantId": "<GUID>",
  (...)
}
```

Now we'll add a GitHub secrete called `AZURE_CREDENTIALS` will the above json.

- Visit the repo
- Go "Settings" > "Secrets" > "New repository secret"
- Name: `AZURE_CREDENTIALS`
- Secret: Copy the json output of the az ad sp create-for-rbac command above

Finally, create a github action `<your-repo>/.github/workflows/deploy.yml` something like this:

```yaml
name: Deploy Node.js to Azure Web App

on:
  pull_request:
    branches: [main]
    paths: [webpage/**]
  push:
    branches: [main]
    paths: [webpage/**]

env:
  AZURE_WEBAPP_NAME: babel-webapp
  AZURE_WEBAPP_PACKAGE_PATH: './webpage'
  NODE_VERSION: '12.x'

jobs:
  checks:
    if: github.event_name != 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: actions/setup-node@v1
        with:
          node-version: ${{ env.NODE_VERSION }}
      - name: Test Build
        run: |
          cd webpage
          if [ -e yarn.lock ]; then
          yarn install --frozen-lockfile
          elif [ -e package-lock.json ]; then
          npm ci
          else
          npm i
          fi
          yarn build
  build-and-deploy:
    if: github.event_name != 'pull_request'
    name: Build and Deploy
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@main
    - name: Use Node.js ${{ env.NODE_VERSION }}
      uses: actions/setup-node@v1
      with:
        node-version: ${{ env.NODE_VERSION }}
    - name: az login
      uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
        allow-no-subscriptions: true
    - name: yarn build and az webapp up
      run: |
        cd webpage
        if [ -e yarn.lock ]; then
        yarn install --frozen-lockfile
        elif [ -e package-lock.json ]; then
        npm ci
        else
        npm i
        fi
        yarn build
        cd build
        az webapp up -n babel-webapp -g babel-rg --html
```