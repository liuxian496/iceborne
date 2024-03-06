export interface Lexicon {
  /**
   * 云插件来源
   */
  cloudSource: string;
  /**
   * 云插件后台
   */
  cloudManage: string;
  /**
   * 开始朗读
   */
  startSpeaking: string;
  /**
   * 停止朗读
   */
  stopSpeaking: string;
  /**
   * 房间号
   */
  roomId: string;
  /**
   * 插件号
   */
  pluginId: string;
  /**
   * 音量
   */
  volume: string;
  /**
   * 语言
   */
  language: string;
  /**
   * 房间号水印
   */
  roomIdPlaceholder: string;
  /**
   * 插件号水印
   */
  pluginIdPlaceholder: string;
  /**
   * 连接
   */
  connect: string;
  /**
   * 断开连接
   */
  disconnect: string;
  /**
   * 打开bilibili弹幕姬后台
   */
  openBilibiliDanmuManage: string;
  /**
   * 关闭bilibili弹幕姬后台
   */
  closeBilibiliDanmuManage: string;
  /**
   * 打开miebo管理后台
   */
  openMieboManage: string;
  /**
   * 作者
   */
  author: string;
}
