import { CloudSource } from 'global/enum';

let collectDanmuTimer: any;

let currentSpeech = false;

let currentVolume = 35;

let bilibiliDanmuElement: Element | undefined;

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

function getMessage(current: Element, cloudSource: CloudSource) {
  let value = null;

  if (cloudSource === CloudSource.miebo) {
    value = getMieboMessage(current);
  } else if (cloudSource === CloudSource.xiaoxiao) {
    value = getXiaoxiaoMessage(current);
  } else {
    value = getBilibiliMessage(current);
  }

  return value;
}

/**
 * 开启弹幕监听循环
 */
function startDanmuCirculate(cloudSource: CloudSource) {
  collectDanmuTimer = setTimeout(() => {
    clearTimeout(collectDanmuTimer);
    if (currentSpeech === true) {
      if (
        bilibiliDanmuElement !== undefined &&
        bilibiliDanmuElement.children.length > currentBroadcastIndex
      ) {
        const maxMessage = bilibiliDanmuElement.children.length;

        const current =
          cloudSource === CloudSource.xiaoxiao
            ? bilibiliDanmuElement.children[
                maxMessage - currentBroadcastIndex - 1
              ]
            : bilibiliDanmuElement.children[currentBroadcastIndex];
        // 如果有弹幕，收集，计数加1
        if (current) {
          const msg = getMessage(current, cloudSource);

          if (msg !== null) {
            const utterThis = new SpeechSynthesisUtterance(msg);
            // console.log(`currentVolume: ${currentVolume}`);
            utterThis.volume = currentVolume / 100;
            speechSynthesis.speak(utterThis);

            utterThis.onend = () => {
              startDanmuCirculate(cloudSource);
              currentBroadcastIndex += 1;
            };
          } else {
            // msg返回null时，表示遇到无法解析的弹幕。计数加一，跳过
            currentBroadcastIndex += 1;
            startDanmuCirculate(cloudSource);
          }
        } else {
          startDanmuCirculate(cloudSource);
        }
      } else {
        startDanmuCirculate(cloudSource);
      }
    }
  }, 100);
}

/**
 * 更新语音播报
 * @param speech 是否开启语音播报，true表示开启
 */
export function updateSpeech(speech: boolean, cloudSource: CloudSource) {
  if (bilibiliDanmuElement === undefined) {
    let current = undefined;
    switch (cloudSource) {
      case CloudSource.bilibili:
        current = document.getElementsByClassName('danmaku');
        break;
      case CloudSource.miebo:
        current = document.getElementsByClassName('dock-ul');
        break;
      case CloudSource.xiaoxiao:
        current = document.getElementsByClassName('chatarea');
        break;
      default:
        current = undefined;
        break;
    }
    if (current) {
      [bilibiliDanmuElement] = current;
    }
  }

  currentSpeech = speech;
  if (speech === true) {
    startDanmuCirculate(cloudSource);
  } else {
    // 关闭播报时的清理
    bilibiliDanmuElement = undefined;
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
