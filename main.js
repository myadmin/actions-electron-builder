const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { autoUpdater } = require("electron-updater");

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

    mainWindow.on('closed', () => {
        mainWindow = null
    });
});

if (isDev) {
    autoUpdater.updateConfigPath = path.join(__dirname, 'dev-app-update.yml');
}
autoUpdater.downloadUpdate = false;
// autoUpdater.checkForUpdates();
autoUpdater.on('error', (err) => {
    dialog.showErrorBox('Error', err === null ? 'unknown' : err);
});
autoUpdater.on('checking-for-update', () => {
    console.log('Checking for update...');
    mainWindow.webContents.send('ping', 'Checking for update...');
});
autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
        type: 'info',
        title: '应用有新的更新',
        message: '发现新版本，是否现在更新？',
        buttons: ['是', '否']
    }, (buttonIndex) => {
        if (buttonIndex === 0) {
            autoUpdater.downloadUpdate();
        }
    });
});
autoUpdater.on('update-not-available', () => {
    dialog.showMessageBox({
        title: '没有新版本',
        message: '当前已经是最新版本'
    });
});
autoUpdater.on('download-progress', (progress) => {
    let logMessage = `Download speed: ${progress.bytesPerSecond}`;
    logMessage = logMessage + ' - Download ' + progress.percent + '%';
    logMessage = logMessage + ' (' + progress.transferred + '/' + progress.total + ')';
    console.log(logMessage);
});
autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
        title: '安装更新',
        message: '更新下载完毕，应用将重启并进行安装'
    }, () => {
        setImmediate(() => autoUpdater.quitAndInstall());
    });
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

ipcMain.on("checkForUpdate", (event, arg) => {
    console.log('===============arg==============', arg);
    //放外面的话启动客户端执行自动更新检查
    autoUpdater.checkForUpdates();
});