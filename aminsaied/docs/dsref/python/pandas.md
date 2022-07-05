---
title: Pandas
description: Pandas tips and tricks.
---

## Filter dataframe with multiple conditions
```python
df = <some-dataframe>

df_with_conditions = df[(<condition1>) & (<condition2>)]
```
For example
```python
df_example = df[(df.col1 == "hello") & (df.col2 == "world")]
```