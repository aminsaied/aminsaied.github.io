---
title: CUDA
description: |
  Understanding available CUDA versions on your VM with `nvidia-smi`
  and `nvcc`. 
---

## Understanding CUDA versions

Useful commands:

- `nvidia-smi`: Shows the CUDA version that the driver supports
- `nvcc --version`: Shows the CUDA toolkit version

It's okay if the two CUDA versions are different. You should have `nvidia-smi` version >= `nvcc` version. See below for more
details.

### Example

Running the above commands on an Azure VM gave this output

```
$ nvcc --version
nvcc: NVIDIA (R) Cuda compiler driver
Copyright (c) 2005-2019 NVIDIA Corporation
Built on Sun_Jul_28_19:07:16_PDT_2019
Cuda compilation tools, release 10.1, V10.1.243

$ nvidia-smi
Sun Jun 27 03:16:55 2021
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 465.19.01    Driver Version: 465.19.01    CUDA Version: 11.3     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  NVIDIA Tesla K80    On   | 00000001:00:00.0 Off |                    0 |
| N/A   41C    P8    33W / 149W |      0MiB / 11441MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+

+-----------------------------------------------------------------------------+
| Processes:                                                                  |
|  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
|        ID   ID                                                   Usage      |
|=============================================================================|
|  No running processes found                                                 |
+-----------------------------------------------------------------------------+
```

There is a very detailed answer in [1]. Here's a snippet:

Note the CUDA versions listed here are different! That's because `nvidia-smi` shows you the CUDA version that
your driver supports. The version the driver supports has nothing to do with the version you compile and link
your program against. A driver that supports CUDA 10.0 will also be able to run an application that was built
for CUDA 9.2

[1] https://stackoverflow.com/questions/53422407/different-cuda-versions-shown-by-nvcc-and-nvidia-smi
