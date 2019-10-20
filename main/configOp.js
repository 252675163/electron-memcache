const fs = require("fs");
const { app, BrowserWindow, ipcMain } = require("electron");
ipcMain.on("settingsChange", function(event, data) {
	fs.writeFileSync("memConfig.json", JSON.stringify(data));
});

var memjs = require("memjs");

// mc.set("foo", "bar");
// mc.get("foo", function(err, value, key) {
// 	if (value != null) {
// 		console.log(value.toString());
// 	}
// });
// mc.delete();

function newClient(config) {
	return memjs.Client.create(config.con, {
		username: config.username ? config.username : undefined,
		password: config.password ? config.password : undefined
	});
}
function getConfig() {
	let stats = fs.existsSync("memConfig.json");
	if (!stats) {
		fs.writeFileSync("memConfig.json", JSON.stringify({ list: [] }));
		return { list: [] };
	} else {
		try {
			return JSON.parse(fs.readFileSync("memConfig.json"));
		} catch (error) {
			fs.writeFileSync("memConfig.json", JSON.stringify({ list: [] }));
			return { list: [] };
		}
	}
}
module.exports = {
	getConfig,
	newClient
};
