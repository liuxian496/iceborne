# Iceborne

Iceborne 弹幕播报，是一个简易版的，支持 mac os 系统的弹幕播报应用。基于 Electron 和[bilibili 线上弹幕姬](https://link.bilibili.com/ctool/vtuber/)开发，是一个纯前端的直播弹幕显示和播报工具。

## 功能简介

### 1. 弹幕窗口位置

弹幕窗口会在所有其它<strong>窗口之上</strong>，默认会显示在右上角。

### 2. 拖拽移动

可以通过鼠标按住<strong>寒冰温度计图标</strong>

![寒冰温度计图标](/assets/ice100.jpg 'ice')
进行拖拽，改变窗体的位置

### 3. 弹幕播报

<p>支持播报开启和关闭</p>
<p>支持设置播放音量</p>

### 4. 弹幕样式设置

可以在[bilibili 线上弹幕姬](https://link.bilibili.com/ctool/vtuber/)中的样式设置视图，设置自己喜欢的弹幕样式。

## 使用方式

### 1. 获取房间号

（1）用浏览器打开[bilibili 线上弹幕姬](https://link.bilibili.com/ctool/vtuber/)建议使用 Chrome。

<p>
（2）如果没有登录过网页版的 bilibili，需要扫码登录。
</p>
<p>
 (3)页面上方，OBS's link后面的url就是自己账号对应的，网页版的弹幕姬。roomid后面的数字就是房间号。请复制房间号。
</p>
<p>
 (4)这个链接可以在OBS中使用，也可以用浏览器打开。如果不需要播报功能，可以用这个链接，分屏显示弹幕。
</p>

### 2. Iceborne弹幕播报

<p>
（1）点击Iceborne弹幕播报图标，打开应用。
</p>
<p>
（2）输入自己直播间的房间号（默认显示的是我自己的房间号）。
</p>
<p>
（3）点击连接按钮。右上角会显示弹幕窗口。可以拖拽改变位置。
</p>
<p>
（4）可以通过点击「语音播报」打开或关闭「弹幕播报」功能。
</p>


## 开发与打包

<p>这个应用是自用建议版，没有上架应用商店。有编程经验的用户，可以自己下载并打包。</p>
<p>不建议没有开发经验的用户，自己修改和打包，可能会遇到很多问题。</p>

### 1. 安装依赖

打开终端，运行：npm install

### 2. 启动调试工程

打开终端，运行：npm start

### 3. 打包

打开终端，运行：npm run package

## 如果你想请我喝一杯蜜雪冰城（Buy Me a Mixue Ice Cream & Tea）

<img src=".\\assets\\wechat.jpg" height="360">
<img src=".\\assets\\alipay.jpg" height="360">
