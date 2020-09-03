import {app, dialog, ipcMain, shell, BrowserWindow} from 'electron'
import path from 'path'
import {initDownloader} from "./main_downloader";

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1980,
    height: 1280,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'main_preload.js')
    }
  })
  mainWindow.loadFile('./index.html').then(() => {
    console.log("load succeed!")
  })
  initDownloader(mainWindow.webContents)
  // 打开 devtools，会出现 chrome 的调试器
  mainWindow.webContents.openDevTools()
  mainWindow.webContents.on('new-window', function (event, url) {
    event.preventDefault();
    shell.openExternal(url);
  })
}

// Electron 初始化完毕后调用
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // Mac 平台防止创建多个 Window
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
// 当所有 Window 都关闭后调用，其它平台调用 quit 会关闭程序，mac 还是会显示在菜单栏
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})