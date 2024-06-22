const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false
        }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.on('execute-command', (event, command) => {
    console.log(`Executing command: ${command}`);  // Debug: Log the command being executed
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`Error: ${error.message}`);  // Debug: Log the error
            event.reply('command-output', `Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);  // Debug: Log stderr
            event.reply('command-output', `stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);  // Debug: Log stdout
        event.reply('command-output', stdout);
    });
});

ipcMain.on('run-code', (event, code) => {
    // Save the code to a temporary JavaScript file and execute it
    const fs = require('fs');
    const tempFilePath = path.join(__dirname, 'temp.js');

    fs.writeFile(tempFilePath, code, (err) => {
        if (err) {
            console.log(`Error writing temp file: ${err.message}`);  // Debug: Log the error
            event.reply('command-output', `Error: ${err.message}`);
            return;
        }

        exec(`node ${tempFilePath}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`Error: ${error.message}`);  // Debug: Log the error
                event.reply('command-output', `Error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);  // Debug: Log stderr
                event.reply('command-output', `stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);  // Debug: Log stdout
            event.reply('command-output', stdout);
        });
    });
});
