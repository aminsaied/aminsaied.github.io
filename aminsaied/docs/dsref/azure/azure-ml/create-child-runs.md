---
title: Submitting child runs from a parent
---

From Microsoft [docs](https://docs.microsoft.com/en-us/azure/machine-learning/how-to-manage-runs#submit-child-runs).

```python
# parent.py
# This script controls the launching of child scripts
from azureml.core import Run, ScriptRunConfig, RunConfiguration

run_config_for_aml_compute = RunConfiguration()
run_config_for_aml_compute.target = "gpu-compute"
run_config_for_aml_compute.environment.docker.enabled = True 

run = Run.get_context()

child_args = ['Apple', 'Banana', 'Orange']
for arg in child_args: 
    run.log('Status', f'Launching {arg}')
    child_config = ScriptRunConfig(
        source_directory=".",
        script='child.py',
        arguments=['--fruit', arg],
        run_config = run_config_for_aml_compute
        )
    # Starts the run asynchronously
    run.submit_child(child_config)

# Experiment will "complete" successfully at this point. 
# Instead of returning immediately, block until child runs complete

for child in run.get_children():
    child.wait_for_completion()
```

## Log to the parent run from within the child run

```py3
from azureml.core import Run

# from within the child run
run = Run.get_context()
parent_run = run.parent

# write logs to parent run
parent_run.log("Foo", 73)
```