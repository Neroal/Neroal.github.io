---
title: "Unreal 實作 — Trigger Box 與陣列實作"
date: 2020-03-18
tags: ["Unreal Engine", "Blueprint", "C++"]
description: "在 Unreal Engine 中使用 Trigger Box 偵測玩家進入區域，並搭配陣列儲存與管理觸發事件"
---

## Trigger Box 觸發機制

在 Unreal Engine 的遊戲開發中，**Trigger Box** 是最常用的碰撞觸發工具之一。它允許開發者定義一個不可見的體積範圍，當 Actor（如玩家角色）進入或離開該範圍時，就會觸發對應的事件。

### 核心概念

Trigger Box 本質上是一個繼承自 `ATriggerBase` 的 Actor，內建了 `Box Collision` 組件。透過 Blueprint 或 C++，我們可以綁定以下兩個主要事件：

- **OnActorBeginOverlap**：當 Actor 進入 Trigger Box 時觸發
- **OnActorEndOverlap**：當 Actor 離開 Trigger Box 時觸發

### Blueprint 實作流程

1. 在場景中放置一個 **Trigger Box** Actor
2. 開啟其 Blueprint 事件圖，新增 `On Actor Begin Overlap` 節點
3. 透過 `Cast To` 節點確認進入的是玩家角色
4. 執行對應的遊戲邏輯（播放動畫、開門、切換關卡等）

## 陣列（Array）的應用

在觸發機制中，陣列非常適合用來管理多個觸發目標或記錄已觸發的事件序列。

### 常見使用場景

- **多目標管理**：將場景中所有需要被啟動的 Actor 收集到陣列，統一在觸發事件中遍歷處理
- **觸發順序控制**：透過陣列索引追蹤當前應觸發的下一個事件，實現線性的觸發鏈
- **已觸發記錄**：使用 Boolean 陣列記錄哪些 Trigger 已被玩家觸發，避免重複執行

### Blueprint 陣列操作重點

- `Add`：向陣列末端新增元素
- `Get (a ref)`：透過索引取得元素的引用
- `Length`：取得陣列長度，常用於迴圈邊界
- `For Each Loop`：遍歷陣列中每個元素

透過結合 Trigger Box 與陣列，可以實現複雜的關卡觸發系統，例如按序點亮多個發光石碑、依序開啟連鎖門等機關設計。
