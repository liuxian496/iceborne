let collectDanmuTimer: any;

let currentSpeech = false;

let currentVolume = 35;

let bilibiliDanmuElement: Element | undefined;

let currentBroadcastIndex = 0;

/**
 * 开启弹幕监听循环
 */
function startDanmuCirculate() {
  collectDanmuTimer = setTimeout(() => {
    clearTimeout(collectDanmuTimer);
    if (currentSpeech === true) {
      if (
        bilibiliDanmuElement !== undefined &&
        bilibiliDanmuElement.children.length > currentBroadcastIndex
      ) {
        const current = bilibiliDanmuElement.children[currentBroadcastIndex];
        // 如果有弹幕，收集，计数加1
        if (current) {
          const userName: any = current.firstChild;
          const msg: any = current.lastChild;

          if (userName !== undefined && msg !== undefined) {
            const utterThis = new SpeechSynthesisUtterance(
              `${userName.innerText}说${msg.innerText}`
            );
            console.log('currentVolume: ' + currentVolume);
            utterThis.volume = currentVolume / 100;
            speechSynthesis.speak(utterThis);

            utterThis.onend = () => {
              startDanmuCirculate();
              currentBroadcastIndex += 1;
            };
          } else {
            startDanmuCirculate();
          }
        } else {
          startDanmuCirculate();
        }
      } else {
        startDanmuCirculate();
      }
    }
  }, 100);
}

/**
 * 更新语音播报
 * @param speech 是否开启语音播报，true表示开启
 */
export function updateSpeech(speech: boolean) {
  if (bilibiliDanmuElement === undefined) {
    [bilibiliDanmuElement] = document.getElementsByClassName('danmaku');
    currentBroadcastIndex = bilibiliDanmuElement.children.length;
  }
  currentSpeech = speech;
  if (speech === true) {
    startDanmuCirculate();
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
