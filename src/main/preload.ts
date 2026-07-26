/* eslint-disable prettier/prettier */
// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { updateSpeech, updateVolume } from 'components/speaker';
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { BarrageSetting } from 'page/page.types';

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
   * 发送打开bilibili管理窗口的消息
   */
  sentShowBilibiliManageView: () => {
    ipcRenderer.send('show-bilibili-manage-view');
  },
  /**
   * 发送关闭bilibili管理窗口的消息
   */
  sentHideBilibiliManageView: () => {
    ipcRenderer.send('hide-bilibili-manage-view');
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
    const { cloudSource, speech, volume } = args;
    updateSpeech(speech, cloudSource);
    updateVolume(volume);
  },
  /**
   * 自定义事件onbilibiliManageWinClosed：监听bilibili-manage-win-closed消息，并触发回调。bilibili云管理窗口关闭时触发
   * @param callback 回调函数
   */
  onbilibiliManageWinClosed: (callback: any) => {
    ipcRenderer.on('bilibili-manage-win-closed', callback);
  },

  /* ====== 新增：历史弹幕相关 API ====== */

  /**
   * 保存一条历史弹幕记录
   * @param record 弹幕记录
   */
  sentSaveBarrageHistory: (record: {
    username: string;
    content: string;
    platform: string;
    type?: string;
    color?: string;
  }) => {
    ipcRenderer.send('save-barrage-history', record);
  },

  /**
   * 获取指定日期的历史弹幕（异步）
   * @param dateStr 日期字符串 年-月-日，例如 "2026-07-05"
   */
  getBarrageHistory: (dateStr: string): Promise<any[]> => {
    return ipcRenderer.invoke('get-barrage-history', dateStr);
  },

  /**
   * 获取所有有历史记录的日期列表（异步）
   */
  getBarrageHistoryDates: (): Promise<string[]> => {
    return ipcRenderer.invoke('get-barrage-history-dates');
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
