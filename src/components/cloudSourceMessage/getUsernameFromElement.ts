import { CloudSource } from 'global/enum';

/**
 * 从弹幕 DOM 元素中提取用户名
 * 与 getMessage 配合，在 runDanmuTick 中获取用户信息用于历史记录
 * @param current 当前弹幕 DOM 元素
 * @param cloudSource 弹幕来源平台
 * @returns 用户名，如果无法提取则返回 null
 */
export function getUsernameFromElement(
  current: Element,
  cloudSource: CloudSource
): string | null {
  switch (cloudSource) {
    case CloudSource.miebo: {
      if (current.classList.contains('dock-combo')) {
        const userNode = current.querySelector(
          '.dock-gift-uname'
        ) as HTMLElement;
        return userNode?.innerText || null;
      }
      const userNode = current.querySelector(
        '.dock-chat-name'
      ) as HTMLElement;
      return userNode?.innerText || null;
    }

    case CloudSource.xiaoxiao: {
      const userNode = current.querySelector('.nickname') as HTMLElement;
      return userNode?.innerText || null;
    }

    case CloudSource.xubao: {
      const userNode = current.querySelector('.id .text') as HTMLElement;
      return userNode?.innerText || null;
    }

    case CloudSource.blc: {
      const userNode = current.querySelector('#author-name') as HTMLElement;
      return userNode?.innerText || null;
    }

    default: {
      // bilibili 或未知平台通用
      const userNode = current.querySelector(
        '.chat-item-name, .user-name, .danmaku-author'
      ) as HTMLElement;
      return userNode?.innerText || null;
    }
  }
}
