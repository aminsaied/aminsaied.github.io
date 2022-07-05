---
title: SSH
---

## SSH Setup

Goal: Set up an ssh connection from `A` to `B`.

On machine `B` (the receiving maching)
```bash
# get ip addr
$ ip -4 addr
```

```bash
# (optional) start ssh server
$ sudo systemctl start sshd.service
```

Move to machine `A`.  

With the username, ip address (and the login password on the receiving machine) we can ssh into it.
```bash
# test ssh connection
$ ssh <username>@<ip-addr>
```
and enter the login password.  

Now set up ssh keys to make authentication password free and secure.
```bash
# setup key authentication
$ ssh-keygen -t rsa
$ ssh-copy-id -i ~/.ssh/id_rsa.pub <username>@<ip-addr>

# setup ssh config
$ nano ~/.ssh/config
```
and add the following:
```bash
Host <host>
HostName <ip-addr>
User <username>
```

Enjoy safe, easy ssh-ing, e.g.
```bash
$ ssh amin@fractal
```
If you get an error `ssh returns “Bad owner or permissions on ~/.ssh/config”` it means you don't have the right permissions set on `~/.ssh/config`. Do
```bash
$ chmod 600 ~/.ssh/config
```