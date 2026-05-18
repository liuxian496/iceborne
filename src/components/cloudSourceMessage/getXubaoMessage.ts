export function getXubaoMessage(current: Element) {
  let value = null;
  const itemsDiv = document.getElementById('items');

  if (current) {
    // 礼物
    const avatarNode = current.querySelector('.avatar .img') as HTMLElement;
    const userNode = current.querySelector('.id .text') as HTMLElement;
    const msgNode = current.querySelector('.msg .text') as HTMLElement;
    const giftNode = current.querySelector('.gift .text') as HTMLElement;

    giftNode && (giftNode.style.color = 'bisque');

    if (giftNode === null) {
      value = `${userNode?.innerText}说${msgNode?.innerText}`;
    } else {
      value = `${giftNode.innerText}`;
    }

    const item = document.createElement('div');
    item.className = 'ice--item';

    const itemAvatar = document.createElement('div');
    itemAvatar.className = 'ice--itemAvatar';

    avatarNode && itemAvatar.append(avatarNode);
    userNode && itemAvatar.append(userNode);

    if (msgNode) {
      msgNode.style.color = '#fff';
    }

    item.append(itemAvatar);
    msgNode && item.append(msgNode);
    giftNode && item.append(giftNode);

    itemsDiv?.append(item);
    item.scrollIntoView();
  }
  return value;
}
