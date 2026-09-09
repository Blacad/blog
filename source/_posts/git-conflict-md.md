---
title: git-conflict.md
date: 2026-09-10 01:11:34
categories:
 - 实践技术
tags:
 - git
---

## git 冲突解决

介绍 `git rebase` 和 `git merge` 的处理冲突的区别，以及如何解决冲突。

<!-- more -->

对于 `rebase`：

```bash
git fetch origin
git rebase origin/main
```

如果有冲突：

```bash
# 手动修改冲突文件
git add .
git rebase --continue
```

如果后续还有冲突，就重复：

```bash
修改冲突
git add .
git rebase --continue
```

直到 rebase 完成。

这里通常**不需要再手动 `git commit`**，因为 `git rebase --continue` 会继续重建原来的提交。

最后：

```bash
git push origin main
```

最终历史类似：

```text
A → B → C'
```

---

对于 `merge`：

```bash
git fetch origin
git merge origin/main
```

如果有冲突：

```bash
# 手动修改冲突
git add .
git commit
```

然后：

```bash
git push origin main
```

最终历史类似：

```text
      B
     / \
A ──    M
     \ /
      C
```

所以最准确地记：

```text
rebase 冲突解决后：
git add .
git rebase --continue
不额外手动 commit

merge 冲突解决后：
git add .
git commit
```
