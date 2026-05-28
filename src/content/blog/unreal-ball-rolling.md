---
title: "Unreal 實作 — 球體滾動 (Ball Rolling)"
date: 2020-03-20
tags: ["Unreal Engine", "Blueprint", "C++"]
description: "深入實作球體的物理滾動效果，包含角速度控制、斜面反應與滾動音效整合"
---

## 滾動與移動的差異

上一篇介紹了球體移動，而**滾動（Rolling）**則更進一步，需要讓球的**旋轉動畫**與移動方向同步，並且在不同地形（平地、斜坡、障礙物）上有合理的物理反應。

## 物理材質設定

要讓球滾得真實，物理材質（Physics Material）的參數調整至關重要：

- **Friction（摩擦力）**：建議設定 0.7 左右，過低球會打滑無法滾動，過高移動阻力太大
- **Restitution（彈性）**：設定 0.3 左右，讓球碰到硬地有輕微彈跳感
- **Density（密度）**：影響球的質量，進而影響力的反應

在 Sphere 的 Static Mesh → Physics Material 欄位套用自訂的 Physics Material。

## 角速度控制

純粹的 `Add Force` 只會讓球滑動，不會產生滾動視覺效果。要讓球**真實地滾動**，需要：

1. 計算移動方向的切向量
2. 使用 `Add Torque in Radians` 施加對應的旋轉力矩
3. 確保 `Angular Damping` 不要設太高（建議 0.0 至 0.5），讓球能持續旋轉

### Blueprint 節點流程

```
InputAxis → Get Forward/Right Vector → Cross Product → Normalize
→ Multiply (Torque Scale) → Add Torque in Radians (Sphere Mesh)
```

## 斜面物理反應

Unreal 的物理引擎會自動處理斜面上的重力分量，球在斜坡上會自然加速。若需要限制最大速度：

1. 在 `Event Tick` 中取得 `Get Physics Linear Velocity`
2. 若速度長度超過閾值，使用 `Set Physics Linear Velocity` 限制到最大速度

## 滾動音效整合

讓滾動更有臨場感，可以整合音效：

1. 準備滾動音效的 Sound Wave（循環版本）
2. 在 `Begin Play` 時用 `Spawn Sound Attached` 播放並取得 Audio Component
3. 在 `Event Tick` 中根據球的速度大小動態調整 `Volume Multiplier`：
   - 靜止時：Volume = 0
   - 慢速滾動：Volume = 0.3
   - 快速滾動：Volume = 1.0

這樣球體滾動系統就兼顧了視覺物理感與音效沉浸感。
