import { app, BrowserWindow, Tray } from 'electron';

let mainWindow = null;
let tray = null;

app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  tray = new Tray(__dirname + "/imgs/icon.png");
  mainWindow = new BrowserWindow({width: 800, height: 600, icon: __dirname + "/icon.png"});
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  mainWindow.webContents.openDevTools()
});
