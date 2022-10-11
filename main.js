const { app, BrowserWindow } = require('electron');
const path = require('path');

/**
 * Create the main function window to launch the application
 */

const createMainWindow = () => {
	const mainWindow = new BrowserWindow({
		title: 'Image Resizer',
		height: 600,
		width: 500,
	});

	mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
};

app.whenReady().then(() => {
	createMainWindow();
});
