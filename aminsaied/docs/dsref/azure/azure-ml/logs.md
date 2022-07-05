# Manage logs via the AML Python SDK

## Get AML experiment
Get handle on experiment:
```python
ws = Workspace.get(...)

exp = Experiment(ws, name)
```

Or you can get a dictionary (`ws.experiments: Dict[str, Experiment]`) mapping experiment names to AML experiments. For example:
```python
exp = ws.experiments['my-experiment']
```

## Get run of interest
Track down the run you are interested in. The `get_runs` method will return a generator of all the runs in that experiment.
```python
for run in exp.get_runs():
    ...
```

## Get the logs for a given run
Once you have the `run` object you care about you can get it's logs:
```python
# get all logs
run.get_all_logs(destination='aml-logs')

# get specific logs
run.download_file(
    name='azureml-logs/70_driver_log.txt', 
    output_file_path='aml-logs',
    )
```
That will download a copy of the logs to the directory specified. You can now parse through these using your favorite tools!

## Process logs with sed
Example searching thorugh 70_driver_logs.txt from the command line with sed.

```bash
cat 70_driver_log.txt | sed -n -E '/^(.*)(Error|fail)(.*)$/p'
```

will return every line with containing `Error` or `fail`.

Notes:

- `-n` means quiet: By default, `sed` prints all lines. We’d see all the text in the file with the matching lines printed twice. To prevent this, we’ll use the -n (quiet) option to suppress the unmatched text
- `-E` will use a more modern regex syntax
- `^` matches start of a line, `$` matches end of line
- More on `sed`: [howtogeek article](https://www.howtogeek.com/666395/how-to-use-the-sed-command-on-linux/)