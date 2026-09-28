---
title: "思考と調査のワークベンチ（入間市市政可視化）"
description: "入間市市政の可視化プロジェクトにおける思考プロセス、調査中のタスク、および仮説をまとめたトップページ"
draft: false
date: 2026-09-25
cssclasses: cards
tags: [Dashboard]
---
# 入間市政_可視化の中身

このページは、現在進行形で検証中の市政情報や、私自身の「頭の中の仮説・疑問」を可視化している作業用ノートです。完成されたレポートではなく、調査の過程をそのまま公開しています。

---

## 🔗 リンク
* [いるまオープン議会](https://open-iruma-app.vercel.app/)
  * 各記事の一覧： [[open_iruma]]
* [市議会議員通信簿](https://open-iruma-app.vercel.app/report-cards)
* [予算・財務の記録](https://open-iruma-app.vercel.app/budget)
* [Notek](https://note.com/iruma_)
  * 各記事の一覧： [[note]]

[[各ツールの役割と運用目的（いるまオープン議会等）]]
[[_00_System/今後の運用改善タスク|プロジェクトの運用改善タスク]] （運用備忘録）

---

## 👑 現在進行中のプロジェクト
現在進行形で分析を進めている最中の検証プロジェクト群です。各プロジェクトの詳細はリンク先で確認できます。

<!-- DATAVIEW_PROJECT_START -->
```dataview
TABLE without id file.link AS "プロジェクト", description AS "概要"
FROM "10_Notes"
WHERE type = "project" AND status = "調査中" AND draft != true
SORT file.mtime DESC
```

<!-- DATAVIEW_PROJECT_END -->

---

## 📂 検証完了レポート（アーカイブ）
（※過去に調査が完了し、体系的にまとまったデータはこちらに格納しています）
<!-- DATAVIEW_ARCHIVE_START -->
```dataview
TABLE description AS "概要", date AS "完了日"
FROM "10_Notes"
WHERE status = "完了" AND draft != true
SORT date DESC
```
<!-- DATAVIEW_ARCHIVE_END -->

---

##### 今後着手予定リスト
- [ ] 財政乖離の現状
- [ ] いるまオープン議会のフォーマット化

---


