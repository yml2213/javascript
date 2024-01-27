/*
苏泊尔会员中心  小程序 
cron 10 7 * * *  sbr.js

7.13   		完成 签到, 偷大米, 浏览菜谱 任务
10.11		更新抽奖
12.24		改用 yml2213-utils 依赖

------------------------  青龙--配置文件-贴心复制区域  ---------------------- 
# 苏泊尔
export sbr=" token & cookie @ token & cookie "

抓  api/login/auto-login  中的参数   token   跟cookie
多账号用 换行 或 @ 分割

报错的自己下载 utils.js  放在脚本同级目录下
报错的自己下载 utils.js  放在脚本同级目录下
报错的自己下载 utils.js  放在脚本同级目录下

tg频道: https://t.me/yml2213_tg  

*/

const $ = new Env("苏泊尔");
const alias_name = "sbr";
const utils = require("yml2213-utils");

const notify = $.isNode() ? require("./sendNotify") : "";
const Notify = 1; 			//0为关闭通知,1为打开通知,默认为1
//---------------------------------------------------------------------------------------------------------
let ckStr = process.env[alias_name];
let msg, ck;
let ck_status = 1;
//---------------------------------------------------------------------------------------------------------
let VersionCheck = "0.4";
let Change = "\n报错的自己下载 yml2213-utils 依赖";
let thank = `\n感谢 心雨大佬脚本\n`;
//---------------------------------------------------------------------------------------------------------

async function tips(ckArr) {
	// let Version_latest = await Version_Check(alias_name, '1');
	let Version = `\n📌 本地脚本: V ${VersionCheck}`;
	DoubleLog(`${Version}\n📌 🆙 更新内容: ${Change}`);
	// DoubleLog(`${thank}`);
	await utils.yiyan()
	DoubleLog(`\n========== 共找到 ${ckArr.length} 个账号 ==========`);
}

async function start() {
	const sbr = new Sbr(ck[0], ck[1]);
	await sbr.init("初始化");
	await sbr.login("登录刷新");
	await sbr.user_info("用户信息");
	if (ck_status) {
		await sbr.sign_info("签到查询");
		await sbr.task_list("任务列表");
		await sbr.prize_Info("抽奖信息");
		await sbr.get_index_info("获取可收取大米信息");
		await sbr.rice_num("查询大米数量");
	}
}

let host, hostname, apiname, sbr_hd, _id, _list, _id_list, num, collect_name;
class Sbr {
	constructor(token, cookie) {
		this.token = token;
		this.cookie = cookie;
	}
	// 初始化
	async init(name) {
		if (!name) {
			name = /function\s*(\w*)/i.exec(arguments.callee.toString())[1];
		}
		DoubleLog(`\n开始 ${name}`);
		host = "growrice.supor.com";
		hostname = "https://" + host;
		apiname = `${hostname}/rice/backend/public/index.php/api`
		sbr_hd = {
			"Content-Type": "application/x-www-form-urlencoded",
			'Host': this.host,
			'Cookie': this.cookie,
		}
	}

	// 登录    post
	async login(name) {
		let options = {
			method: "get",
			url: `${apiname}/login/auto-login?token=${this.token}`,
			headers: sbr_hd,
		};
		let result = await httpResult(name, options);
	}

	// 用户信息   httpGet
	async user_info(name) {

		let options = {
			method: "get",
			url: `${apiname}/users/get-user-info`,
			headers: sbr_hd,
		};
		let result = await httpResult(name, options);

		if (result.code == 1) {
			DoubleLog(`${name}: ${result.msg} , 欢迎 ${result.data.nickname}`);
			await utils.wait(2);
		} else if (result.code == 0) {
			DoubleLog(`${name}: ${result.msg}`);
			ck_status = 0
		} else {
			DoubleLog(`${name}: 失败 ❌ 了呢,原因未知!`);
			console.log(result);
			ck_status = 0
		}
	}

	// 签到信息   get
	async sign_info(name) {
		let options = {
			method: "get",
			url: `${apiname}/signIn/sign-list`,
			headers: sbr_hd,
		};
		let result = await httpResult(name, options);

		if (result.data.is_sign == false) {
			DoubleLog(`${name}: 未签到 ,去签到喽!`);
			await this.do_sign("签到")
		} else if (result.data.is_sign == true) {
			DoubleLog(`${name}: 已签到, 明天再来吧!`);
		} else {
			DoubleLog(`${name}: 失败 ❌ 了呢,原因未知!`);
			console.log(result);
		}
	}



	// 签到    post
	async do_sign(name) {
		let options = {
			method: "post",
			url: `${apiname}/signIn/sign`,
			headers: sbr_hd,
			body: `https://growrice.supor.com/rice/backend/public/index.php/api/signIn/sign`,
		};
		let result = await httpResult(name, options);

		if (result.code == 1) {
			DoubleLog(`${name}:${result.msg} ,获得 ${result.data.get_rice_num} 大米`);
			await utils.wait(3);

		} else if (result.code == 0) {
			DoubleLog(`${name}:${result.msg}`);
		} else {
			DoubleLog(`${name}: 失败❌了呢`);
			console.log(result);
		}
	}


	// 任务列表    get   
	async task_list(name) {
		let options = {
			method: "get",
			url: `${apiname}/task/index`,
			headers: sbr_hd,
		};
		let result = await httpResult(name, options);


		// console.log(result);
		if (result.code == 1) {
			DoubleLog(`${name}:${result.msg}`);
			let tasks = result.data
			for (let index = 0; index < tasks.length; index++) {
				let _id, name, is_finish
				[_id, name, is_finish] = [tasks[index].id, tasks[index].name, tasks[index].is_finish]

				if (_id == 6 && is_finish == false) {
					await this.get_rice("偷大米")
				} else if (_id == 6 && is_finish == true) {
					DoubleLog(`今天无法偷大米了, 明天再来吧!`)
				}
				if (_id == 8 && tasks[index].list[0].is_finish == false) {
					await this.browse_recipes("浏览菜谱")
				} else if (_id == 8 && tasks[index].list[0].is_finish == true) {
					DoubleLog(`今天完成 浏览菜谱 了, 明天再来吧!`)
				}


			}
		} else if (result.code == 0) {
			DoubleLog(`${name}:${result.msg}`);
		} else {
			DoubleLog(`${name}: 失败❌了呢`);
			console.log(result);
		}
	}

	// 偷好友大米
	async get_rice(name) {
		await this.get_id("获取好友大米id")
		for (let index = 0; index < _id_list.length; index++) {
			let _id = _id_list[index]
			let options = {
				method: "post",
				url: `${apiname}/users/get-rice`,
				headers: sbr_hd,
				body: `&friend_id=${_id}`,
			};
			let result = await httpResult(name, options);

			if (result.code == 1) {
				DoubleLog(`${name}:${result.msg} , 当前已有 ${result.data.sign_rice_num} 大米`);
				await utils.wait(5);
			} else if (result.code == 0) {
				DoubleLog(`${name}:${result.msg}`);
			} else {
				DoubleLog(`${name}: 失败❌了呢`);
				console.log(result);
			}

		}

	}


	// 获取好友大米id
	async get_id(name) {
		let options = {
			method: "get",
			url: `${apiname}/users/same-city-list`,
			headers: sbr_hd,
		};
		let result = await httpResult(name, options);

		// console.log(result);
		if (result.code == 1) {
			_list = result.data
			// console.log(_list);

			let arr1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
			let out = [];
			for (let i = 0; i < 3; i++) {
				var index = parseInt(Math.random() * arr1.length);
				out = out.concat(arr1.splice(index, 1));
			}
			// console.log(out);
			_id_list = []
			for (let index = 0; index < out.length; index++) {
				let _id = _list[out[index]].id
				_id_list.push(_id)
			}
			// console.log(_id_list);

			return _id_list;
		} else {
			DoubleLog(`${name}: 失败❌了呢`);
			console.log(result);
		}
	}

	// 浏览菜谱  https://growrice.supor.com/rice/backend/public/index.php/api/task/link-task
	async browse_recipes(name) {
		let options = {
			method: "post",
			url: `${apiname}/task/link-task`,
			headers: sbr_hd,
			body: `&id=8&other_id=3`,
		};
		let result = await httpResult(name, options);

		// console.log(result);
		if (result.code == 1) {
			DoubleLog(`${name}:${result.msg}`);
			await utils.wait(3)
		} else {
			DoubleLog(`${name}: 失败❌了呢`);
			console.log(result);
		}
	}

	// 获取可收取大米信息		get
	async get_index_info(name) {
		let options = {
			method: "get",
			url: `${apiname}/index/index`,
			headers: sbr_hd,
		};
		let result = await httpResult(name, options);

		// console.log(result);
		let rice_list = result.data.rice_list
		if (result.code == 1 && rice_list.length > 0) {
			for (let index = 0; index < rice_list.length; index++) {
				[_id, num, collect_name] = [rice_list[index].id, rice_list[index].num, rice_list[index].name]
				await this.collect_rice("收大米", _id, num, collect_name)
			}
		} else if (result.code == 1 && rice_list.length == 0) {
			DoubleLog(`${name}, 没有可以收获的大米`)

		} else if (result.code == 2) {
			DoubleLog(`${result['msg']}, 请自己先打开一次小程序,种大米后在执行脚本!`)
		} else {
			DoubleLog(`${name}: 失败❌了呢`);
			console.log(result);
		}
	}

	// 收大米
	async collect_rice(name, _id, num, collect_name) {
		let options = {
			method: "post",
			url: `${apiname}/index/collect-rice`,
			headers: sbr_hd,
			body: `&id=${_id}`,
		};
		let result = await httpResult(name, options);

		// console.log(result);
		if (result.code == 1) {
			DoubleLog(`${name}: 收取 ${collect_name} ${num} 大米, ${result.msg}`);
			await utils.wait(5)
		} else if (result.code == 0) {
			DoubleLog(`${name}: ${result.msg}`);
		} else {
			DoubleLog(`${name}: 失败❌了呢`);
			console.log(result);
		}
	}

	// 抽奖信息		get
	async prize_Info(name) {
		let options = {
			method: "get",
			url: `${apiname}/prize/index`,
			headers: sbr_hd,
		};
		let result = await httpResult(name, options);

		// console.log(result);
		if (result.code == 1) {
			DoubleLog(`${name}, 抽奖券${result.data.draw_num_1}张, 高级抽奖券${result.data.draw_num_2}张`)
			if (result.data.draw_num_1 > 0) {
				await this.prize('普通抽奖', '1')
			}
			if (result.data.draw_num_2 > 0) {
				await this.prize('高级抽奖', '2')
			}
			if (result.data.draw_num_1 == 0 && result.data.draw_num_2 == 0) {
				DoubleLog(`${name}：暂时无抽奖次数！`)
			}

		} else {
			DoubleLog(`${name}: 失败❌了呢`);
			console.log(result);
		}
	}

	// 抽奖  https://growrice.supor.com/rice/backend/public/index.php/api/prize/draw
	async prize(name, type) {
		let options = {
			method: "post",
			url: `${apiname}/prize/draw`,
			headers: sbr_hd,
			body: `cate=${type}`,
		};
		let result = await httpResult(name, options);

		// console.log(result);
		if (result.code == 1) {
			let prize_info = result.data.prize_info
			DoubleLog(`${name}: 获得 ${prize_info.prize_name} , 奖品id: ${prize_info.prize_id}, 奖品类型: ${prize_info.prize_type}, 奖品数量: ${prize_info.prize_value}`);
			await utils.wait(5)
			await this.prize_Info('抽奖信息')
		} else if (result.code == 0) {
			DoubleLog(`${name}: ${result.msg}`);
			await this.prize_Info('抽奖信息')
		} else {
			DoubleLog(`${name}: 失败❌了呢`);
			console.log(result);
		}
	}


	// 查询大米数量		get   https://growrice.supor.com/rice/backend/public/index.php/api/index/granary?&page=1&pagesize=10
	async rice_num(name) {
		let options = {
			method: "get",
			url: `${apiname}/index/granary?&page=1&pagesize=10`,
			headers: sbr_hd,
		};
		let result = await httpResult(name, options);

		// console.log(result);
		if (result.code == 1) {
			DoubleLog(`${name}, 现在有${result.data.rice_num} 大米 , 累计获取 ${result.data.total_num} 大米`)
		} else {
			DoubleLog(`${name}: 失败❌了呢`);
			console.log(result);
		}
	}


}















// #region ********************************************************  固定代码  ********************************************************

/**
 * 账号处理
 */
!(async () => {
	let ckArr = await utils.checkEnv(ckStr, alias_name);
	await tips(ckArr);
	for (let index = 0; index < ckArr.length; index++) {
		let num = index + 1;
		DoubleLog(`\n-------- 开始【第 ${num} 个账号】--------`);
		ck = ckArr[index].split("&");
		await start();
	}
	await SendMsg(msg);
})()
	.catch((e) => console.log(e))
	.finally(() => $.done());


	function Env(name, e) { class s { constructor(name) { this.env = name; } } return new (class { constructor(name) { (this.name = name), (this.logs = []), (this.startTime = new Date().getTime()), this.log(`\n🔔${this.name}, 开始!`); } isNode() { return "undefined" != typeof module && !!module.exports; } log(...name) { name.length > 0 && (this.logs = [...this.logs, ...name]), console.log(name.join(this.logSeparator)); } done() { const e = new Date().getTime(), s = (e - this.startTime) / 1e3; this.log(`\n🔔${this.name}, 结束! 🕛 ${s} 秒`); } })(name, e); } async function httpResult(name, options) { if (!name) { name = /function\s*(\w*)/i.exec(arguments.callee.toString())[1]; } try { let result = await utils.httpRequest(name, options); if (result) { return result; } { DoubleLog(`未知错误(1)`); } } catch (error) { console.log(error); } } async function SendMsg(message) { if (!message) return; if (Notify > 0) { if ($.isNode()) { var notify = require("./sendNotify"); await notify.sendNotify($.name, message); } else { console.log($.name, "", message); } } else { console.log(message); } } function wait(n) { return new Promise(function (resolve) { setTimeout(resolve, n * 1000); }); } function DoubleLog(data) { console.log(`    ${data}`); msg += `\n    ${data}`; }
//#endregion
