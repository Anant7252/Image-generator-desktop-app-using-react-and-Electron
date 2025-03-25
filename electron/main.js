
import { app, BrowserWindow } from 'electron';
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const createWindow=()=> {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: 'hidden',
    icon: 'public/icon.ico',
    titleBarOverlay: {
      color: '#18181B',
      symbolColor: '#74b1be',
      height: 10
    },
    webPreferences:{
      enableRemoteModule:true
    }
  })
  

  // win.loadURL('http://localhost:3000')
  win.loadFile(path.join(__dirname, '../build', 'index.html'));
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    let csp = details.responseHeaders['Content-Security-Policy'] || [];
    if (Array.isArray(csp)) {
      csp = csp.join('; ');
    }
  
    // Append your connect-src for Hugging Face API
    const updatedCSP = `${csp} connect-src 'self' https://api-inference.huggingface.co;`;
  
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [updatedCSP]
      }
    });
  });
};

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})