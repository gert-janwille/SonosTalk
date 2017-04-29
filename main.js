const electron = require('electron')
const {app, Menu} = require('electron')

const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const sonos = require('./src/sonos/server.js')
const exec = require('child_process').exec;


let mainWindow


const createWindow = () => {

  mainWindow = new BrowserWindow({width: 800, height: 600, title: 'SonosTalk', icon: './assets/icon.icns', titleBarStyle: 'hidden-inset'})

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, './src/index.html'),
    protocol: 'file:',
    slashes: true
  }))


  // Open the DevTools.
  // mainWindow.webContents.openDevTools()


  mainWindow.on('closed', () => mainWindow = null)

  runMenu();

  sonos;
}


app.on('ready', createWindow)

app.on('window-all-closed', () => {
  exec('kill $(sudo lsof -t -i:5005)');
  app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow();
})

const runMenu = () => {
  var menuItems = [{
          label: "SonosTalk",
          submenu: [
              { label: "About SonosTalk", selector: "orderFrontStandardAboutPanel:" },
              { type: "separator" },
              { label: "Quit", accelerator: "Command+Q", click: () => app.quit()}
          ]}, {
          label: "Edit",
          submenu: [
              { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
              { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
              { type: "separator" },
              { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
              { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
              { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
              { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
          ]}
      ];

      Menu.setApplicationMenu(Menu.buildFromTemplate(menuItems));
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
