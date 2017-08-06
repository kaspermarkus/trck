import { app, BrowserWindow, Tray, nativeImage, Menu, ipcMain, MenuItem } from 'electron';

let mainWindow = null;
let tray = null;
let trayMenu = null;
let menuStatusItem = null;

let menuTemplate = [
  {label: 'Not Running', id: 'statusText'},
  {label: '5', id: '5'},
  {label: '1', id: '1', position: 'before=4'},
  {label: '2', id: '2'},
  {label: '3', id: '3'}
];


app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

ipcMain.on('currentStatus', function(event, props) {
  if (props.imgBuffer) {
    tray.setImage(nativeImage.createFromBuffer(props.imgBuffer, {width: 16, height: 16}))
  }
  if (props.statusText) {
    console.log(props.statusText);
    trayMenu.insert(0, new MenuItem({
      label: "props.statusText",
      enabled: false,
      id: "statusMsg"
    }));
    // menuStatusItem.label = props.statusText; // console.log(trayMenu.items)
  }
});

//   console.log(arg);  // prints "ping"
//   // arg = nativeImage.createFromPath(__dirname + "/imgs/test.png")

//   // mainWindow.setOverlayIcon(arg, "Der er gået tid");
//   tray.setImage(nativeImage.createFromBuffer(arg, {width: 16, height: 16}))

//   // event.sender.send('asynchronous-reply', 'pong');
// });

// ipcMain.on('synchronous-message', function(event, arg) {
//   console.log(arg);  // prints "ping"
//   event.returnValue = 'pong';
// });

var setupTray = function () {
  tray = new Tray(__dirname + "/imgs/icon.png");
  // trayMenu = Menu.buildFromTemplate(menuTemplate)
  trayMenu = new Menu();
  menuStatusItem = new MenuItem({
    label: "KASPER",
    enabled: false,
    id: "statusMsg"
  });
  trayMenu.append(menuStatusItem);
  tray.setContextMenu(trayMenu);
  tray.on("click", function () {
    tray.popUpContextMenu();
  });
};

app.on('ready', () => {
  setupTray();
  mainWindow = new BrowserWindow({width: 800, height: 600, icon: __dirname + "/icon.png"});
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  mainWindow.webContents.openDevTools()
});

