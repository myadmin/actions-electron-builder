const { contextBridge, ipcRenderer, remote, shell } = require('electron');

const ipc = {
    'render': {
        // From render to main.
        'send': ["toMain", "render-send", "checkForUpdate"],
        // From main to render.
        'receive': ["fromMain", "ping"],
        // From render to main and back again.
        'sendReceive': []
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
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => func(...args));
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