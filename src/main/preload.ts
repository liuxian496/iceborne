// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { BarrageSetting } from 'page/page.types';

export type Channels = 'ipc-example';

let collectDanmuTimer: any;

let currentVoiceChecked = false;

let bilibiliDanmuElement: Element | undefined;

let currentBroadcastIndex = 0;

function startDanmuCirculate() {
  collectDanmuTimer = setTimeout(() => {
    clearTimeout(collectDanmuTimer);
    if (currentVoiceChecked === true) {
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
            utterThis.volume = 0.35;
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

function checkBroadcast(voiceChecked: boolean) {
  if (bilibiliDanmuElement === undefined) {
    [bilibiliDanmuElement] = document.getElementsByClassName('danmaku');
    currentBroadcastIndex = bilibiliDanmuElement.children.length;
  }
  currentVoiceChecked = voiceChecked;
  if (voiceChecked === true) {
    startDanmuCirculate();
  } else {
    // 关闭播报时的清理
    bilibiliDanmuElement = undefined;
    currentBroadcastIndex = 0;
  }
}

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  /**
   * 发送打开弹幕窗口的消息
   * @param args 控制弹幕的参数
   */
  showDanmuView: (args: BarrageSetting) => {
    ipcRenderer.send('show-danmu-view', args);
  },
  /**
   * 发送关闭弹幕窗口的消息
   */
  hideDanmuView: () => {
    ipcRenderer.send('hide-danmu-view');
  },
  /**
   * 发送更改语音朗读功能是否开启的消息
   * @param speech 是否开启朗读 true表示开启，反之表示不开启
   */
  changeSpeech: (speech: boolean) => {
    ipcRenderer.send('change-speech', speech);
  },
  /**
   * 监听update-speech消息，并在其触发时，调用callback
   * @param callback 回调函数
   */
  onUpdateVoice: (callback: any) => {
    ipcRenderer.on('update-speech', callback);
  },
  /**
   * 是否开启语音播报功能
   * @param speech 是否开启朗读 true表示开启，反之表示不开启
   */
  broadcast: (speech: boolean) => {
    checkBroadcast(speech);
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
