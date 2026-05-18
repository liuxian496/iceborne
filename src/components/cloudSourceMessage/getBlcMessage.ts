export function getBlcMessage(current: Element) {
  let value = null;

  if (current) {
    // 礼物
    const userNode = current.querySelector('#author-name') as HTMLElement;
    const giftNode = current.querySelector('#purchase-amount') as HTMLElement;
    const msgNode = current.querySelector('#image-and-message') as HTMLElement;

    if (userNode !== null && msgNode !== null) {
      value = `${userNode?.innerText}说${msgNode?.innerText}`;
    } else if (userNode !== null && giftNode !== null) {
      value = `${userNode?.innerText}${giftNode?.innerText}`;
    }
  }

  return value;
}
