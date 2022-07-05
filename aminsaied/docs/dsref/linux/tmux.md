---
title: tmux
---

## `tmux` keybinding

Change tmux keybinding prefix from Ctrl-B to Ctrl-A.

Open the tmux config file:
```bash
$ vim ~/.tmux.conf
```

and add the following

```bash
# command prefix
unbind C-b
set-option -g prefix C-a
```

## Basic commands

```bash
# create new session
tmux

# create named session
tmux new -s <name>

# create detached session
tmux new -s <name> -d

# detach from session
<ctrl+a d>

# list sessions
tmux ls

# attach to session
tmux attach
# or
tmux a

# attach to named session
tmux a -t <name>

# kill named session
tmux kill-session -t <name>

# kill active session
<ctrl+a x y>

# kill tmux server (and all its sessions)
tmux kill-server
```

## Advanced

### `.bashrc` to open in tmux session by default

It might be useful to "auto start" tmux session, e.g. on remote server that you are SSHing into.

Add the following to your `.bashrc` **on the remote machine**:

```bash
if [ -z "$TMUX" ]; then
    tmux attach -t default || tmux new -s default
fi
```

:::tip "Explanation"
- `-z string` is True if the string is null. Since `$TMUX` is null iff we are not in a tmux session, this is equivalent to `if not in tmux session`
- `tmux attach -t default` will attempt to attach to a session named `default`
- if there is no such session it will fail, and `||` means we pass to the second command
- `tmux new -s default` will create a new tmux session named `default`
:::