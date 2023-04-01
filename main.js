/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const { app, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');

function onReady() {
    win = new BrowserWindow({ width: 900, height: 6700 });
    win.loadURL(
        url.format({
            pathname: path.join(__dirname, 'dist/colony-project/index.html'),
            protocol: 'file:',
            slashes: true,
        })
    );
}

app.on('ready', onReady);
