---
draft: true
---
# 📊 管理ダッシュボード

このノートは運用管理用です。DataviewやTasksプラグインを使用して、現在の進行状況を一覧表示します。
（※QuartzでWeb公開する際、このノートは `draft: true` により非公開となります。）

## 📥 Inbox (未分類)
```dataview
LIST FROM "_inbox"
```

## 📝 調査予定
```dataview
TABLE file.ctime as "作成日時"
FROM "_調査予定"
SORT file.ctime DESC
```

## 🔍 調査中
```dataview
TABLE file.mtime as "最終更新"
FROM "_調査中"
SORT file.mtime DESC
```

## ✅ 検証完了 (公開待ち)
```dataview
TABLE file.mtime as "最終更新"
FROM "_検証完了"
SORT file.mtime DESC
```

## 📋 進行中のタスク
```tasks
not done
short mode
```
