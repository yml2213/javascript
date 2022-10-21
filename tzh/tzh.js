/*
碳账户 小程序

cron 10 8,10,12 * * *  tzh.js

========= 青龙--配置文件--贴心复制区域  ========= 
# 碳账户
export tzh='Authorization' 

抓包 arbon-account-server.carbonstop.net  找到 Authorization 就行

10-21		完成基本任务， 自动提现

多账号用 换行 或 @ 分割
tg频道: https://t.me/yml2213_tg  
*/



const $ = new Env("碳账户");
check_utils("utils.js");
// const utils = require("./utils");
const ckName = "tzh";
//---------------------------------------------------------
const notify = $.isNode() ? require("./sendNotify") : "";
const Notify = 1; //0为关闭通知,1为打开通知,默认为1
let envSplitor = ["@", "\n"];
let ck = (msg = "");
let host, hostname, httpRequest;
let userCookie = process.env[ckName];
let userList = [];
let userIdx = 0;
let userCount = 0;
//---------------------------------------------------------

let text = (sign = "");
//---------------------------------------------------------

async function start() {

	for (let user of userList) {
		console.log("\n================== 用户信息 ==================\n");
		await user.user_info('用户信息')
		console.log("\n================== 任务列表 ==================\n");
		await user.task_list('任务列表')
		console.log("\n================== 库存 ==================\n");
		await user.goods('库存')

	}


}

class UserInfo {
	constructor(str) {
		this.index = ++userIdx;
		this.token = str;
	}


	async user_info(n) {
		let options = {
			method: "get",
			url: `https://carbon-account-server.carbonstop.net/user/info`,
			headers: {
				'authorization': this.token,
				'charset': 'utf-8',
				'content-type': 'application/json'
			},
		};
		let result = await httpResult(n, options);
		if (result.code == 200) {

			this.realName = result.data.realName
			this.mobile = result.data.mobile
			this.currScore = result.data.currScore
			this.totalScore = result.data.totalScore


			DoubleLog(`账号[${this.index}]  ${n}: ${this.realName}, 手机号${utils.phone_num(this.mobile)}, 当前${this.currScore}积分, 累计${this.totalScore}积分`);

		} else {
			DoubleLog(`账号[${this.index}]  ${n} 失败❌了呢`);
			console.log(result);
		}
	}

	async task_list(name) {
		let options = {
			method: "get",
			url: `https://carbon-account-server.carbonstop.net/task/list_new`,
			headers: {
				'authorization': this.token,
				'charset': 'utf-8',
				'content-type': 'application/json'
			}
		};

		let result = await httpResult(name, options);
		if (result.code == 200) {
			let tasks = result.data;
			// console.log(tasks);
			for (const task of tasks) {
				// console.log(task.taskList);
				for (const i of task.taskList) {
					console.log(i.sceneName);
					this.name = i.sceneName
					this.id = i.id
					this.sceneCode = i.sceneCode
					let num = utils.randomInt(10, 100)
					await this.do_task(this.name, this.id, this.sceneCode, num)
				}
			}

		} else {
			DoubleLog(`账号[${this.index}]  ${name} 失败❌了呢`);
			console.log(result);
		}
	}

	// 低碳出行 do_task
	async do_task(n, id, t, num) {
		if (id == 119) num == utils.randomInt(30, 50)  //双面打印
		if (id == 121) num == 1  //出差-自带洗漱用品
		if (id == 118) num == 2   //午休熄屏

		let options = {
			method: "post",
			url: `https://carbon-account-server.carbonstop.net/task/complete`,
			headers: {
				'authorization': this.token,
				'charset': 'utf-8',
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				"sceneCode": t,
				"value": num
			})

		};
		let result = await httpResult(n, options);
		if (result.code == 200) DoubleLog(`账号[${this.index}]  ${n}: ok`), await utils.wait(3);
		else if (result.code == 500) DoubleLog(`账号[${this.index}]  ${n}: ${result.msg}`);
		else DoubleLog(`账号[${this.index}]  ${n} 失败❌了呢`), console.log(result)

	}


	async goods(n) {
		let options = {
			method: "get",
			url: `https://carbon-account-server.carbonstop.net/mall/goods/page?pageNo=1&pageSize=10`,
			headers: {
				'authorization': this.token,
				'charset': 'utf-8',
				'content-type': 'application/json'
			},

		};
		let result = await httpResult(n, options);
		if (result.code == 200) {
			let tasks = result.data.list;
			// console.log(tasks);
			for (const task of tasks) {
				// console.log(task);
				this.goodsName = task.goodsName
				this.score = task.score
				this.id = task.id
				this.amount = task.amount
				this.usableAmount = task.usableAmount
				DoubleLog(`账号[${this.index}]  ${n}: ${this.goodsName}--${this.score}积分, 库存${this.amount}, 今日可兑换${this.usableAmount}次`);
				if (this.currScore >= 1000 && this.currScore < 2000 && this.usableAmount > 0 && this.amount > 0) {
					if (this.usableAmount == 2) {
						await this.cash(`提现${this.goodsName}`, this.id)
						await wait(5)
						await this.cash(`提现${this.goodsName}`, this.id)

					} else if (this.usableAmount == 1) {
						await this.cash(`提现${this.goodsName}`, this.id)
					}
				} else if (this.currScore >= 2000 && this.currScore < 29999 && this.usableAmount > 0 && this.amount > 0) {
					if (this.usableAmount == 2) {
						await this.cash(`提现${this.goodsName}`, this.id)
						await wait(5)
						await this.cash(`提现${this.goodsName}`, this.id)

					} else if (this.usableAmount == 1) {
						await this.cash(`提现${this.goodsName}`, this.id)
					}
				} else {
					DoubleLog(`您只有${this.currScore}积分，攒攒再来吧！`)
				}
			}

		} else {
			DoubleLog(`账号[${this.index}]  ${n} 失败❌了呢`);
			console.log(result);
		}
	}

	async cash(n, id) {
		let options = {
			method: "post",
			url: `https://carbon-account-server.carbonstop.net/mall/order`,
			headers: {
				'authorization': this.token,
				'charset': 'utf-8',
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				"amount": 1,
				"goodsId": id
			})

		};
		let result = await httpResult(n, options);
		if (result.code == 200) {
			DoubleLog(`账号[${this.index}]  ${n}: ${result.msg}`);
		} else {
			DoubleLog(`账号[${this.index}]  ${n} 失败❌了呢`);
			console.log(result);
		}
	}
}






!(async () => {
	if (!(await checkEnv())) return;
	if (userList.length > 0) {
		await start();
	}
	await SendMsg(msg);
})()
	.catch((e) => console.log(e))
	.finally(() => $.done());

///////////////////////////////////////////////////////////////////

// #region ********************************************************  固定代码  ********************************************************

// 变量检查与处理
async function checkEnv() {
	if (userCookie) {
		// console.log(userCookie);
		let e = envSplitor[0];
		for (let o of envSplitor)
			if (userCookie.indexOf(o) > -1) {
				e = o;
				break;
			}
		for (let n of userCookie.split(e)) n && userList.push(new UserInfo(n));
		userCount = userList.length;
	} else {
		console.log("未找到CK");
		return;
	}
	return console.log(`共找到${userCount}个账号`), !0;
}


function Env(name, e) { class s { constructor(name) { this.env = name; } } return new (class { constructor(name) { (this.name = name), (this.logs = []), (this.startTime = new Date().getTime()), this.log(`\n🔔${this.name}, 开始!`); } isNode() { return "undefined" != typeof module && !!module.exports; } log(...name) { name.length > 0 && (this.logs = [...this.logs, ...name]), console.log(name.join(this.logSeparator)); } done() { const e = new Date().getTime(), s = (e - this.startTime) / 1e3; this.log(`\n🔔${this.name}, 结束! 🕛 ${s} 秒`); } })(name, e); } async function httpResult(name, options) { if (!name) { name = /function\s*(\w*)/i.exec(arguments.callee.toString())[1]; } try { let result = await utils.httpRequest(name, options); if (result) { return result; } { DoubleLog(`未知错误(1`); } } catch (error) { console.log(error); } } async function SendMsg(message) { if (!message) return; if (Notify > 0) { if ($.isNode()) { var notify = require("./sendNotify"); await notify.sendNotify($.name, message); } else { console.log($.name, "", message); } } else { console.log(message); } } function wait(n) { return new Promise(function (resolve) { setTimeout(resolve, n * 1000); }); } function DoubleLog(data) { console.log(`    ${data}`); msg += `\n    ${data}`; } async function check_utils(file_name) { await check(file_name); try { utils = require("./utils"); return utils; } catch (error) { console.log(error); } async function check(file_name) { const fs = require("fs"); const path = require("path"); dirPath = path.resolve(__dirname); let files = fs.readdirSync(dirPath); if (files.indexOf(file_name) > -1) { console.log(`当前目录 [${dirPath}] 依赖 ${file_name} 文件状态正常!`); utils = require("./utils"); return utils; } else { console.log(`当前目录 [${dirPath}] 未找到 ${file_name} , 将下载到该目录!`); write_utils(file_name); } function write_utils(file_name) { var request = require("request"); var options = { method: "GET", url: "https://raw.gh.fakev.cn/yml2213/javascript/master/utils.js", headers: {}, }; request(options, function (error, response) { if (error) throw new Error(error); text = response.body; fs.writeFile(`${dirPath}/${file_name}`, text, `utf-8`, (err) => { if (err) { console.log(`目录 [${dirPath}]  ${file_name} 文件 写入失败`); } console.log(`\n目录 [${dirPath}]  ${file_name} 文件写入成功\n请再次运行脚本!\n请再次运行脚本!\n请再次运行脚本!`); }); }); } } }

//#endregion
