import { CloudSource } from 'global/enum';
import { getBlcMessage } from './getBlcMessage';
import { getMieboMessage } from './getMieboMessage';
import { getXiaoxiaoMessage } from './getXiaoxiaoMessage';
import { getXubaoMessage } from './getXubaoMessage';

// 根据平台解析弹幕文本
export function getMessage(current: Element, cloudSource: CloudSource) {
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
