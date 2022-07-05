---
title: Python on Ubuntu
---

## Python 3.8 on Ubuntu 18.04 (LTS)

Python3.8 is not available on Ubuntu's default repos. We can use deadsnakes PPA to get it.

```
$ sudo apt update
$ sudo apt install software-properties-common
```

```
$ sudo add-apt-repository ppa:deadsnakes/ppa
```

```
$ sudo apt install python3.8
```

Note: tried this on Ubuntu 16.04 and had to add

```bash
sudo apt update
```

after adding the `ppa:deadsnakes/ppa` and before calling `sudo apt install python3.8`.

**Confirm.** Check all your python versions with `ls /usr/bin/python*`. You should now see `/usr/bin/python3.8` there.

## Make default python version

You can add an alias as the last line of your .bashrc file:

```bash
nano ~/.bashrc
```

add the line

```
alias python='/usr/bin/python3.8'
```

## Miniconda on Ubuntu

```
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
chmod +x Miniconda3-latest-Linux-x86_64.sh
./Miniconda3-latest-Linux-x86_64.sh
```

Agree to the licence agreement, answer the follow up questions (where should it install, do you want to run conda init).

Test with

```
conda env list
```

