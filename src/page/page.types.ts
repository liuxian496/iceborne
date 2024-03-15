import { CloudSource } from 'global/enum';

export interface BarrageSetting {
  /**
   * 云插件来源
   */
  cloudSource: CloudSource;
  /**
   * 房间号
   */
  roomId: string;
  /**
   * 插件号
   */
  pluginId: string;
  /**
   * 是否启用语音播放
   */
  speech: boolean;
  /**
   * 播报音量
   */
  volume: number;
}
