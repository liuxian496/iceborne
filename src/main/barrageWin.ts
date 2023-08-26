import { BrowserWindow, app } from 'electron';
import path from 'path';
// import { resolveHtmlPath } from './util';

let barrageWin: BrowserWindow | null = null;

function createDanMuViewByRoomId(roomId: number) {
  barrageWin = new BrowserWindow({
    show: false,
    width: 245,
    height: 400,
    type: 'panel',
    frame: false,
    resizable: false,
    movable: true,
    transparent: true,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  // barrageWin?.loadURL(resolveHtmlPath('barrage.html'));

  // const view = new BrowserView();
  // barrageWin.setBrowserView(view);
  // view.webContents.loadURL(
  //   `http://link.bilibili.com/ctool/vtuber/index.html?roomid=${roomId}&full=1`
  // );

  // barrageWin.webContents.executeJavaScript(
  //   'let aaa =document.getElementsByTagName("ul"); console.log(aaa.length)'
  // );

  barrageWin?.loadURL(
    `http://link.bilibili.com/ctool/vtuber/index.html?roomid=${roomId}&full=1`
  );

  barrageWin.once('ready-to-show', () => {
    barrageWin?.show();
    barrageWin?.setPosition(1400, 0);
  });

  barrageWin.on('close', () => {
    barrageWin = null;
  });
}

export function showDanMuView(roomId: number) {
  createDanMuViewByRoomId(roomId);
}

export function hidenDanMuView() {
  barrageWin?.close();
}
