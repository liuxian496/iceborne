import { speakerSetting } from './speaker';

/**
 * 更改音量
 * @param volume 待更新的音量
 */
export function updateVolume(volume: number) {
  speakerSetting.volume = volume;
}
