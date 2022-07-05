---
title: Compute Usage Metrics
---

## Description

This example computes hyperdrive usage in a workspace.

Useful snippets:

- Extract / compute duration, start time and end time from runs
- Check run types

## Example

Connect to the relevant workspace.

```python
from azureml.core import Workspace
ws = Workspace.from_config()
```

Methods used to extract duration and start time from a run.

```python
from datetime import datetime

def to_datetime(s):
    return datetime.strptime(s, '%Y-%m-%dT%H:%M:%S.%fZ')

def get_duration_and_start(run):
    try:
        details = run.get_details()
        start = to_datetime(details['startTimeUtc'])
        end = to_datetime(details['endTimeUtc'])
        duration = end-start
        return duration.total_seconds(), start
    except:
        raise ValueError(f"Error getting duration from {run.id}")
```

We then find a list of all experiments which include at least one hyperdrive run.

:::tip "This can be slow ⌚"
If your workspace has a lot of experiments/runs, this can be quite slow.
:::

```python
# get all experiments which include a hyperdrive run
hyperdrive_experiments = set()
for exp_name, exp in ws.experiments.items():
    for run in exp.get_runs():
        if run.type == "hyperdrive":
            print(f"Adding {exp_name}")
            hyperdrive_experiments.add(exp_name)
            break
```

Create a pandas `DataFrame` to store the relevant information.

```python
import pandas as pd

columns = [
    "start_date",
    "experiment",
    "run_id",
    "duration",
    "n_child_runs",
]

df = pd.DataFrame(columns=columns)
```

Now run through each hyperdrive experiment and compute duration, number of child runs, adding these
data to the `DataFrame`.

```python
for exp_name in hyperdrive_experiments:
    exp = ws.experiments[exp_name]
    runs = exp.get_runs()
    for run in exp.get_runs():
        
        if run.type == "hyperdrive":
        
            duration, start_date = get_duration_and_start(run)
            n_child_runs = len(list(run.get_children()))

            row = {
                "start_date": start_date,
                "experiment": exp_name,
                "run_id": run.id,
                "duration": duration,
                "n_child_runs": n_child_runs,
            }
            
            print(f"Adding {row}")

            df = df.append(row, ignore_index=True)
```

Finally, save these results to csv.

```python
df.to_csv("hyperdrive-usage.csv", index=False)
```