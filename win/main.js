const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

// Allow local file access for the app
app.commandLine.appendSwitch('allow-file-access-from-files');
app.commandLine.appendSwitch('disable-web-security');
app.commandLine.appendSwitch('disable-site-isolation-trials');
// Prevent popup blocking for web chats and OAuth
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
app.commandLine.appendSwitch('disable-features', 'BlockInsecurePrivateNetworkRequests,OutOfBlinkCors');

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'resources', 'icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      javascript: true,
      nativeWindowOpen: true,      // Allow window.open() to work
      allowRunningInsecureContent: true,
    },
  });

  // Open ALL external links in system browser (not Electron)
  // This fixes Google login, web chats, and OAuth flows
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Also catch navigation attempts to external URLs
  win.webContents.on('will-navigate', (event, url) => {
    const parsed = new URL(url);
    // If it's not our local file, open in external browser
    if (parsed.protocol !== 'file:') {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  // Allow new-window events without popup blocking
  win.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Load local index.html
  win.loadFile(path.join(__dirname, 'resources', 'app', 'index.html'));

  // Open DevTools in development mode
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
