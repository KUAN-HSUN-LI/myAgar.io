myAgar.io
===

Github:https://github.com/KUAN-HSUN-LI/myAgar.io

### 簡介
Agar.io改編版

### 使用/操作方式 
* 如何創建
>npm install 

修改mongodb的連結

>npm start

* 遊戲玩法
  * 根據滑鼠的方向移動
  * space:分裂並且加速一小斷時間
  * 吃食物會讓質量增加
  * 吃到病毒會分裂

### 其他說明
* 如果，玩遊戲時有很多bug，請不要太意外QAQ


### 使用與參考之框架/模組/原始碼
* 參考github:https://github.com/huytd/agar.io-clone
    * 使用其界面、css、及相關遊戲參數
* React Hook
* Redux
* Nodejs
* webpack
* SAT.js
* 等等

### 我的貢獻
* Client
  * 使用React Hook全面改寫前端的部份，讓code比較精簡
  * useLayoutEffect使得畫面更新較流暢
  * 新增Record遊戲紀錄的功能
* Server
  * 自己撰寫webpack
  * 用babel編譯自己的code
  * 同步處理各個玩家的畫面與資訊

### 心得
* 1/60的同步更新好多問題QQ
* React 做遊戲大爆炸
* React Hook好好用也好難用(很多不了解的部份)
* 不知如何將傳輸canvas畫面優化
* 不會用create-react-app寫server只好自己寫webpack編譯server
* 來不及架設到網路上，也不會架設
* 對於遊戲設計有初步的了解
* 原本用db來同步資料失敗，db寫入讀取太慢ㄌ