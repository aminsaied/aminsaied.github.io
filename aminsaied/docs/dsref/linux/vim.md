---
title: Vim
---

## Getting started with Vim

**Vimtutor.**  
Run `vimtutor` from your Ubuntu shell in WSL. This excellent tutorial walks you through a series of DIY-style examples getting you to grips with the basic commands and motions used in Vim. Takes about 30 minutes.

**.vimrc**  
Set up your vimrc properly. The out-of-the-box Vim setup is likely sub-optimal. Set up syntax highlighting, tabs as spaces, live search, line numbers etc.

## Useful commands

### Search and replace

|Command|Description|
|-|-|
|`:#,#s/old/new/g`|where #,# are the line numbers of the range of lines where the substitution is to be done.
|`:%s/old/new/g`|to change every occurrence in the whole file.
|`:%s/old/new/gc`|to find every occurrence in the whole file, with a prompt whether to substitute or not.
