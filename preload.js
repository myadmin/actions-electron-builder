const { contextBridge, ipcRenderer, remote, shell } = require('electron');

const ipc = {
    render: {
        // From render to main.
        send: ["toMain", "render-send", "checkForUpdate", "isUpdateNow", "checkAppVersion"],
        // From main to render.
        receive: ["updateAvailable", "message", "downloadProgress", "checking-for-update", "update-not-available", "isUpdateNow", "version"],
        // From render to main and back again.
        sendReceive: []
    }
};

contextBridge.exposeInMainWorld('electron', {
    ipcRenderer,
    remote,
    shell,
    'ipcRender': {
        send: (channel, data) => {
            // whitelist channels
            let validChannels = ipc.render.send;
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            let validChannels = ipc.render.receive;
            // console.log('validChannels', validChannels);
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(`${channel}`, (event, ...args) => func(...args));
            }
        },
        invoke: (channel, args) => {
            let validChannels = ipc.render.sendReceive;
            if (validChannels.includes(channel)) {
                return ipcRenderer.invoke(channel, args);
            }
        }
    }
});