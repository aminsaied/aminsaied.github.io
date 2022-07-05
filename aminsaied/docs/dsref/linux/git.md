---
title: Git
---

### See upstream branch names

```bash
git branch -vv
```
output:
```
u/amsaied/async          945c1951 [origin/u/amsaied/async: ahead 2] merge master
u/amsaied/async-args     9ee24a21 [origin/u/amsaied/async-args] rename class to AsyncConfig
...
```

The upstream name is in `[` `]`, i.e.: `[<upstream-branch-name>]`

### Merge with remote branch

To merge directly with an upstream branch without having to pull it locally, first
find the name of the upstream (e.g. `git branch -vv`) and then run

```bash
git merge <upstream-branch>
```

For example:

```bash
git checkout branch1
git branch -vv
# branch1   945c1951    [origin/branch1] commit messages rock
# branch2   9ee24a21    [origin/branch2: ahead 1] made an important change
git merge origin/branch2
# this will merge origin/branch2's important change into (local) branch1
```

### Migrate repo keeping commit history

```bash
# (mirrored) clone
git clone --mirror old-repo-url new-repo

# remove old remote
cd new-repo
git remote remove origin

# add new remote
git remote add origin new-repo-url

# push
git push --all
git push --tags

# clone new repo
cd ..
rm -rf new-repo
git clone new-repo-url new-repo
```