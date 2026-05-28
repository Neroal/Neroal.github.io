---
title: "Unreal 實作 — 球體移動 (Ball Moving)"
date: 2020-03-19
tags: ["Unreal Engine", "Blueprint", "C++"]
description: "在 Unreal Engine 中實作可受玩家控制的球體移動，包含輸入綁定與物理力的施加"
---

## 球體移動系統概述

在 Unreal Engine 中讓球體受玩家控制移動，需要結合**輸入系統**與**物理引擎**。球體不像角色那樣有內建的移動元件（Character Movement Component），而是透過對 Sphere 施加物理力（AddForce / AddImpulse）來實現運動感。

## 基礎設定

### 建立 Blueprint Class

1. 以 **Pawn** 為父類建立新的 Blueprint（例如 `BP_Ball`）
2. 新增 `Static Mesh Component`，並將 Mesh 設定為 Sphere
3. 在 Static Mesh 的 Physics 設定中勾選 **Simulate Physics**
4. 設定 `Auto Possess Player` 為 `Player 0`，讓玩家自動控制此 Pawn

### 輸入綁定

在 **Project Settings → Input** 中建立 Axis Mapping：

- `MoveForward`：W（Scale: 1.0）、S（Scale: -1.0）
- `MoveRight`：D（Scale: 1.0）、A（Scale: -1.0）

## Blueprint 邏輯

### 移動實作

在 BP_Ball 的 Event Graph 中：

1. 使用 `InputAxis MoveForward` 與 `InputAxis MoveRight` 事件節點接收輸入
2. 取得當前相機的前向量（Forward Vector）與右向量（Right Vector）
3. 將向量乘以輸入值再乘以 Force 係數（例如 500.0）
4. 呼叫 `Add Force` 節點，目標為 Sphere Mesh Component

### 關鍵注意點

- `Add Force` 施加持續力，`Add Impulse` 施加瞬間衝力，兩者效果不同
- 過大的力係數會讓球彈飛，需要在 Physics Material 中調整摩擦力（Friction）與回彈（Restitution）
- 若球體滾動太慢，可降低 **Linear Damping** 與 **Angular Damping** 的數值

## 相機跟隨

為了讓玩家能清楚看到球的移動，通常會加入 `Spring Arm Component` 搭配 `Camera Component`：

1. 加入 `Spring Arm`，設定適當的仰角（如 -45°）與臂長（如 800）
2. 在 Spring Arm 上附加 `Camera`
3. 勾選 `Use Pawn Control Rotation` 讓相機隨著玩家旋轉

透過這個系統，就能實現流暢且具物理感的球體移動體驗。
