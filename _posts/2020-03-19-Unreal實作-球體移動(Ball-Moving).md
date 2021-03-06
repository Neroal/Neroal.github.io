控制角色是大部分遊戲必要元素之一，而網路上大部分的教學不是英文就是簡體，於是這篇教學就此誕生。角色控制其實沒有你想的這麼困難，本篇教學將會讓你學會如何控制角色的移動以及跳躍

### 成果畫面

<div class="video-container">
<iframe width="560" height="315" src="https://www.youtube.com/embed/iGgeDAb_lY0" frameborder="0" 
	allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>


### 角色建立
因為我們要建立**可控制**的物件，就不能使用像是Actor這種最基本的Blueprint。當然Unreal也幫你寫好了可以被控制的Blueprint，叫做**Character**

<b>新增</b>

創建方法:**Content Browser** -> **Blueprint Class** -> **Character**

![](https://i.imgur.com/UupMgZl.png)


<b>球體與相機</b>
- 新增的元件
    + Sphere
    + Camera
    
![](https://i.imgur.com/xkanZMg.png)

相機的位置設定，讀者也可去做調整
![](https://i.imgur.com/gUAcD8D.png)

Viewport
![](https://i.imgur.com/7jcfUkh.png)



### 創建Gamemode
如果要使用Unreal原本內建寫好的移動，那直接套用官方範本的Gamemode就好，但是我們今天練習寫自訂義的控制規則，所以要創建一個新的Gamemode

<b>新增</b>

創建方法:**Content Browser** -> **Blueprint Class** -> **Game mode Base**

![](https://i.imgur.com/FjxxrC8.png)

<b>設定</b>

創建完後要去World Setting中找到Gamemode，把**GameMode Override**設定成你創建的GameMode。接著下方有個**Default Pawn Class**設定為你創建的角色

![](https://i.imgur.com/ZulQFXK.png)

如果遊戲要匯出給大家玩的話，同樣在Project Setting也要設定

開啟方式:**Edit** -> **Project Setting** -> **Map&Modes**

![](https://i.imgur.com/hNpshpN.png)

![](https://i.imgur.com/Or1JMaL.png)

### 移動、跳躍設定
Unreal中可以設定特殊鍵來去觸發事件，你可以在Project Setting -> Input -> Bindings去做設定

<b>設定方式</b>
你會看到有Action跟Axis兩種輸入方式，差異在於Action是一次性的事件，而Axis是持續型的事件。Axis額外有Scale這個參數可以去設定，介於1~-1。舉個例子，如果往前設定為1，則-1會變成相反方向

<b>按鍵設定</b>
- Action Mappings
    + 事件:jump
        -  按鍵:空白鍵
- Axis Mappings
    + 事件:Foward/Back
        - 按鍵:W (往前)
        - 按鍵:S (往後)
    + 事件:Right/Left
        - 按鍵:D (往右)
        - 按鍵:A (往左)

![](https://i.imgur.com/PoyQOAD.png)

### 移動腳本
接著要開始讓角色動起來，我們可以在角色的Blueprint中去創建剛剛建立的事件

<b>新增移動事件</b><br>
搜尋你定義的事件名稱就可以找到

![](https://i.imgur.com/evIKNal.png)

<b>完整程式</b>

![](https://i.imgur.com/Bw8080B.png)

看上去非常的簡單，當然我也會在下方說明每個節點的功能

- InpurAxis Foward/Back:當遊戲開始時，它會像是一個loop重複執行。按下該事件之輸入鍵時，會輸出事先設定好的Axis Value給相連的節點，而在未按下時，則會輸出0。這個事件控置前後方向

![](https://i.imgur.com/00LJ6Pe.png)

- InputAxis Right/Left:當遊戲開始時，它會像是一個loop重複執行。按下該事件之輸入鍵時，會輸出事先設定好的Axis Value給相連的節點，而在未按下時，則會輸出0。這個事件控置左右方向

![](https://i.imgur.com/47EGlN8.png)

- Foward:為一個向量變數(1,0,0)

![](https://i.imgur.com/Z7AmqWj.png)

- Right:為一個向量變數(0,1,0)

![](https://i.imgur.com/D4CR3k5.png)

- Add Movement Input:Unreal中對角色進行移動控制的節點，**Target**預設為目標本身，**World Direction**為移動之方向向量，**Scale Value**則是移動量大小

![](https://i.imgur.com/DvBeV4t.png)

### 跳躍程式
Unreal有內建跳躍的方法給我們使用，叫做Jump和Stop Jumping。我們可以將Action事件的兩個輸出節點個別連到Jump和Stop Jumping即可實現跳躍效果

<b>完整程式</b>

![](https://i.imgur.com/mQkCRDY.png)

<div style="background-color:#FFEE99;">
<b><font color="black"> TIPS</font></b>
<br>
<font color="black">如果執行遊戲時角色沒有反應，請至<b>Character Blueprint(角色) -> 點選Components(self) -> Detail -> Pawn -> Auto Possess Player設定為Player 0</b><br><br> </font>

</div>
![](https://i.imgur.com/4PPkWzp.png)

![](https://i.imgur.com/ynHleQd.png)

實作完成!!!

---