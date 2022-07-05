---
title: Conda
description: Package management for Python with Conda.
---

[Conda docs](https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html)

## Create conda environments from yml file

Specify your conda environment in a `env.yml` file like this:

```yml
name: aml
channels:
  - defaults
  - anaconda
dependencies:
  - python=3.8
  - pip
  - pip:
    - azureml-sdk
```

Then run

```bash
conda env create -f env.yml
```

To create the conda environment `aml`.

To update your environment, modify the `env.yml` file and run

```bash
conda env update -f env.yml --prune
```

Note: the `--prune` flag will remove any dependencies that are no longer required.

## Example: `pyspark`

Let's set up a new conda environment with pyspark. Since we want to have a jupyter kernel tied to this environment we also add `ipykernel` and `jupyter`. In this example we specify the python version.

```python
$ conda create -n pyspark python=3.6 pyspark ipykernel jupyter
```

Now activate the environment and create the kernel

```python
$ conda activate pyspark
$ ipython kernel install --user --name=<any_name_for_kernel>
```