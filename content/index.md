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

```dataview
TABLE without id file.link AS "プロジェクト", description AS "概要"
FROM "10_Notes"
WHERE type = "project" AND contains(tags, "進捗/2_調査中") AND draft != true
SORT file.mtime DESC
```

---

> [!info]- 📥 アイデア・未着手タスクのストック（クリックで展開）
> まだ調査を開始していない「頭の中の疑問」やプレースホルダーです。着手する際に `#進捗/2_調査中` にタグを変更すると、上のアクティブリストに移動します。
> ```dataview
> TABLE description AS "概要", date AS "追加日"
> FROM "10_Notes"
> WHERE (contains(tags, "進捗/1_未着手") OR status = "inbox" OR status = "未着手" OR contains(tags, "status/inbox")) AND draft != true
> SORT date DESC
> ```

---

## 📂 検証完了レポート（アーカイブ）
（※過去に調査が完了し、体系的にまとまったデータはこちらに格納しています）
```dataview
TABLE description AS "概要", date AS "完了日"
FROM "10_Notes"
WHERE (contains(tags, "進捗/3_完了") OR status = "evergreen" OR status = "完了" OR contains(tags, "status/evergreen")) AND draft != true
SORT date DESC
```

---

## 📊 テーマ別ビュー（検証領域別）
（MOCの軽量代替：タグによる自動収集）

> [!tip]- 💰 テーマ別：財政・予算（クリックで展開）
> ```dataview
> TABLE description AS "概要", date AS "更新日"
> FROM "10_Notes"
> WHERE contains(tags, "テーマ/財政・予算") AND draft != true
> SORT file.mtime DESC
> ```

> [!tip]- 🏛️ テーマ別：ガバナンス・組織（クリックで展開）
> ```dataview
> TABLE description AS "概要", date AS "更新日"
> FROM "10_Notes"
> WHERE contains(tags, "テーマ/ガバナンス・組織") AND draft != true
> SORT file.mtime DESC
> ```

> [!tip]- 📢 テーマ別：広報・シティプロモ（クリックで展開）
> ```dataview
> TABLE description AS "概要", date AS "更新日"
> FROM "10_Notes"
> WHERE contains(tags, "テーマ/広報・シティプロモ") AND draft != true
> SORT file.mtime DESC
> ```

> [!tip]- 🔒 テーマ別：セキュリティ（クリックで展開）
> ```dataview
> TABLE description AS "概要", date AS "更新日"
> FROM "10_Notes"
> WHERE contains(tags, "テーマ/セキュリティ") AND draft != true
> SORT file.mtime DESC
> ```

