---
title: VS Code Debugger
description: Set up your Python debeugger in VS Code.
---

## Set up VS Code debugger

This covers the following common scenarios:

1. Working with a conda environment `myenv`
2. Working with environment variable `export PYTHONPATH=...`

**Note.** You can find the "launch.json" file that configures the python debugger in the "Run and Debug" menu
(`ctrl`+`shift`+d) and choose "create a launch.json file". If one already exists you directly find it with
(`ctrl`+`shift`+p) >> "launch.json"

## 1. Set conda environment

Set the interpreter e.g. `ctrl`+`shift`+p >> "Python: Select Interpreter" >> Find conda environment

The debugger will run with the selected environment.

## 2. Set pythonpath environment variable

Add the line

```json
"env": {"PYTHONPATH": "${workspaceFolder}${pathSeparator}${env:PYTHONPATH}"}
```

to the `launch.json` file:

```json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python: Current File",
            "type": "python",
            "request": "launch",
            "program": "${file}",
            "console": "integratedTerminal",
            "env": {"PYTHONPATH": "${workspaceFolder}${pathSeparator}${env:PYTHONPATH}"}
        }
    ]
}
```