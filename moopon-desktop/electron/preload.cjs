const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close'),
    isMaximized: () => ipcRenderer.invoke('window-is-maximized'),

    // MAL OAuth
    malAuth: (authUrl) => ipcRenderer.invoke('mal-auth', authUrl),
    malTokenExchange: (data) => ipcRenderer.invoke('mal-token-exchange', data),
    malTokenRefresh: (data) => ipcRenderer.invoke('mal-token-refresh', data),
});
