---
title: "Unreal 實作 — Slow Motion 慢動作系統"
date: 2020-05-18
tags: ["Unreal Engine", "Blueprint", "C++"]
description: "在 Unreal Engine 中實作子彈時間（Bullet Time）慢動作效果，包含全域時間縮放與 UI 不受影響的技巧"
---

## 慢動作系統概述

**Slow Motion（慢動作）** 是許多動作遊戲的標誌性機制，從《Max Payne》的子彈時間到《控制》的超能力展示，都能看到它的身影。在 Unreal Engine 中實作這個效果，核心概念非常直觀：**縮放全域時間流速**。

## 核心機制：Global Time Dilation

Unreal 提供了 `Set Global Time Dilation` 函式，可以控制整個遊戲世界的時間流速：

- `1.0`：正常速度
- `0.3`：慢動作（30% 速度）
- `0.0`：完全暫停（類似暫停遊戲）

### Blueprint 實作

```
Input Action SlowMo (Pressed)
  → Set Global Time Dilation (0.3)

Input Action SlowMo (Released)
  → Set Global Time Dilation (1.0)
```

只需兩個節點就能實現基礎的慢動作切換。

## 進階：緩入緩出效果

直接切換 Time Dilation 會有突兀感。使用 **Timeline** 製作平滑過渡：

1. 建立 Timeline，加入 Float Track
2. 設計進入慢動作的曲線（1.0 → 0.3，約 0.2 秒，Ease In）
3. 設計恢復正常的曲線（0.3 → 1.0，約 0.5 秒，Ease Out）
4. 在 Timeline Update 中呼叫 `Set Global Time Dilation`

## UI 不受影響的關鍵

慢動作的常見問題：**UI 動畫也跟著變慢**。解決方式：

### 方法一：Widget Tick 使用 Unscaled Delta Time

在 UMG Widget 的 `Event Tick` 中，改用 `Get World Delta Seconds` 的 Unscaled 版本驅動動畫邏輯。

### 方法二：設定 Widget 的 Time Dilation

對 Widget Component 或 HUD 本身設定獨立的 Time Dilation：

```
Set Custom Time Dilation (目標: HUD Actor, 1.0 / Global Time Dilation)
```

這樣 UI 的實際速度就會是 `自訂倍率 × 全域倍率 = 1.0`，維持正常速度。

## 配合音效的處理

慢動作時音效也需要降速才有臨場感：

- 背景音樂：調低 `Pitch Multiplier`（例如 0.7）
- 打擊音效：通常不需要處理，讓引擎自動縮放即可
- 環境音：可加入低頻濾波器（Low Pass Filter）增強沉浸感

## 效能考量

大量的粒子效果（Niagara / Cascade）在慢動作下仍會正確運作，但若場景複雜，慢動作中的詳細計算量不會減少。建議：

- 對效能敏感的場景，可在慢動作觸發時暫時降低粒子密度
- 使用 `Scalability` 設定組動態切換品質

慢動作系統是個門檻低、效果驚豔的遊戲機制，非常適合作為 Unreal 學習的進階練習。
