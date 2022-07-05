---
title: Private Wheels
sidebar_position: 2
---

Install a private python package from a wheel file.

Problem: You have a python package you wish to install on your Docker image
but the source code is not publicly available (e.g., the code is not yet ready
to be shared but the docker build process is public).

### Step 1: Build the wheel

Build wheel for your package e.g.

```bash
python setup.py build --build-base . bdist_wheel -d . --universal
```

This will produce a wheel file , e.g. `<my-package>-0.0.1-py2.py3-none-any.whl`.

You can install this with

```bash
pip install <my-package>-0.0.1-py2.py3-none-any.whl
```

### Step 2: Upload to Azure storage account

A simple way to do this is via Azure Storage Explorer.

- Upload the file to your (private!) storage account
- Generate a SAS token and copy the url: it should be of the form:

```bash
https://<storage-account>.blob.core.windows.net/<container-name>/<path-on-storage/to/>/<my-package>-0.0.1-py2.py3-none-any.whl?<SAS-token>
```

### Step 3: dockerfile

We can use `curl` to download and `pip` to install the wheel. Don't forget to delete the wheel
afterwards.

```dockerfile
# dockerfile
FROM <container-registry>.azurecr.io/<image-name>:<tag>

RUN apt-get -y update; apt-get -y install curl
RUN mkdir -p /tmp/wheels
RUN  curl <url-with-sas-token> --output /tmp/wheels/<my-package>-0.0.1-py2.py3-none-any.whl
RUN pip install /tmp/wheels/<my-package>-0.0.1-py2.py3-none-any.whl
RUN rm -rf /tmp/wheels/
...
```

Notes:

- `apt-get` needs to be given the `-y` flag
- make sure the path `curl` writes to exists with `mkdir -p /tmp/wheels`
- remember to delete the wheel file at the end