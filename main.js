const { app, BrowserWindow } = require('electron');
const path = require('path');

// Variable for my different operating system
const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';

/**
 * Create the main function window to launch the application
 */

const createMainWindow = () => {
	const mainWindow = new BrowserWindow({
		title: 'Image Resizer',
		height: 600,
		width: isDev ? 1000 : 500,
	});

	//Open dev tools if on dev env
	if (isDev) {
		mainWindow.webContents.openDevTools();
	}
	mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
};

app.whenReady().then(() => {
	createMainWindow();
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
	});
});

// close the application

app.on('window-all-closed', () => {
	if (!isMac) app.quit();
});
