const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 660,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  let urlLocation = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, './build/index.html')}`;

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadURL(urlLocation);
});

ipcMain.on('render-send', (event, arg) => {
  // console.log('event', event);
  console.log('arg', arg);
  dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'openDirectory']
  }).then(result => {
    console.log(result.canceled)
    console.log(result.filePaths)
    mainWindow.webContents.send('ping', {
      canceled: result.canceled,
      filePaths: result.filePaths
    });
  }).catch(err => {
    console.log(err)
  });
});