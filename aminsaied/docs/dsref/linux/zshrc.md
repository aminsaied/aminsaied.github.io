---
title: ZSH
---

More details on a few parts of my zshrc.

## Automatically open jupyter notebook server from wsl

Here is the function in full.

```bash
alias jn="~/.local/bin/jupyter-notebook --no-browser"
serve-jn () {
    is_running=$(tmux ls | grep jn-session | wc -l)
    if [ $is_running -gt 0 ]; then
        echo "Existing jn-session is running. Please end that first."
        echo "Run tmux kill-session -t jn-session"
    else
        tmux new -s jn-session -d
        tmux send-keys -t jn-session "mkdir -p /tmp/jn-server && jn 2> /tmp/jn-server/stderr.txt " ENTER
        addr=$(cat /tmp/jn-server/stderr.txt | grep http | tail -n1 | sed -E 's/^.*http/http/')
        wslview $addr
    fi
}
```

Let's break it down.

High-level idea: 

The alias `jn` starts up a jupyter notebook server with the `--no-browser` switch. This starts a server on a localhost as follows.

```
[I 22:51:18.969 NotebookApp] Serving notebooks from local directory: /home/amin/repos/dsref
[I 22:51:18.969 NotebookApp] The Jupyter Notebook is running at:
[I 22:51:18.970 NotebookApp] http://localhost:8888/?token=9485befbf3da50690a45b1f83dbefa97548be18444a19c0f
[I 22:51:18.970 NotebookApp]  or http://127.0.0.1:8888/?token=9485befbf3da50690a45b1f83dbefa97548be18444a19c0f
[I 22:51:18.970 NotebookApp] Use Control-C to stop this server and shut down all kernels (twice to skip confirmation).
[C 22:51:18.973 NotebookApp]

    To access the notebook, open this file in a browser:
        file:///home/amin/.local/share/jupyter/runtime/nbserver-7728-open.html
    Or copy and paste one of these URLs:
        http://localhost:8888/?token=9485befbf3da50690a45b1f83dbefa97548be18444a19c0f
     or http://127.0.0.1:8888/?token=9485befbf3da50690a45b1f83dbefa97548be18444a19c0f
```

Idea is as follows:

- Use tmux to run the `jn` command in a detached session
- Use `grep` + `sed` to extract the url with token from the standard error
- Use `wslview` to open this in default windows browser

The function is mostly self-explanatory, with the exception of two lines:

```bash
tmux send-keys -t jn-session "mkdir -p /tmp/jn-server && jn 2> /tmp/jn-server/stderr.txt " ENTER
```

This sends a command to the detached tmux session `jn-server`. The command will make a directory that will be used to write standard error from the jn command. The `jn` command is called, and `2>` will send its standard error to the file `/tmp/jn-server/stderr.txt`. Finally, the send-keys requires to send the `ENTER` instruction to submit the command!

```bash
addr=$(cat /tmp/jn-server/stderr.txt | grep http | tail -n1 | sed -E 's/^.*http/http/')
```

This command `cat`s the standard error to `grep` which checks for any lines containing http. `tail -n1` takes the last such line, and the sed is used to clear all text preceeding the address. Combining this we get

```bash
echo $addr
http://127.0.0.1:8888/?token=9485befbf3da50690a45b1f83dbefa97548be18444a19c0f
```

from the example above. This can be passed to `wslview` to open in windows.