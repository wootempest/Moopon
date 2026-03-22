const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
const https = require('https');
const querystring = require('querystring');

let mainWindow = null;

function createWindow() {
    // Allow loading images from all sources including MAL CDN
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1000,
        minHeight: 700,
        frame: false,
        transparent: false,
        backgroundColor: '#0a0010',
        icon: path.join(__dirname, '../icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false,
            webSecurity: false,
            allowRunningInsecureContent: true,
        },
    });

    if (process.env.VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.commandLine.appendSwitch('enable-features', 'VaapiVideoDecoder');
app.commandLine.appendSwitch('disable-gpu-sandbox');
app.commandLine.appendSwitch('no-sandbox');

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Window controls
ipcMain.on('window-minimize', () => mainWindow?.minimize());
ipcMain.on('window-maximize', () => {
    if (mainWindow?.isMaximized()) {
        mainWindow.unmaximize();
    } else {
        mainWindow?.maximize();
    }
});
ipcMain.on('window-close', () => mainWindow?.close());
ipcMain.handle('window-is-maximized', () => mainWindow?.isMaximized());

// ─── MAL OAuth2 ───

function postRequest(url, data) {
    return new Promise((resolve, reject) => {
        const postData = querystring.stringify(data);
        const parsed = new URL(url);

        const req = https.request({
            hostname: parsed.hostname,
            path: parsed.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData),
            },
        }, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch {
                    reject(new Error('Invalid JSON response'));
                }
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

// Open MAL auth window and return the authorization code
ipcMain.handle('mal-auth', async (_event, authUrl) => {
    return new Promise((resolve, reject) => {
        const authWindow = new BrowserWindow({
            width: 600,
            height: 750,
            parent: mainWindow,
            modal: true,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
            },
        });

        authWindow.setMenuBarVisibility(false);

        authWindow.loadURL(authUrl);

        // Listen for redirects to our callback
        authWindow.webContents.on('will-redirect', (event, url) => {
            if (url.startsWith('http://localhost')) {
                event.preventDefault();
                const parsed = new URL(url);
                const code = parsed.searchParams.get('code');
                authWindow.close();
                if (code) {
                    resolve(code);
                } else {
                    reject(new Error('No code received'));
                }
            }
        });

        // Also check will-navigate for some OAuth flows
        authWindow.webContents.on('will-navigate', (event, url) => {
            if (url.startsWith('http://localhost') && url.includes('code=')) {
                event.preventDefault();
                const parsed = new URL(url);
                const code = parsed.searchParams.get('code');
                authWindow.close();
                if (code) {
                    resolve(code);
                } else {
                    reject(new Error('No code received'));
                }
            }
        });

        authWindow.on('closed', () => {
            reject(new Error('Auth window closed'));
        });
    });
});

// Exchange code for tokens (done in main process to avoid CORS)
ipcMain.handle('mal-token-exchange', async (_event, { clientId, code, codeVerifier }) => {
    try {
        const result = await postRequest('https://myanimelist.net/v1/oauth2/token', {
            client_id: clientId,
            code: code,
            code_verifier: codeVerifier,
            grant_type: 'authorization_code',
        });
        return result;
    } catch (err) {
        return { error: err.message };
    }
});

// Refresh token (done in main process to avoid CORS)
ipcMain.handle('mal-token-refresh', async (_event, { clientId, refreshToken }) => {
    try {
        const result = await postRequest('https://myanimelist.net/v1/oauth2/token', {
            client_id: clientId,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
        });
        return result;
    } catch (err) {
        return { error: err.message };
    }
});
