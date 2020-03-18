在許多遊戲中，常常會看到跑酷的元素，我們今天將在Unreal實做出跑酷小遊戲。就像下方示意圖，跳台將會在3個紅色點隨機生成，並且跳台生成後會開始移動，最後當玩家抵達終點時會播放特殊音效

![](https://i.imgur.com/KtC8CpD.png)

### 製作跳台
首先第一步當然就是跳台的製作了，我們可以使用Unreal中的**Actor Blueprint**去實做出來

<b>新增Actor Blueprint</b><br>
Actor Blueprint是Unreal裡最常被使用的Blueprint之一，它可以被放置或生成在地圖之中，也可以新增一些子元件去做一些事件的控制

Content Brower中右鍵 -> 選擇Blueprint Class -> 選擇Actor

![](https://i.imgur.com/susT5ui.png)


<b>建立跳台物件</b><br>
創建完Actor後我們直接進入到Blueprint畫面，開始建立跳台的形狀，這邊的範例是用立方體(讀者也可以使用其他形狀)。

Add Component -> 搜尋Cube後新增 

![](https://i.imgur.com/XDsyVMo.png)

接著我們把跳台調成合適的大小即完成，下個階段我們將開始處理跳台移動的部分

![](https://i.imgur.com/bYUcBtq.png)

<b>透過Blueprint讓跳台移動</b><br>
接著我們要開始讓跳台移動起來，因為跳台會被隨機生成在地圖中，所以我們會使用到**Event BeginPlay**這個節點，代表跳台生成時就會觸發，接著我們只要增加移動的程式，就可以達成目標的效果
![](https://i.imgur.com/M4iy64R.png)

我相信直接把完整的程式碼丟上來一定會看不懂，下方將會講解每個節點的功能

- Event BeginPlay:當物件被創建時便會被觸發

![](https://i.imgur.com/seUhSz2.png)

- Add Timeline:因為我們要讓物件**持續**的移動，所以會需要控制時間，這個節點就像是你可以設定在一段時間內去觸發某件事情

![](https://i.imgur.com/IOius5v.png)

- 我們可以雙擊此節點就會進入到下方的編輯視窗，我們點選左上角的**Add float Track**，然後把**length**設定為8秒(跳台移動的秒數)。接著我們就可以在下方新增一些keyframe(shift+左鍵即可新增keyframe)，這邊設定0秒時為0，第8秒時為1，代表了移動的開始與結束

![](https://i.imgur.com/yxFRpFI.png)

- Lerp(vector):為一種線性插植的方法，你可以設定兩點的位置，透過alpha來取兩點中間的某個位置。假設alpha=0.5，則會是兩點之間的平均值，我們可以將剛剛的Float Track節點連到這裡，即可達成移動的效果

![](https://i.imgur.com/fZ5GtWN.png)

- SetRelativeLocation:設定物件的相對位置，經過Lerp處理後輸出的vector將會連至New Location，並把要移動之目標連至Target。因為移動的過程是連續的，所以要把Add Timeline的Update輸出節點連至這裡物體才會持續移動

![](https://i.imgur.com/cevM4F8.png)

- DestroyCompoenet:刪除元件，我們不希望跳台一直存在場景中，因為會持續耗費電腦資源，所以這邊設定物件在移動8秒後會被刪除，只需將欲刪除之物件連至Target即可

![](https://i.imgur.com/pmbezOk.png)

![](https://i.imgur.com/Or1JMaL.png)

### 隨機生成
完成跳台的製作後，接著開始進行隨機生成跳台的階段，那要如何讓跳台生成在特定的位置呢?你或許會講說，那就讓設定xyz座標啊。這確實是一種方法，但假如今天有數十個甚至數百個物件要控制時，這時你應該會覺得非常麻煩。**Target Point**是Unreal內建的定位點，它可以解決上述的問題，只需在Blueprint中取得該Reference即可使用

<b>Target Point創建</b>

- 在Modes中的物件模式搜尋Target Point

![](https://i.imgur.com/elLBPDD.png)
- 將Target Point拉至場景中的特定位置

![](https://i.imgur.com/5lmkUoL.png)
- 如果要在Level Blueprint中取得reference，請至場景中**點選**該物件，回到Blueprint畫面後，右鍵搜索介面即可看到

![](https://i.imgur.com/52bNzNV.png)

<b>建立Target Point陣列</b><br>
實現隨機生成最好的方式就是把所有的生成點存進一個**陣列**中，然後再使用**random**方法把陣列中的隨機一個生成點取出來

![](https://i.imgur.com/VhFxfR5.png)

我相信一定會有一小部份的人還看不懂這段程式的運作方式，所以貼心的我會在下方講解每個節點的功能

- Target Point(reference):從場景中取得的Target Point

![](https://i.imgur.com/lfW3Gwt.png)
- Make Array:Unreal創建Array的方式，它只能裝**同一種資料型態**，而這個陣列能裝的資料型態是由**第一個**輸入的節點去做決定。例如第一個是個整數，那麼就會是整數陣列

![](https://i.imgur.com/wc5hhVb.png)
- Get(a copy):用來取得陣列的資料，可以傳入數字去取得特定index之資料

![](https://i.imgur.com/M8vPKcu.png)
- Random Interger in Range:一種random的使用方式，可以輸入最小值與最大值，將會回傳一個介於最小與最大之間的隨機值

![](https://i.imgur.com/GfU5chB.png)

- GetActorTransform:取得Actor之Transform，包含了Position、Rotation、Scale

![](https://i.imgur.com/37lXGAh.png)

<b>循環生成</b><br>
接下來是所有環節中最重要的一個步驟，我們要將生成跳台這個動作重複地進行，所以會使用到loop的概念，簡單來說就是重複執行不會結束。然後生成的物件選擇我們創建好的跳台，並且把隨機點的位置輸入，就大功告成了

![](https://i.imgur.com/EAR9j5Q.png)

我一樣會在下方說明每個節點的功能，是不是很貼心 :satisfied: 

- Event BeginPlay:當遊戲開始執行時便會觸發

![](https://i.imgur.com/D1DjeWO.png)
- Spawn Actor from Class:生成Actor在場景中，可以指定要生成之類別、位置...等等。這邊我們的Class選擇我們剛剛創建的跳台，然後從陣列產生的隨機點連接到Spawn Transform

![](https://i.imgur.com/dolO9AT.png)
- Add Custom Event:自訂義的事件，可以透過Call Function被呼叫。我們這邊命名為loop

![](https://i.imgur.com/kLxG8Iy.png)
- Call Function:可以直接搜尋function即可找到，可以用來呼叫function

![](https://i.imgur.com/qcH7OmN.png)
- Delay:延遲一段時間，延遲時間可以透過參數去調整，有了delay我們就可以實現間隔執行的效果

![](https://i.imgur.com/qbym23t.png)

![](https://i.imgur.com/Or1JMaL.png)

### 觸發播放音效
許多遊戲中，走到某個區域就會觸發特定的事件，我們稱作**Trigger(觸發)**。Unreal透過Trigger Box去實作出這種效果，原理就像是框出一個範圍，當有物體進入到這個範圍時，就會觸發特定事件

<b>建立Trigger Box</b>

- 在Modes中搜尋Trigger，本範例使用Trigger Box

![](https://i.imgur.com/L8y6Dmm.png)
- 將Trigger Box拉至場景中，並設定觸發之範圍

![](https://i.imgur.com/wYyVSf4.png)
- 點選Trigger Box之後回到Level Blueprint，我們可以在搜尋中看見一些Trigger Box可使用的事件。我們選擇**Add On Actor Overlap**

![](https://i.imgur.com/M9wsffv.png)

<b>建立觸發事件</b><br>
接下來我們增加一些條件設定，必須是玩家進入範圍時才會播放聲音，才可以避免系統的誤判(像是小動物跳進終點...等等)。這邊會使用到**Cast to**的概念，簡單來說就像是機場的檢疫門，如果身上沒有違禁品則可以安全通關。

![](https://i.imgur.com/e4iUwxF.png)

節點功能說明
- OnActorBeginOverlap:當進入範圍時會觸發

![](https://i.imgur.com/X7rUEYM.png)
- Cast to ThirdPersionCharacter:當輸入的Object是玩家(ThirdPersion)時會從成功節點輸出，失敗的話會從Cast Fail輸出

![](https://i.imgur.com/1fmZnqj.png)
- Play Sound at Location:播放聲音在特定座標，這邊設定在玩家的座標播放音效

![](https://i.imgur.com/B8vQEfs.png)
- GetActorLocation:取得Actor的座標

![](https://i.imgur.com/0IjGULY.png)

實作完成!!!

---