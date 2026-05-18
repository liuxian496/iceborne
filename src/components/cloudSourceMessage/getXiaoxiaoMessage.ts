export function getXiaoxiaoMessage(current: Element) {
  let value = null;

  const userNode = current.querySelector('.nickname') as HTMLElement;
  const msgNode = current.querySelector('.text') as HTMLElement;

  if (userNode !== null && msgNode !== null) {
    value = `${userNode?.innerText}说${msgNode?.innerText}`;
  }

  return value;
}
