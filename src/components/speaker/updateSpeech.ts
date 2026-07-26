import {
  getMessage,
  getUsernameFromElement,
} from 'components/cloudSourceMessage';
import { ipcRenderer } from 'electron';
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

// 记录最后一条成功播报的弹幕内容，用于容器清空后恢复场景判断
let lastBroadcastedMsg: string | null = null;

// 标记容器是否曾被清空，用于在清空后的首次有弹幕时进行消息去重
let wasEmpty = false;

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
    wasEmpty = true;
    currentBroadcastIndex = 0;
    scheduleNextDanmakuTick();
    return;
  }

  // 处理容器从空变为非空的情况
  if (wasEmpty) {
    wasEmpty = false;

    // 获取第一个应该播报的元素（不同平台首元素逻辑不同）
    const firstElement =
      currentCloudSource === CloudSource.xiaoxiao
        ? danmakuElement.children[maxMessage - 1]
        : danmakuElement.children[0];

    const firstMsg = firstElement
      ? getMessage(firstElement, currentCloudSource!)
      : null;

    if (firstMsg !== null && firstMsg === lastBroadcastedMsg) {
      // DOM 重建（例如React重新渲染），需要跳过已播报过的相同消息
      let skipIndex = 0;

      if (currentCloudSource === CloudSource.xiaoxiao) {
        // xiaoxiao 容器中 children 顺序与播报顺序相反（index 0 为最新）
        // 遍历所有弹幕，从旧到新（children 索引从大到小），找到第一个不同的
        for (let i = maxMessage - 1; i >= 0; i--) {
          const childMsg = getMessage(
            danmakuElement.children[i],
            currentCloudSource!
          );
          if (childMsg !== lastBroadcastedMsg) {
            // 映射到播报索引: broadcastIndex = maxMessage - 1 - i
            skipIndex = maxMessage - 1 - i;
            break;
          }
          if (i === 0) {
            // 全部与 lastBroadcastedMsg 相同，跳过所有
            skipIndex = maxMessage;
          }
        }
      } else {
        // 其他平台：children 顺序与播报顺序一致
        for (let i = 0; i < maxMessage; i++) {
          const childMsg = getMessage(
            danmakuElement.children[i],
            currentCloudSource!
          );
          if (childMsg !== lastBroadcastedMsg) {
            skipIndex = i;
            break;
          }
          if (i === maxMessage - 1) {
            skipIndex = maxMessage;
          }
        }
      }

      currentBroadcastIndex = skipIndex;
    } else {
      // 容器内容已完全刷新，从头开始播报
      currentBroadcastIndex = 0;
    }

    // 如果跳过所有消息，等待下一轮
    if (currentBroadcastIndex >= maxMessage) {
      scheduleNextDanmakuTick();
      return;
    }
  }

  if (currentBroadcastIndex >= maxMessage) {
    // 当前没有待播报的新弹幕，等待下一轮
    scheduleNextDanmakuTick();
    return;
  }

  const current = getCurrentDanmakuElement(currentCloudSource!, maxMessage);

  if (!current) {
    scheduleNextDanmakuTick();
    return;
  }

  const msg = getMessage(current, currentCloudSource!);
  console.log(`msg:${msg}`);

  // 保存历史弹幕,暂时禁用保存历史
  // try {
  //   const username =
  //     getUsernameFromElement(current, currentCloudSource!) || '匿名用户';
  //   const content = msg || '';
  //   ipcRenderer.send('save-barrage-history', {
  //     username,
  //     content,
  //     platform: currentCloudSource || 'unknown',
  //     type: 'danmu',
  //   });
  // } catch (saveErr) {
  //   // 保存失败不影响主流程
  //   console.warn('[HistoryService] 保存弹幕记录失败:', saveErr);
  // }

  if (msg === null) {
    // msg返回null时，表示遇到无法解析的弹幕。计数加一，跳过
    currentBroadcastIndex += 1;
    scheduleNextDanmakuTick();
    return;
  }

  const utterThis = new SpeechSynthesisUtterance(msg);
  utterThis.volume = speakerSetting.volume / 100;
  utterThis.onend = () => {
    lastBroadcastedMsg = msg; // 记录成功播报的消息
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
  lastBroadcastedMsg = null;
  wasEmpty = false;
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
