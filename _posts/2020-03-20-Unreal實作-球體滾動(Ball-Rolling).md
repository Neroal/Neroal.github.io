上一篇我們學習到如何去控制球體，但是不會滾動的球感覺就少了些真實感。於是今天的教學日誌就此誕生

## 成果畫面

<iframe width="560" height="315" src="https://www.youtube.com/embed/he8wEyJ0JHw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 概念
說到轉動，大家要先知道一個觀念，**移動速度**跟**角速度(轉動速度)** 是不相同的。我們看wiki給的定義

『<span style="color:red">連接運動質點和圓心的半徑在單位時間內轉過的弧度叫做**角速度**</span>』

看到這邊相信大家都傻眼了，我是來這邊做遊戲誰要聽你講物理。但其實這東西不講不行，因為之後實做出來時，如果你不懂這個觀念，你會完全看不懂程式碼為甚麼要這樣寫。接下來我會透過圖片來讓大家更容易地去了解角速度的概念

![](https://i.imgur.com/3cy7msq.png)


ω是**角速度**，代表的是**單位時間**內所轉動的**角位移Δθ**。這邊大家不用擔心需要推導公式，經過我的掐指一算，最後可以得出一個公式:

『<span style="color:red">ω角速度 = v速度/R半徑</span>』

煩人的階段到這裡就結束了，接著進入到Unreal的部分

## 座標系統
我們可以把座標系想像成是一架飛機，因為Unreal使用**左手座標系**，所以<b>Roll(滾動角)</b>對應到x軸，<b>Pitch(俯仰角)</b>對應到y軸，而<b>Yaw(偏航角)</b>對應到z軸

![](https://static.packt-cdn.com/products/9781784394905/graphics/3743_01_32.jpg)

## 轉動程式
程式的部分會分成速度偵測與轉動更新兩個部分來說明:


### 速度偵測
這個部分主要是偵測角色在移動過程中的速度向量，因為物體滾動只透過x軸(roll)與y軸(pitch)，所以這邊將x與y的向量輸出轉變成速度後在透過比較器傳遞結過值給轉動更新的節點

![](https://i.imgur.com/3BOIczO.png)

<b>節點說明</b><br>
- Event Tick:會在遊戲每個幀上被調用，因為滾動是一個持續的動作，所以這邊我們會使用到它

![](https://i.imgur.com/xHGCRVG.png)

- Get Velocity:取得物件的速度，這邊我們只將x與y軸的值取出來，因為滾動時並不會使用到z軸的部分(因為z向量是<b>跳躍</b>的部分)

![](https://i.imgur.com/HyTKMDP.png)

- Make Vector:輸入x,y,z製作成向量，這邊我們將剛剛的Get Velocity輸出的節點連至這裡製作成一個新的速度向量(不包含z軸)

![](https://i.imgur.com/TJszQiI.png)

- SET Horizontal Velocity(設定變數):可在Variable部分新增vector(向量)，並把上一步驟make Vector的結果輸出至這裡

![](https://i.imgur.com/4V4xcER.png)

- VectorLength:算出向量的長度，也就是速度，我們可以將剛剛的Horizontal Velocity變數輸入至VectorLength，就可以算出角色的移動速度

![](https://i.imgur.com/KA7pzhO.png)

- SET Horizontal Speed(設定變數):可以在Variable部分新增float(浮點數)，用來存VectorLength輸出的角色移動速度

![](https://i.imgur.com/jevssUI.png)

- CompareFloat:可以傳入一個數值與參考值做比較後從符合條件的輸出點輸出結果，這邊我們將Horizontal Speed輸入至Input，並將參考值設為0。因為我們希望角色移動時才開始滾動，而靜止時不做任何動作

![](https://i.imgur.com/KG70brn.png)

![](https://i.imgur.com/Or1JMaL.png)

### 轉動更新
接著要開始處理轉動的部分，其實也就是把先前所提及的公式拿出來使用，並在轉動期間持續的增加轉動量。接著將結果傳遞到**SetWorldRotation**去改變角色的rotation。說難不難，說簡單也不簡單。初學者在公式轉換到Blueprint時會不知道該使用哪些節點，俗話說:「熟能生巧」，只要持續的練習就沒問題了!

![](https://i.imgur.com/4vQaUI8.png)

<b>節點說明</b><br>

- Rotation Amount:可在Variable部分新增float，這邊當作角色的轉動量

![](https://i.imgur.com/e077dH1.png)

- Ratio:可在Variable部分新增float，可自行調整，介於0.5~1之間，用來微調轉速

![](https://i.imgur.com/VPIYfl6.png)

- Get Scaled Capsule Radius:取得物體的半徑

![](https://i.imgur.com/rcbg0lH.png)


<div style="background-color:#FFEE99;">
<b><font color="black"> TIPS</font></b>
<br>
<font color="black">請確認角色Blueprint ->Detail -> Shape中設定的半徑與半高相同，這樣才會是一個球體<br><br> </font>

</div>
<br>

- <span style="color:red">ω角速度 = v速度/R半徑</span>:Horizontal Speed代表速度，而下方為球體的半徑，相除後就可以得到角速度(除號可於搜尋中打上<b>/</b>就可找到)

![](https://i.imgur.com/or3xWuQ.png)

- 轉速調整:有時候角色轉動時的轉速不會是你預期的結果，可在這邊將剛剛算出的角速度與Ratio相乘做微調(乘號可於搜尋中打上<b>*</b>就可找到)

![](https://i.imgur.com/DYPuUAn.png)

- 轉動量:將剛剛調整後的角速度與Rotation Amount相加(加號可於搜尋中打上<b>+</b>就可找到)，並在SET Rotation Amount的部分輸入結果值，就可以在不斷移動的同時持續地更新轉動量，實現轉動的效果

![](https://i.imgur.com/KhK5p5y.png)

- Custom Event:自訂義事件，可透過call event被呼叫

![](https://i.imgur.com/n9QVauv.png)

- Call Event:呼叫事件

![](https://i.imgur.com/nTiibAS.png)

- Normalize:將向量長度歸一化。舉個例子，(600,0,0)經過歸一化[600/600(總長度),0/600(總長度),0/600(總長度)]後會變成(1,0,0)。將角色的速度輸入後產生轉動軸

![](https://i.imgur.com/eAuRIy8.png)

- 方向轉換:因為實際測試時x與y的轉動會相反，所以我們使用Break Vector拆解向量，在使用Make Vector合成向量。這邊把x與y相反過來對接，並且在y接到x時要乘上-1，不然左右邊滾動時方向會相反

![](https://i.imgur.com/HvTHCNi.png)

- Rotator form Axis and Angle:因為設定物體轉動時資料型態需要轉變為Rotator，所以我們將轉動軸與轉動量合併為一個Rotator。Axis為剛剛經過轉換後的轉動軸，Angle為轉動量

![](https://i.imgur.com/vOeIbJd.png)


- SetWorldRotaion:用來設定物體的轉動，這邊將Target設定為球體，並將剛剛轉換好的Rotator輸入至New Rotaion即完成

![](https://i.imgur.com/XQRxFHG.png)

實作完成!

---