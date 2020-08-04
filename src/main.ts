import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import { DeviceCommunication } from "./comSDK/device-communication";

/* const port = new SerialPort("COM4", { baudRate: 9600 }); */

const deviceCom = new DeviceCommunication("COM4", 9600);

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      webSecurity: false,
      plugins: true,
      nodeIntegration: true
    },
    width: 800,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

ipcMain.on("serial-port-write", (event: any, arg: any) => {
  deviceCom.startDaq().then(() => event.sender.send("new-line", 'startdaq sent')).catch((e) => event.sender.send("new-line", 'startdaq sent error: ' + e));
  /* port.write(arg);
  event.sender.send("new-line", arg + ' sent');
  port.on('data', (line: string) => event.sender.send("new-line", "> " + line)) */
});

ipcMain.on("connect", (event: any) => {
  deviceCom.connect().then(() => {
    event.sender.send("new-line", 'connected');
  }).catch((error) => {
    event.sender.send("new-line", 'connection error: ' + JSON.stringify(error));
  });
});

ipcMain.on("disconnect", (event: any) => {
  deviceCom.disconnect().then(() => {
    event.sender.send("new-line", 'disconnected');
  }).catch((error) => {
    event.sender.send("new-line", 'connection close error: ' + JSON.stringify(error));
  });
});

ipcMain.on("isConnected", (event: any) => {
  event.sender.send("new-line", 'isConnected: ' + deviceCom.isConnected());
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
