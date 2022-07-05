---
title: Windows Subsystem for Linux (WSL)
---

Notes for setting up WSL.

## WSL 2

Make sure you're running WSL 2. Open a powershell and run

```powershell
$ amsaied> wsl -l -v
  NAME                   STATE           VERSION
* Ubuntu                 Running         1
```

To upgrade `Ubuntu` to WSL 2 run

```powershell
$ wsl --set-version Ubuntu 2
```

You can confirm it by running `wsl -l -v` again. To make WSL 2 your default architecture run

```powershell
wsl --set-default-version 2
```

## Git integration

Use the _Git Credential Manager_ to handle authentication - even if you have 2FA, Azure Active Directory or SSH requirements. Just run the following command and you're good to go.

```bash
$ git config --global credential.helper "/mnt/c/Program\ Files/Git/mingw64/libexec/git-core/git-credential-manager.exe"
```

## Oh-My-ZSH

```bash
$ apt install zsh
$ sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

## Get Python
```bash
$ sudo apt update && sudo apt upgrade
$ sudo apt install python3 python3-pip ipython
```

## Get miniconda

```bash
wget https://repo.continuum.io/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda.sh
bash ~/miniconda.sh -b -p ~/miniconda 
rm ~/miniconda.sh
```

Add miniconda to your path in the `.zshrc` by adding

```bash
export PATH=~/miniconda/bin:$PATH
```

## SSH into WSL

My set up involves two machines (work and laptop). I occasionally (often!) find myself working on one, but needing some changes I made on the other. A useful solution is to SSH into the other machine and push the changes. Here's how to set that up with WSL.

**Step 1 - Edit the SSH Daemon**  

Reinstall OpenSSH:

```bash
sudo dpkg-reconfigure openssh-server
```

Edit the ssh deamon config:

```bash
sudo nano /etc/ssh/sshd_config
```

and make the following changes:

- Set `Port 2222` (or at least, change it from port 22).
- `PasswordAuthentication yes`

(The corresponding lines may already exist and need editing, or may be commented out.)

**Step 2 - Open port in Windows Firewall**  

_Following [this guide](https://jeetblogs.org/post/sshing-into-a-windows-wsl-linux-subsystem/)_.  

Open up port 2222 (or whatever port you set in the ssh daemon config) in the Windows firewall:

- Press Windows Key > Search WF.msc > Inbound Rules > Add New Rule
- New Rule > Port > TCP > Specific local ports: 2222 > Allow connections > When does the rule apply?: Check all boxes

![windows-firewall](/img/dsref/windows-firewall.png)

**Step 3 - Restart the SSH Server**  

```bash
sudo service ssh --full-restart
```

**Note.** If you meet the error
```bash
sshd: no hostkeys available -- exiting.
```

you need to generate ssh keypair in `\etc\ssh`:

```bash
cd /etc/ssh
ssh-keygen -A
```

(Now I attempted to run `sudo service ssh --full-restart`. It did not complete succesfully, but the problem was resolved. Not sure if this partially completed step was needed...)

**Step 4 - Get your IP address**  

Run

```bash
ip address show
```

Look for the `eth0` section in the output and find the IP address. Something like this

``` hl_lines="4"
...
4: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
    link/ether 00:15:5d:23:ee:e3 brd ff:ff:ff:ff:ff:ff
    inet 172.22.23.249/20 brd 172.22.31.255 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 fe80::215:5dff:fe23:eee3/64 scope link
       valid_lft forever preferred_lft forever
...
```