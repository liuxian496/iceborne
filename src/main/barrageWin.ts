import { BrowserWindow, app } from 'electron';
import path from 'path';
import { BarrageSetting } from 'page/page.types';

// import { resolveHtmlPath } from './util';

let barrageWin: BrowserWindow | null = null;

function createDanMuViewByRoomId(props: BarrageSetting) {
  const { roomId, speech, volume } = props;

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

  // ipcMain.on('toggle-voice', async (event, args) => {
  //   console.log(args.checked);
  //   barrageWin?.webContents.send('update-speech', args.checked);
  // });

  // barrageWin?.loadURL(resolveHtmlPath('barrage.html'));

  // const view = new BrowserView();
  // barrageWin.setBrowserView(view);
  // view.webContents.loadURL(
  //   `http://link.bilibili.com/ctool/vtuber/index.html?roomid=${roomId}&full=1`
  // );

  barrageWin.webContents.executeJavaScript(
    `
    const supperChat = document.getElementsByClassName('super-chat')[0];

    const ice = '<svg width="32" height="32" fill="#08CBD0" viewBox="0 0 16 16">'+
      '<’path d="M5 12.5a1.5 1.5 0 1 1-2-1.415V9.5a.5.5 0 0 1 1 0v1.585A1.5 1.5 0 0 1 5 12.5z"/>'+
      '<path d="M1 2.5a2.5 2.5 0 0 1 5 0v7.55a3.5 3.5 0 1 1-5 0V2.5zM3.5 1A1.5 1.5 0 0 0 2 2.5v7.987l-.167.15a2.5 2.5 0 1 0 3.333 0L5 10.486V2.5A1.5 1.5 0 0 0 3.5 1zm5 1a.5.5 0 0 1 .5.5v1.293l.646-.647a.5.5 0 0 1 .708.708L9 5.207v1.927l1.669-.963.495-1.85a.5.5 0 1 1 .966.26l-.237.882 1.12-.646a.5.5 0 0 1 .5.866l-1.12.646.884.237a.5.5 0 1 1-.26.966l-1.848-.495L9.5 8l1.669.963 1.849-.495a.5.5 0 1 1 .258.966l-.883.237 1.12.646a.5.5 0 0 1-.5.866l-1.12-.646.237.883a.5.5 0 1 1-.966.258L10.67 9.83 9 8.866v1.927l1.354 1.353a.5.5 0 0 1-.708.708L9 12.207V13.5a.5.5 0 0 1-1 0v-11a.5.5 0 0 1 .5-.5z"/>'+
      '</svg>';

    const iconDiv = document.createElement('div');
    iconDiv.innerHTML = ice;

    supperChat.append(iconDiv);

    supperChat.style["-webkit-app-region"] = "drag";
    supperChat.style.display="flex";
    supperChat.style["align-items"]="center";
    supperChat.style["padding-left"]="10px";

    // 根据默认值控制语音播报功能的开启
    window.electron.broadcast(${speech});
    window.electron.updateVolume(${volume});

    window.electron.onUpdateVoice((event, speech) => {
      // 根据默认值控制语音播报功能的开启
      window.electron.broadcast(speech);
    });

    window.electron.onUpdateVolume((event, volume) => {
      // 根据默认值控制语音播报功能的开启
      window.electron.updateVolume(volume);
    });

    `
  );

  barrageWin?.loadURL(
    `https://link.bilibili.com/ctool/vtuber/index.html?roomid=${roomId}&full=1`
  );

  barrageWin.once('ready-to-show', () => {
    barrageWin?.show();
    barrageWin?.setPosition(1400, 0);
  });

  barrageWin.on('close', () => {
    barrageWin = null;
  });
}

/**
 * 打开弹幕窗口
 * @param props
 */
export function showDanMuView(props: BarrageSetting) {
  createDanMuViewByRoomId(props);
}

/**
 * 关闭弹幕窗口
 */
export function hidenDanMuView() {
  barrageWin?.close();
}

/**
 * 更改语音朗读功能的开启
 * @param startSpeaking 是否开启朗读 true表示开启，反之表示不开启
 */
export function changeBarrageSpeech(startSpeaking: boolean) {
  barrageWin?.webContents.send('update-speech', startSpeaking);
}

export function changeDanMuVolume(volume: number) {
  barrageWin?.webContents.send('update-volume', volume);
}
