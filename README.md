# Iceborne

Iceborne，是一个简易版的，基于 Electron开发的，支持 mac os 系统的弹幕播报应用，是一个纯前端的直播弹幕显示和播报工具。它的核心功能是「根据用户输入的网络链接」创建一个始终位于其他窗口之上的窗口。目前支持的云插件包括[bilibili 在线弹幕姬](https://link.bilibili.com/ctool/vtuber/)和[咩播云插件](https://yun.miebo.cn/)，B站幻星-BLC。

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

<p>
请去云插件的样式设置页面，设置自己喜欢的弹幕样式。
</p>


## bilibili 云插件使用方式

### 1. 选择云插件来源
<p>
（1）『云插件来源：』选择 bilibili
</p>

### 2. 获取房间号
<p>
（1）点击『云插件后台：』后方的链接『打开 bilibili 弹幕姬后台』
</p>

<p>
（2）如果没有登录过网页版的 bilibili弹幕姬，需要使用bilibil App扫码登录。
</p>

<p>
（3）页面上方，OBS's link后面的url就是自己账号对应的，网页版的弹幕姬。roomid后面的数字就是房间号。请复制房间号。
</p>

<p>
 （4）将复制好的房间号，粘贴到『房间号：』后的文本框
</p>

<p>
PS：这个链接可以在OBS中使用，也可以用浏览器打开。如果不需要播报功能，可以用这个链接，分屏显示弹幕。
</p>

### 3. 打开、关闭弹幕播报

<p>
（1）可以点击『开始朗读：』后面的开关，关闭或者打开语音播报功能。关闭后，标签会变成『停止朗读：』
</p>

### 4. 调整播报音量

<p>
（1）可以点击、拖拽、或者使用键盘控制『音量：』后的滑动条，调整音量大小。
</p>

### 5. 打开弹幕播报视图

<p>
（1）输入房间号之后，『连接』按钮会变为可用。点击『连接』按钮，会在屏幕右上方弹出『弹幕播报』窗口，这个弹窗会在所有应用窗口之上
</p>
<p>
（2）去直播间发送弹幕，测试是否能正常工作
</p>

## B站幻星-BLC H5插件使用方式

### 1. 选择云插件来源
<p>
（1）『云插件来源：』选择 blc
</p>

### 2. 获取插件地址
<p>
（1）点击『云插件后台：』后方的链接『打开 blc 管理后台』
</p>

<p>
（2）在『直播弹幕姬BLC』的主页面向下拖动滚动条，找到『插件URL』，复制后面的网址。
</p>

<p>
 （3）将复制好的网址，粘贴到『插件地址：』后的文本框
</p>


### 3. 打开、关闭弹幕播报

<p>
（1）可以点击『开始朗读：』后面的开关，关闭或者打开语音播报功能。关闭后，标签会变成『停止朗读：』
</p>

### 4. 调整播报音量

<p>
（1）可以点击、拖拽、或者使用键盘控制『音量：』后的滑动条，调整音量大小。
</p>

### 5. 打开弹幕播报视图

<p>
（1）输入插件地址之后，『连接』按钮会变为可用。点击『连接』按钮，会在屏幕右上方弹出『弹幕播报』窗口，这个弹窗会在所有应用窗口之上
</p>
<p>
（2）去直播间发送弹幕，测试是否能正常工作
</p>

## 咩播云插件使用方式

### 1. 选择云插件来源

（1）『云插件来源：』选择 miebo

### 2. 获取插件号

（1）点击『云插件后台：』后方的链接『打开 meibo 管理后台』，会在默认浏览器中打开对应的网页。

<p>
（2）登录咩播云插件
</p>
<p>
 （3）在左侧的导航中，找到『主播助手』下的『弹幕助手』，点击『弹幕助手』
</p>
<p>
 （4）页面上方的下拉框会显示『VIP网址』，切换成『免费网址』。最后一个 "/”后的字符串，就是插件号，请复制这个字符串
</p>
<p>
 （5）将复制好的插件号，粘贴到『插件号：』后的文本框
</p>
<p>
PS:咩播云插件支持B站、虎牙、斗鱼
</p>

### 3. 打开、关闭弹幕播报

<p>
（1）可以点击『开始朗读：』后面的开关，关闭或者打开语音播报功能。关闭后，标签会变成『停止朗读：』
</p>

### 4. 调整播报音量

<p>
（1）可以点击、拖拽、或者使用键盘控制『音量：』后的滑动条，调整音量大小。
</p>

### 5. 打开弹幕播报视图

<p>
（1）输入插件号之后，『连接』按钮会变为可用。点击『连接』按钮，会在屏幕右上方弹出『弹幕播报』窗口，这个弹窗会在所有应用窗口之上
</p>
<p>
（2）去直播间发送弹幕，测试是否能正常工作
</p>

## 开发与打包

<p>没有Apple开发账号（每年99美元），因此没有上架应用商店。想要使用，请自行下载代码，打包后安装。</p>
<p>不建议没有开发经验的用户，修改代码和打包，可能会遇到很多问题。</p>
<p>不提供任何使用私人链接的下载版本，请谨防有人使用破解手段注入恶意木马。使用私人链接下载版本，后果自负。<b>目前使用Iceborne弹幕播报的唯一方法，就是下载代码，打包后安装</b></p>

### 1. 安装依赖

打开终端，运行：npm install

### 2. 启动调试工程

打开终端，运行：npm start

### 3. 打包

<p>
（1）打开终端，运行：npm run package
</p>
<p>
（2）打包成功后，在项目的release文件夹下会生成一个build文件夹
</p>
<p>
（3）进入build文件夹，找到适合系统的文件进行安装（mac系统请点击dmg结尾的文件进行安装）
</p>
<p>
（4）如果mac系统阻止软件运行，请到「隐私与安全性」中放开限制。
</p>

### 4. 更新说明

<p>
（1）使用Inter芯片的MacBook Pro进行开发和测试。系统版本14.2.1。理论上支持苹果M系芯片，请使用M系芯片的MacBook自行下载代码，打包后安装。
</p>
<p>
（2）从2023年8月份开始，我在B站直播时，就使用了Iceborne弹幕播报。后续也会保持对mac os新版本的支持（因为自己要用）
</p>
<p>
（3）项目的目的是提供一个简易的弹幕播报。是一个纯前端的解决方案，没有服务器端，也不会对本地文件进行读写。目前没有支持复杂功能的计划。
</p>
<p>
（4）底层框架Electron支持跨平台，但开发过程中，没有针对windows进行测试，可能存在bug。因为windows平台在弹幕播报上有非常多的选择，支持windows不是这个项目的重点。windows用户请使用其他更好的软件。
</p>
<p>
（5）2024年3月15日发布1.2.0，修改「bilibili弹幕姬」的鉴权方式，支持咩播云插件。
</p>
<p>
（6）2024年4月27日发布1.4.0，支持B站幻星H5-BLC云插件。
</p>

## 如果你想请我喝一杯咖啡（Buy Me a Coffee）

<img src=".\\assets\\wechat.jpg" height="360">
<img src=".\\assets\\alipay.jpg" height="360">
