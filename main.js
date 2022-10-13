const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');
const resizeImg = require('resize-img');

// Variable for my different operating system
const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';

/**
 * Create the main function window to launch the application
 */

let mainWindow;

const createMainWindow = () => {
	mainWindow = new BrowserWindow({
		title: 'Image Resizer',
		height: 600,
		width: isDev ? 1000 : 500,
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: true,
			preload: path.join(__dirname, 'preload.js'),
		},
	});

	//Open dev tools if on dev env
	if (isDev) {
		mainWindow.webContents.openDevTools();
	}
	mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
};

const createAboutWindow = () => {
	const aboutWindow = new BrowserWindow({
		title: 'About',
		height: 300,
		width: 300,
	});
	aboutWindow.loadFile(path.join(__dirname, './renderer/about.html'));
};

app.whenReady().then(() => {
	createMainWindow();
	// Implement Menu
	const mainMenu = Menu.buildFromTemplate(menu);
	Menu.setApplicationMenu(mainMenu);
	// remove mainWindow from memory onclose
	mainWindow.on('closed', () => (mainWindow = null));
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
	});
});
// Create Menu template
const menu = [
	...(isMac
		? [
				{
					label: app.name,
					submenu: [
						{
							label: 'About',
							click: createAboutWindow,
						},
					],
				},
		  ]
		: []),
	{
		label: 'File',
		submenu: [
			{
				label: 'Quit',
				click: () => app.quit(),
				accelerator: 'CmdOrCTRL+W',
			},
		],
	},

	...(!isMac
		? [
				{
					label: 'Help',
					submenu: [
						{
							label: 'About',
							click: createAboutWindow,
						},
					],
				},
		  ]
		: []),
];

// repond to ipc renderer
ipcMain.on('image:resize', (e, options) => {
	options.dest = path.join(os.homedir() + '/Desktop', 'imageresizer');
	resizeImage(options);
});
const resizeImage = async ({ imgPath, width, height, dest }) => {
	try {
		const newPath = await resizeImg(fs.readFileSync(imgPath), {
			width: +width,
			height: +height,
		});
		// Create filename
		const filename = path.basename(imgPath);

		// create dest folder if not exist
		if (!fs.existsSync(dest)) {
			fs.mkdirSync(dest);
		}
		// write file to dest
		fs.writeFileSync(path.join(dest, filename), newPath);

		// send success to render
		mainWindow.webContents.send('image:saved');
		// open the dest folder
		shell.openPath(dest);
	} catch (error) {
		console.log(error);
	}
};
// close the application

app.on('window-all-closed', () => {
	if (!isMac) app.quit();
});
