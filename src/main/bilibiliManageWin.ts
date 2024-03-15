import { BrowserWindow } from 'electron';
import { bilibiliManageWinClosed } from './main';

let bilibiliManageWin: BrowserWindow | null = null;

function createBilibiliManageView() {
  bilibiliManageWin = new BrowserWindow({
    show: false,
    type: '',
    center: true,
    resizable: false,
    movable: true,
    width: 1440,
    height: 810,
  });

  bilibiliManageWin?.loadURL(
    `https://link.bilibili.com/ctool/vtuber/index.html`
  );

  bilibiliManageWin.once('ready-to-show', () => {
    bilibiliManageWin?.show();
  });

  bilibiliManageWin.on('close', () => {
    bilibiliManageWin = null;
    bilibiliManageWinClosed();
  });
}

/**
 * 创建并打开bilibili管理窗口
 * @param props
 */
function showBilibiliManageView() {
  if (bilibiliManageWin === null) {
    createBilibiliManageView();
  }
}

/**
 * 关闭bilibili管理窗口
 */
function hideBilibiliManageView() {
  bilibiliManageWin?.close();
}

export { showBilibiliManageView, hideBilibiliManageView };
