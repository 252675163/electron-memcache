const { ipcRenderer, remote } = window.require("electron");
// const TYPE = {
// 	FETCHLIST: "FETCHLIST"
// };
let main = null;
let client = null;
let configList = null;
// ipcRenderer.on("sConfigRes", function(event, type, res) {
// 	if (type === TYPE.FETCHLIST) {
// 		console.log(res);
// 	}
// });
// function setConfig(data) {
// 	ipcRenderer.send("cConfigChange", null, data);
// }
// function getConfig(type) {
// 	if (!TYPE[type]) throw new Error("需要符合TYPE值");
// 	return new Promise((resolve, reject) => {
// 		ipcRenderer.send("cGetConfigRequest", type);
// 	});
// }
window.onload = async function() {
	main = remote.require("./index");
	configList = main.getConfig().list;
	client = main.getClient({
		name: "开发用",
		con: "121.40.44.142:22222",
		username: "876c314522bd11e4",
		password: "gint_123"
	});
	let content = "";
	configList.forEach((item, index) => {
		let cont = `<li>
    <span index="${index}">名称：${item.name}|连接串：${item.con}</span>
    <a>编辑</a><a>删除</a>
    </li>`;
		content += cont;
	});
	document.getElementById("configlist").innerHTML = content;
};
