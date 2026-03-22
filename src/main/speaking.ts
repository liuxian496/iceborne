import { CloudSource } from 'global/enum';

// 弹幕轮询定时器
let collectDanmuTimer: any;

// 是否开启语音播报
let currentSpeech = false;

// 当前播报音量（0-100）
let currentVolume = 35;

// 当前平台弹幕容器元素
let bilibiliDanmuElement: Element | null = null;

// 当前播报到的弹幕索引
let currentBroadcastIndex = 0;

function getBilibiliMessage(current: Element) {
  let value = null;

  const userNode = current.querySelector('.user-name') as HTMLElement;
  const msgNode = current.querySelector('.danmaku-content') as HTMLElement;
  if (userNode !== null && msgNode !== null) {
    value = `${userNode?.innerText}说${msgNode?.innerText}`;
  }

  return value;
}

function getXiaoxiaoMessage(current: Element) {
  let value = null;

  const userNode = current.querySelector('.nickname') as HTMLElement;
  const msgNode = current.querySelector('.text') as HTMLElement;

  if (userNode !== null && msgNode !== null) {
    value = `${userNode?.innerText}说${msgNode?.innerText}`;
  }

  return value;
}

function getMieboMessage(current: Element) {
  let value = null;

  if (current.classList.contains('dock-combo')) {
    // 礼物
    const userNode = current.querySelector('.dock-gift-uname') as HTMLElement;
    const giftNode = current.querySelector('.dock-gift-gname') as HTMLElement;
    if (userNode !== null && giftNode !== null) {
      value = `${userNode?.innerText}赠送了${giftNode?.innerText}`;
    }
  } else {
    // 普通弹幕
    const userNode = current.querySelector('.dock-chat-name') as HTMLElement;
    const msgNode = current.querySelector('.dock-chat-msg') as HTMLElement;
    if (userNode !== null && msgNode !== null) {
      value = `${userNode?.innerText}说${msgNode?.innerText}`;
    }
  }

  return value;
}

function getXubaoMessage(current: Element) {
  let value = null;
  const itemsDiv = document.getElementById('items');

  if (current) {
    // 礼物
    const avatarNode = current.querySelector('.avatar .img') as HTMLElement;
    const userNode = current.querySelector('.id .text') as HTMLElement;
    const msgNode = current.querySelector('.msg .text') as HTMLElement;
    const giftNode = current.querySelector('.gift .text') as HTMLElement;

    giftNode && (giftNode.style.color = 'bisque');

    if (giftNode === null) {
      value = `${userNode?.innerText}说${msgNode?.innerText}`;
    } else {
      value = `${giftNode.innerText}`;
    }

    const item = document.createElement('div');
    item.className = 'ice--item';

    const itemAvatar = document.createElement('div');
    itemAvatar.className = 'ice--itemAvatar';

    avatarNode && itemAvatar.append(avatarNode);
    userNode && itemAvatar.append(userNode);

    if (msgNode) {
      msgNode.style.color = '#fff';
    }

    item.append(itemAvatar);
    msgNode && item.append(msgNode);
    giftNode && item.append(giftNode);

    itemsDiv?.append(item);
    item.scrollIntoView();
  }
  return value;
}

function getBlcMessage(current: Element) {
  let value = null;

  if (current) {
    // 礼物
    const userNode = current.querySelector('#author-name') as HTMLElement;
    const giftNode = current.querySelector('#purchase-amount') as HTMLElement;
    const msgNode = current.querySelector('#image-and-message') as HTMLElement;

    if (userNode !== null && msgNode !== null) {
      value = `${userNode?.innerText}说${msgNode?.innerText}`;
    } else if (userNode !== null && giftNode !== null) {
      value = `${userNode?.innerText}${giftNode?.innerText}`;
    }
  }

  return value;
}

// 根据平台解析弹幕文本
function getMessage(current: Element, cloudSource: CloudSource) {
  let value = null;

  switch (cloudSource) {
    case CloudSource.miebo:
      value = getMieboMessage(current);
      break;
    case CloudSource.xiaoxiao:
      value = getXiaoxiaoMessage(current);
      break;
    case CloudSource.xubao:
      value = getXubaoMessage(current);
      break;
    case CloudSource.blc:
      value = getBlcMessage(current);
      break;
    default:
      value = null;
      break;
  }

  return value;
}

// 轮询间隔（毫秒）
const danmuPollIntervalMs = 100;

// 安排下一次轮询
function scheduleNextDanmuTick(cloudSource: CloudSource) {
  if (collectDanmuTimer) {
    clearTimeout(collectDanmuTimer);
  }
  collectDanmuTimer = setTimeout(() => {
    runDanmuTick(cloudSource);
  }, danmuPollIntervalMs);
}

// 按平台规则取当前要播报的弹幕元素
function getCurrentDanmuElement(cloudSource: CloudSource, maxMessage: number) {
  return cloudSource === CloudSource.xiaoxiao
    ? bilibiliDanmuElement!.children[maxMessage - currentBroadcastIndex - 1]
    : bilibiliDanmuElement!.children[currentBroadcastIndex];
}

// 执行一次弹幕轮询与播报
function runDanmuTick(cloudSource: CloudSource) {
  if (currentSpeech !== true) {
    return;
  }

  if (bilibiliDanmuElement === null) {
    scheduleNextDanmuTick(cloudSource);
    return;
  }

  const maxMessage = bilibiliDanmuElement.children.length;
  if (maxMessage === 0) {
    scheduleNextDanmuTick(cloudSource);
    return;
  }

  if (currentBroadcastIndex > maxMessage) {
    currentBroadcastIndex = 0;
  }

  const current = getCurrentDanmuElement(cloudSource, maxMessage);
  if (!current) {
    scheduleNextDanmuTick(cloudSource);
    return;
  }

  const msg = getMessage(current, cloudSource);
  console.log(`msg:${msg}`);
  if (msg === null) {
    // msg返回null时，表示遇到无法解析的弹幕。计数加一，跳过
    currentBroadcastIndex += 1;
    scheduleNextDanmuTick(cloudSource);
    return;
  }

  const utterThis = new SpeechSynthesisUtterance(msg);
  utterThis.volume = currentVolume / 100;
  utterThis.onend = () => {
    currentBroadcastIndex += 1;
    scheduleNextDanmuTick(cloudSource);
  };
  utterThis.onerror = () => {
    currentBroadcastIndex += 1;
    scheduleNextDanmuTick(cloudSource);
  };
  speechSynthesis.speak(utterThis);
}

// 启动弹幕播报循环
function startDanmuCirculate(cloudSource: CloudSource) {
  scheduleNextDanmuTick(cloudSource);
}

/**
 * 更新语音播报
 * @param speech 是否开启语音播报，true表示开启
 */
export function updateSpeech(speech: boolean, cloudSource: CloudSource) {
  if (bilibiliDanmuElement === null) {
    let current = null;
    switch (cloudSource) {
      case CloudSource.bilibili:
        current = document.getElementsByClassName('danmaku')[0];
        break;
      case CloudSource.miebo:
        current = document.getElementsByClassName('dock-ul')[0];
        break;
      case CloudSource.xiaoxiao:
        current = document.getElementsByClassName('chatarea')[0];
        break;
      case CloudSource.xubao:
        current = document.getElementById('div_BiLiveChatOutputer');
        break;
      case CloudSource.blc:
        current = document.getElementById('chat-items');
        break;
      default:
        current = null;
        break;
    }
    bilibiliDanmuElement = current;
    console.log('bilibiliDanmuElement: ' + bilibiliDanmuElement);
  } else {
    // 关闭播报时的清理
    currentSpeech = false;
    speechSynthesis.cancel(); // 关键修复：立即停止所有语音播报
    bilibiliDanmuElement = null;
    currentBroadcastIndex = 0;
    if (collectDanmuTimer) {
      clearTimeout(collectDanmuTimer);
      collectDanmuTimer = null;
    }
  }

  currentSpeech = speech;
  if (speech === true) {
    startDanmuCirculate(cloudSource);
  } else {
    // 关闭播报时的清理
    bilibiliDanmuElement = null;
    currentBroadcastIndex = 0;
  }
}

/**
 * 更改音量
 * @param volume 待更新的音量
 */
export function updateVolume(volume: number) {
  currentVolume = volume;
}
