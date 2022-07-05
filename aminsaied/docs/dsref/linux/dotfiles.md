---
title: Dotfiles
---

Clone [dotfiles](https://github.com/aminsaied/dotfiles) into `~`
```bash
$ cd ~
$ git clone git@github.com:aminsaied/dotfiles.git
```
Delete all the dotfiles in `~`, e.g.,
```bash
$ rm ~/.bashrc
```
or move them into dotfiles if you don't have it already
```bash
$ mv ~/.bashrc ~/dotfiles/.bashrc
```
Symlink from the dotfiles to `~`
```bash
$ ln -nfs /home/amin/dotfiles/.bashrc /home/amin/.bashrc
```

These steps are automated in the dotfiles repo's [`bootstrap.sh`](https://github.com/aminsaied/dotfiles/blob/master/bootstrap.sh) script. Note, I do not recommend blindly running this script. It is very simple, so please read it and see what it is doing.

## References
I learned this trick from this youtube video: [MIT Missing Semester](https://www.youtube.com/watch?v=e8BO_dYxk5c&t=2362s).  
Here's a [related blog](https://opensource.com/article/19/3/move-your-dotfiles-version-control).