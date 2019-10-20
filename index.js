"use strict";
const path = require("path");
const { app, BrowserWindow, Menu, ipcMain } = require("electron");
/// const {autoUpdater} = require('electron-updater');
const { is } = require("electron-util");
const fs = require("fs");
const unhandled = require("electron-unhandled");
const debug = require("electron-debug");
const contextMenu = require("electron-context-menu");
const config = require("./config");
const menu = require("./menu");
const configOp = require("./main/configOp");
unhandled();
debug();
contextMenu();

// Note: Must match `build.appId` in package.json
app.setAppUserModelId("com.ted252675163.memcached");

// Uncomment this before publishing your first version.
// It's commented out as it throws an error if there are no published versions.
// if (!is.development) {
// 	const FOUR_HOURS = 1000 * 60 * 60 * 4;
// 	setInterval(() => {
// 		autoUpdater.checkForUpdates();
// 	}, FOUR_HOURS);
//
// 	autoUpdater.checkForUpdates();
// }

// Prevent window from being garbage collected
let mainWindow;
let client = null;
ipcMain.on("cConfigChange", function(event, data) {
	fs.writeFileSync("memConfig.json", JSON.stringify(data));
});
function a(res) {
	// mainWindow.webContents.send("sConfigRes", type, res);
	throw mainWindow.toString();
}
ipcMain.on("cGetConfigRequest", function(event, type) {
	let res = configOp.getConfig();
	a(res);
});
ipcMain.on("cClientInit", function(event, config) {
	client = configOp.newClient(config);
});
function getClient(data) {
	// throw "23";
	if (!client) {
		client = configOp.newClient(data);
	}
	return client;
}
function getConfig() {
	return configOp.getConfig();
}
function editConfig(data) {
	fs.writeFileSync("memConfig.json", JSON.stringify(data));
}
const createMainWindow = async () => {
	const win = new BrowserWindow({
		title: app.getName(),
		show: false,
		width: 1024,
		height: 768,
		webPreferences: {
			nodeIntegration: true
		},
		enableRemoteModule: true
	});

	win.on("ready-to-show", () => {
		win.show();
	});

	win.on("closed", () => {
		// Dereference the window
		// For multiple windows store them in an array
		mainWindow = undefined;
	});

	await win.loadFile(path.join(__dirname, "./render/index.html"));

	return win;
};

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
	app.quit();
}

app.on("second-instance", () => {
	if (mainWindow) {
		if (mainWindow.isMinimized()) {
			mainWindow.restore();
		}

		mainWindow.show();
	}
});

app.on("window-all-closed", () => {
	if (!is.macos) {
		app.quit();
	}
});

app.on("activate", () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

(async () => {
	await app.whenReady();
	Menu.setApplicationMenu(menu);
	mainWindow = await createMainWindow();

	const favoriteAnimal = config.get("favoriteAnimal");
	// mainWindow.webContents.executeJavaScript(
	// 	`document.querySelector('header p').textContent = 'Your favorite animal is ${favoriteAnimal}'`
	// );
})();
module.exports = {
	getClient,
	getConfig,
	editConfig
};
