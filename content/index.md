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

## 🔗 リンク・コンテンツ一覧

* 🏛️ **[いるまオープン議会](https://open-iruma-app.vercel.app/)**
  入間市の議会情報を検索・閲覧できるWebアプリです。過去の一般質問や答弁を可視化しています。
  * 📝 関連ノート一覧： [[open_iruma]]
* 📊 **[市議会議員通信簿](https://open-iruma-app.vercel.app/report-cards)**
  各市議会議員の活動実績、質問回数、賛否態度などを定量的に評価・可視化したページです。
* 💰 **[予算・財務の記録](https://open-iruma-app.vercel.app/budget)**
  入間市の予算使途や財務状況を分析し、分かりやすく図解・解説しています。
* 📝 **[Note](https://note.com/iruma_)**
  調査結果や見解をまとめた長文記事・コラムを配信している公式ブログです。
  * 📝 関連ノート一覧： [[note]]
* 💬 **[LINEオープンチャット](https://line.me/ti/g2/XlbGmBC-j_x04U9-ftylZa9Slox2KN1fZjp8KA?utm_source=invitation&utm_medium=link_c)**
  市政に関心のある市民が集まり、意見交換や情報共有を行う匿名のコミュニティです。ぜひご参加ください！

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


