/* eslint-disable prettier/prettier */
// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { BarrageSetting } from 'page/page.types';
import { updateSpeech, updateVolume } from './speaking';

export type Channels = 'ipc-example';

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
   * 发送打开弹幕窗口消息
   * @param args 弹幕控制参数
   */
  sentShowDanmuView: (args: BarrageSetting) => {
    ipcRenderer.send('show-danmu-view', args);
  },
  /**
   * 发送关闭弹幕窗口消息
   */
  sentHideDanmuView: () => {
    ipcRenderer.send('hide-danmu-view');
  },
  /**
   * 发送更改语音播报功能的消息
   * @param args 弹幕控制参数
   */
  sentChangeSpeaking: (args: BarrageSetting) => {
    ipcRenderer.send('change-speaking', args);
  },
  /**
   * 自定义事件onBarrageSpeakingChange：监听barrage-speaking-change消息，并触发回调
   * @param callback 回调函数
   */
  onBarrageSpeakingChange: (callback: any) => {
    ipcRenderer.on('barrage-speaking-change', callback);
  },
  /**
   * 更新弹幕控制参数
   * @param args 待更新的弹幕控制参数
   */
  updateBarrageSetting: (args: BarrageSetting) => {
    const { speech, volume } = args;
    updateSpeech(speech);
    updateVolume(volume);
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
