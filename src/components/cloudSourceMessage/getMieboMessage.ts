export function getMieboMessage(current: Element) {
  let value = null;

  if (current.classList.contains('dock-combo')) {
    // 礼物
    const userNode = current.querySelector('.dock-gift-uname') as HTMLElement;
    const giftNode = current.querySelector('.dock-gift-gname') as HTMLElement;
    if (userNode !== null && giftNode !== null) {
      value = `${userNode?.innerText}赠送了${giftNode?.innerText}`;
    }
  } else {
    // 普通弹幕
    const userNode = current.querySelector('.dock-chat-name') as HTMLElement;
    const msgNode = current.querySelector('.dock-chat-msg') as HTMLElement;
    if (userNode !== null && msgNode !== null) {
      value = `${userNode?.innerText}说${msgNode?.innerText}`;
    }
  }

  return value;
}
