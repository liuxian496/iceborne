import { getMessage } from 'components/cloudSourceMessage';
import { CloudSource } from 'global/enum';
import { speakerSetting } from './speaker';

// 弹幕轮询定时器
let timer: ReturnType<typeof setTimeout> | null = null;

// 是否开启语音播报
let currentSpeech = false;

// 当前平台弹幕容器元素
let danmakuElement: Element | null = null;

// 当前播报到的弹幕索引
let currentBroadcastIndex = 0;

let currentCloudSource: CloudSource | null = null;

// 轮询间隔（毫秒）
const pollInterval = 100;

/**
 * 按平台规则取当前要播报的弹幕元素
 * @param cloudSource 弹幕来源平台
 * @param maxMessage 当前弹幕数量
 * @returns 当前要播报的弹幕元素
 */
function getCurrentDanmakuElement(
  cloudSource: CloudSource,
  maxMessage: number
) {
  return cloudSource === CloudSource.xiaoxiao
    ? danmakuElement!.children[maxMessage - currentBroadcastIndex - 1]
    : danmakuElement!.children[currentBroadcastIndex];
}

/**
 * 执行一次弹幕轮询，获取当前要播报的弹幕文本并进行语音播报
 * @returns void
 */
function runDanmakuTick() {
  if (currentSpeech === false) {
    return;
  }

  if (danmakuElement === null) {
    scheduleNextDanmakuTick();
    return;
  }

  const maxMessage = danmakuElement.children.length;
  if (maxMessage === 0) {
    scheduleNextDanmakuTick();
    return;
  }

  if (currentBroadcastIndex > maxMessage) {
    // 如果当前索引超过弹幕数量，证明弹幕被清空，重置索引
    currentBroadcastIndex = 0;
  }

  const current = getCurrentDanmakuElement(currentCloudSource!, maxMessage);

  if (!current) {
    scheduleNextDanmakuTick();
    return;
  }

  const msg = getMessage(current, currentCloudSource!);
  console.log(`msg:${msg}`);

  if (msg === null) {
    // msg返回null时，表示遇到无法解析的弹幕。计数加一，跳过
    currentBroadcastIndex += 1;
    scheduleNextDanmakuTick();
    return;
  }

  const utterThis = new SpeechSynthesisUtterance(msg);
  utterThis.volume = speakerSetting.volume / 100;
  utterThis.onend = () => {
    currentBroadcastIndex += 1;
    scheduleNextDanmakuTick();
  };
  utterThis.onerror = () => {
    currentBroadcastIndex += 1;
    scheduleNextDanmakuTick();
  };
  speechSynthesis.speak(utterThis);
}

/**
 * 安排下一次弹幕轮询，根据当前设置的轮询间隔进行定时调用
 */
function scheduleNextDanmakuTick() {
  if (timer) {
    clearTimeout(timer);
  }

  timer = setTimeout(() => {
    runDanmakuTick();
  }, pollInterval);
}

/**
 * 停止语音播报，清理相关状态和定时器
 */
function stopSpeech() {
  currentSpeech = false;
  speechSynthesis.cancel();
  danmakuElement = null;
  currentBroadcastIndex = 0;
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

/**
 * 更新语音播报状态，并根据需要启动或停止播报
 * @param speech 是否开启语音播报，true表示开启
 * @param cloudSource 当前弹幕来源平台，用于获取正确的弹幕容器元素
 */
export function updateSpeech(speech: boolean, cloudSource: CloudSource) {
  // 如果弹幕元素尚未获取，尝试获取
  if (danmakuElement === null) {
    switch (cloudSource) {
      case CloudSource.bilibili:
        danmakuElement = document.getElementsByClassName('danmaku')[0];
        break;
      case CloudSource.miebo:
        danmakuElement = document.getElementsByClassName('dock-ul')[0];
        break;
      case CloudSource.xiaoxiao:
        danmakuElement = document.getElementsByClassName('chatarea')[0];
        break;
      case CloudSource.xubao:
        danmakuElement = document.getElementById('div_BiLiveChatOutputer');
        break;
      case CloudSource.blc:
        danmakuElement = document.getElementById('chat-items');
        break;
      default:
        danmakuElement = null;
        break;
    }
    console.log('danmakuElement: ' + danmakuElement);
  }

  // 更新当前语音播报状态
  currentSpeech = speech;
  currentCloudSource = cloudSource;

  if (speech === true) {
    scheduleNextDanmakuTick();
  } else {
    // 关闭播报时的清理
    stopSpeech();
  }
}
