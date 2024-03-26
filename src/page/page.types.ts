import { CloudSource } from 'global/enum';

export interface BarrageSetting {
  /**
   * 云插件来源
   */
  cloudSource: CloudSource;
  /**
   * 插件地址
   */
  pluginUrl: string;
  /**
   * 是否启用语音播放
   */
  speech: boolean;
  /**
   * 播报音量
   */
  volume: number;
}
