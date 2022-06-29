/**
 * 脚本地址:  https://raw.githubusercontent.com/yml2213/javascript/master/dygy/dygy.js
 * 转载请留信息,谢谢
 * cron 10 8,12,17, * * *  yml2213_javascript_master/dygy.js
 *
 * 
 * 抖音果园   入口：抖音点击"我"- "抖音商城" - "果园"   有的号可能没有 ,暂时不知道原因
 * 3-29    	签到任务、新手彩蛋、每日免费领水滴、三餐礼包、宝箱、盒子领取  初步完成   脚本刚写完,难免有bug,请及时反馈  ；ck有效期测试中 
 * 3-29-2  	更改签到逻辑 , 修复每天免费水滴bug
 * 3-30    	修改整体逻辑,简化通知
 * 3-30-2  	修复时间判断bug,增加脚本版本号（一半功能）
 * 3-31    	修复选择宝箱bug,默认开启debug模式,方便排错,不需要的自觉行关闭
 * 4-1     	修复几个循环bug,关闭默认debug模式
 * 6-19		更新模板
 * 6-29		优化错误处理(测试下)
 *
 * 感谢所有测试人员
 * ========= 青龙--配置文件 =========
 * 变量格式: export dygy_data='cookie @ cookie'   ,多账号用 换行 或 @ 分割
抓 minigame.zijieapi.com  的包  浇一次水即可获取ck 
 * ====================================
 * tg频道: https://t.me/yml2213_tg  
 * tg群组: https://t.me/yml_tg    
 * 
 */

const $ = new Env("抖音果园");
const notify = $.isNode() ? require("./sendNotify") : "";
const Notify = 1 		//0为关闭通知,1为打开通知,默认为1
const debug = 0			//0为关闭调试,1为打开调试,默认为0
//---------------------------------------------------------------------------------------------------------
let ckStr = ($.isNode() ? process.env.dygy_data : $.getdata('dygy_data')) || '';
let msg, ck;
let ck_status = true;
let host = 'minigame.zijieapi.com';
let hostname = 'https://' + host;
let watering_unm = 1;
//---------------------------------------------------------------------------------------------------------
let VersionCheck = "1.1.1"
let Change = '变量名字记得换成 dygy_data !'
let thank = `\n感谢 xx 的投稿\n`
//---------------------------------------------------------------------------------------------------------

async function tips(ckArr) {
	let Version_latest = await Version_Check('dygy');
	let Version = `\n📌 本地脚本: V 1.1.1  远程仓库脚本: V ${Version_latest}`
	DoubleLog(`${Version}\n📌 🆙 更新内容: ${Change}`);
	// DoubleLog(`${thank}`);
	await wyy();
	DoubleLog(`\n========== 共找到 ${ckArr.length} 个账号 ==========`);
	debugLog(`【debug】 这是你的账号数组:\n ${ckArr}`);
}


!(async () => {
	let ckArr = await Variable_Check(ckStr, "dygy_data");
	await tips(ckArr);
	for (let index = 0; index < ckArr.length; index++) {
		let num = index + 1;
		DoubleLog(`\n-------- 开始【第 ${num} 个账号】--------`);
		ck = ckArr[index].split("&");
		debugLog(`【debug】 这是你第 ${num} 账号信息:\n ${ck}`);

		dy_headers = {
			"Accept": "*/*",
			"Accept-Encoding": "gzip, deflate, br",
			"Accept-Language": "zh-CN,zh-Hans;q=0.9",
			"Connection": "keep-alive",
			"Content-Type": "application/json",
			"Cookie": ck[0],
			"Host": "minigame.zijieapi.com",
			"Referer": "https://tmaservice.developer.toutiao.com/?appid=tte684903979bdf21a02&version=1.0.1",
			"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 BytedanceWebview/d8a21c6 Aweme/19.9.0 Mobile ToutiaoMicroApp/2.44.1.0"
		}
		await start();
	}
	await SendMsg(msg);

})()
	.catch((e) => $.logErr(e))
	.finally(() => $.done());


async function start() {

	console.log("\n开始 首页信息");
	await polling_info();

	if (ck_status) {
		console.log('\n开始 获取任务列表');
		await tasks_list();

		console.log('\n开始 戳鸭子');
		await touch_Duck();

		console.log('\n开始 浇水');
		await watering();
	}

}






/**
 * 首页信息    httpGet  
 */
async function polling_info() {
	try {
		let Option = {
			url: `${hostname}/ttgame/game_orchard_ecom/polling_info`,
			headers: dy_headers,
		};
		let result = await httpGet(Option, `首页信息`);

		if (result.status_code == 0) {
			if (result.data.show_info.show_green_gift == true) {
				DoubleLog(`\n开始 新手彩蛋`);
				await newcomer_egg();
			}
			if (result.data.red_points.sign) {
				DoubleLog(`开始 七日签到`);
				await sign_in();
				DoubleLog(`选择金宝箱【宝箱挑战】`);
				await choose_gold();
				DoubleLog('开始 【收集瓶子水滴】');
				await water_bottle();

			}
			if (result.data.red_points.box) {
				if (result.data.red_points.box.rounds != 0 && result.data.red_points.box.times == 0) {
					DoubleLog(`开盒子 box `);
					await open_box();
				}
			}
			if (result.data.show_info.show_challenge == true) {
				if (result.data.red_points.challenge.times == 0) {
					DoubleLog(`开宝箱`);
					await open_challenge();
				}
			}
			if (result.data.show_info.show_nutrient) {
				DoubleLog(`展示 养分 牌子,化肥功能已开启`);
				if (result.data.red_points.nutrient_sign) {
					DoubleLog(`开始 化肥签到`);
					await fertilizer_sign();
				}
				if (result.data.fertilizer.normal != 0) {
					DoubleLog(`使用 正常 化肥`);
					await fertilizer_nomal();
				} else if (result.data.fertilizer.lite != 0) {
					DoubleLog(`使用 小袋 化肥`);
					await fertilizer_lite();
				}
			}
		} else {
			DoubleLog(`首页信息: 失败 ❌ 了呢,原因未知!`);
			console.log(result);
			return ck_status = false;
		}
	} catch (error) {
		console.log(error);
	}


}


/**
 * 获取任务列表
 */
async function tasks_list() {
	try {
		let Option = {
			url: `${hostname}/ttgame/game_orchard_ecom/tasks/list`,
			headers: dy_headers,
		};
		let result = await httpGet(Option, `获取任务列表`);

		if (result.status_code == 0) {
			DoubleLog(`获取任务列表: 成功了🎉  开始任务了鸭!`)
			tasksarr = result.data.tasks
			for (let value of tasksarr) {
				if (value.id == 1) {
					DoubleLog(`${value.name} 任务: 已完成${value.round_info.current_round}/${value.round_info.total_round} 次 `)
					if (value.round_info.current_round < value.round_info.total_round) {
						await Daily_free_water();
					}
				}
				if (value.id == 2) {   // 三餐任务
					// DoubleLog(`任务状态: 现在是 ${value.name} 时间\n `)
					n = local_hours();
					DoubleLog(`现在时间 ${n} 时`);
					if (n >= 8 && n <= 9) {
						DoubleLog('开始 【早餐礼包】');
						await eat_package('早餐');
					} else if (n >= 12 && n <= 14) {
						DoubleLog('开始 【午餐礼包】')
						await eat_package('午餐');
						await $.wait(2 * 1000);
					} else if (n >= 18 && n <= 21) {
						DoubleLog('开始 【晚餐礼包】')
						await eat_package('晚餐');
						await $.wait(2 * 1000);
					} else {
						DoubleLog(`三餐任务: 不在任务时间 ,跳过`);
					}
				}
			}
		} else {
			DoubleLog(`获取任务列表: 失败 ❌ 了呢,原因未知!`);
			console.log(result);
		}
	} catch (error) {
		console.log(error);
	}


}



/**
 * 浇水
 */
async function watering() {
	try {
		let Option = {
			url: `${hostname}/ttgame/game_orchard_ecom/tree/water?aid=1128`,
			headers: dy_headers,
		};
		let result = await httpGet(Option, `浇水`);

		if (result.status_code == 0) {

			DoubleLog(`第${watering_unm} 次浇水,${result.message} 🎉 `);
			await $.wait(5 * 1000);
			DoubleLog('等待判断是否有宝箱、盒子box可以领取');
			await polling_info();
			await $.wait(3 * 1000);
			watering_unm++

			if (result.data.kettle.water_num > 10) {
				await watering();
			} else {  // 浇水完成
				DoubleLog(`浇水 完成了 🎉 \n果树等级:${result.data.status}级\n升级进度:已浇水 ${result.data.progress.current} 次,${result.data.status}级共需要浇水 ${result.data.progress.target} ,你还有 ${result.data.kettle.water_num} 水滴:\n储水瓶: 已储存 ${result.data.bottle.water_num} 滴 ,领取时间:明天 ${result.data.bottle.availiable_time} 点 \n`)
			}
		} else if (result.status_code === 1008) {
			DoubleLog(`浇水: 失败 ,可能是: ${result.message}!`)
			DoubleLog(`等待3分钟,再次尝试浇水！`);
			await $.wait(3 * 60 * 1000);
			await watering();
		} else {
			DoubleLog(`浇水: 失败 ❌ 了呢,原因未知!`);
			console.log(result);
		}
	} catch (error) {
		console.log(error);
	}


}



/**
 * 戳鸭子
 */
async function touch_Duck() {
	try {
		let Option = {
			url: `${hostname}/ttgame/game_orchard_ecom/scene/touch?scene_id=1`,
			headers: dy_headers,
		};
		let result = await httpGet(Option, `戳鸭子`);

		if (result.status_code == 0) {
			let touch_Duck_status_max = result.data.red_point[0].round_info.total_round;
			let touch_Duck_status = result.data.red_point[0].round_info.current_round;
			if (touch_Duck_status < touch_Duck_status_max) {
				if (result.data.reward_item) {
					DoubleLog(`戳鸭子: 成功了🎉  获得 ${result.data.reward_item.num} 水滴 ,领取后后共有 ${result.data.kettle.water_num} 水滴!`);
					await wait(10);
					await touch_Duck();
				} else if (result.data.reward_item == null) {
					DoubleLog(`戳鸭子: 这次没有 ,等 3 秒下一次!`);
					await wait(3);
					await touch_Duck();
				}
			} else {
				DoubleLog(`鸭子不能给你水滴了,再去别的地方看看吧!`);
			}
		} else if (result.status_code == 1001) {
			DoubleLog(`戳鸭子: 鸭子不能给你水滴了,再去别的地方看看吧!`)
		} else {
			DoubleLog(`戳鸭子: 失败 ❌ 了呢,原因未知!`);
			console.log(result);
		}
	} catch (error) {
		console.log(error);
	}

}

/**
 * 选择金宝箱
 * https://minigame.zijieapi.com/ttgame/game_orchard_ecom/challenge/choose?task_id=2&os_version=12&version_code=210000&device_id=1869625912470847&iid=2063140836095230&app_name=aweme&device_platform=android&device_type=M2102J2SC&channel=xiaomi_1128_64&aid=1128&ac=wifi&version_name=21.0.0&update_version_code=21009900&scene=021008
 * 
 * https://minigame.zijieapi.com/ttgame/game_orchard_ecom/challenge/choose?task_id=2
 */
async function choose_gold() {
	try {
		let Option = {
			url: `${hostname}/ttgame/game_orchard_ecom/challenge/choose?task_id=2`,
			headers: dy_headers,
		};
		let result = await httpGet(Option, `选择金宝箱`);

		if (result.status_code == 0) {
			DoubleLog(`选择金宝箱: ${result.message}了鸭 🎉 `)
		} else if (result.status_code == 1001) {
			DoubleLog(`选择金宝箱: 失败 ,可能是: ${result.message}!`)
		} else {
			DoubleLog(`选择金宝箱: 失败 ❌ 了呢,原因未知!`);
			console.log(result);
		}
	} catch (error) {
		console.log(error);
	}

}



/**
 * 领取宝箱奖励
 */
async function open_challenge() {
	try {
		let Option = {
			url: `${hostname}/ttgame/game_orchard_ecom/challenge/reward?aid=1128`,
			headers: dy_headers,
		};
		let result = await httpGet(Option, `领取宝箱奖励`);

		// console.log(result);
		if (result.status_code == 0) {
			DoubleLog(`领取宝箱奖励: ${result.message}了鸭 🎉 , 获得 ${result.data.reward_item.num} 水滴 , 领取后有 ${result.data.kettle.water_num} 水滴 `)
		} else if (result.status_code == 1001) {
			DoubleLog(`领取宝箱奖励: 失败 ,可能是: ${result.message}!`)
		} else {
			DoubleLog(`领取宝箱奖励: 失败 ❌ 了呢,原因未知!`);
			console.log(result);
		}
	} catch (error) {
		console.log(error);
	}

}


/**
 * 领取盒子奖励
 */
async function open_box() {
	try {
		let Option = {
			url: `${hostname}/ttgame/game_orchard_ecom/box/open?aid=1128`,
			headers: dy_headers,
		};
		let result = await httpGet(Option, `领取盒子奖励`);

		if (result.status_code == 0) {
			DoubleLog(`领取盒子奖励: ${result.message}了鸭 🎉 , 获得 ${result.data.reward_item.num} 水滴 , 领取后有 ${result.data.kettle.water_num} 水滴 `)
		} else if (result.status_code == 1001) {
			DoubleLog(`领取盒子奖励: 失败 ,可能是: ${result.message}!`)
		} else {
			DoubleLog(`领取盒子奖励: 失败 ❌ 了呢,原因未知!`);
			console.log(result);
		}
	} catch (error) {
		console.log(error);
	}
}



/**
 * 使用小袋化肥
 */
async function fertilizer_lite() {
	try {
		let Option = {
			url: `${hostname}/ttgame/game_orchard_ecom/use/fertilizer?fertilizer_type=4`,
			headers: dy_headers,
		};
		let result = await httpGet(Option, `使用小袋化肥`);

		if (result.status_code == 0) {
			DoubleLog(`使用小袋化肥: ${result.message}了鸭 🎉 ,当前肥力 ${result.data.nutrient} 养分 ,剩余正常化肥 ${result.data.fertilizer.normal} 袋、小袋化肥 ${result.data.fertilizer.lite} 袋 `)
		} else if (result.status_code == 1001) {
			DoubleLog(`使用小袋化肥: 失败 ,可能是: ${result.message}!`)
		} else {
			DoubleLog(`使用小袋化肥: 失败 ❌ 了呢,原因未知!`);
			console.log(result);
		}
	} catch (error) {
		console.log(error);
	}
}

/**
 * 收集瓶子水滴
 */
async function water_bottle() {
	try {
		let Option = {
			url: `${hostname}/ttgame/game_orchard_ecom/water_bottle/reward?aid=1128`,
			headers: dy_headers,
		};
		let result = await httpGet(Option, `收集瓶子水滴`);

		if (result.status_code == 0) {
			DoubleLog(`收集瓶子水滴: ${result.message}了鸭 🎉 , 获得 ${result.data.task.reward_item.num} 水滴 , 收集瓶子水滴后共有 ${result.data.kettle.water_num} 水滴 `)
			await wait(3);
		} else if (result.status_code == 1001) {
			DoubleLog(`收集瓶子水滴: ,可能是: ${result.message}!`)
		} else {
			DoubleLog(`收集瓶子水滴: 失败 ❌ 了呢,原因未知!`);
			console.log(result);
		}
	} catch (error) {
		console.log(error);
	}
}


/**
 * 化肥签到
 */
async function fertilizer_sign() {
	try {
		let Option = {
			url: `${hostname}/ttgame/game_orchard_ecom/nutrient/sign_in`,
			headers: dy_headers,
		};
		let result = await httpGet(Option, `化肥签到`);

		if (result.status_code == 0) {
			DoubleLog(`化肥签到: ${result.message}了鸭 🎉 , 获得 ${result.sign.reward_item.name} ${result.sign.reward_item.num} 袋`)
		} else if (result.status_code == 1001) {
			DoubleLog(`化肥签到: ,可能是: ${result.message}!`)
		} else {
			DoubleLog(`化肥签到: 失败 ❌ 了呢,原因未知!`);
			console.log(result);
		}
	} catch (error) {
		console.log(error);
	}
}



/**
 * 七天签到
 */
async function sign_in() {
	try {
		let Option = {
			url: `${hostname}/ttgame/game_orchard_ecom/sign_in/reward`,
			headers: dy_headers,
		};
		let result = await httpGet(Option, `七天签到`);

		if (result.status_code == 0) {
			DoubleLog(`七天签到: ${result.message}了鸭 🎉 , 获得 ${result.data.task.reward_item.num} 水滴 , 签到后共有 ${result.data.kettle.water_num} 水滴`)
		} else if (result.status_code == 1001) {
			DoubleLog(`七天签到: ,可能是: ${result.message}!`)
		} else {
			DoubleLog(`七天签到: 失败 ❌ 了呢,原因未知!`);
			console.log(result);
		}
	} catch (error) {
		console.log(error);
	}
}


/**
 * 每日免费领水滴
 */
async function Daily_free_water() {
	try {
		let Option = {
			url: `${hostname}/ttgame/game_orchard_ecom/tasks/reward?task_id=1`,
			headers: dy_headers,
		};
		let result = await httpGet(Option, `每日免费领水滴`);

		if (result.status_code == 0) {
			DoubleLog(`每日免费领水滴: ${result.message}了鸭 🎉 , 获得 ${result.data.task.reward_item.num} 水滴 , 冷却时间 ${result.data.task.reward_item.time} 秒`);
			await wait(310);
			await Daily_free_water();
		} else if (result.status_code == 1001) {
			DoubleLog(`每日免费领水滴: ,可能是: ${result.message}!`)
		} else {
			DoubleLog(`每日免费领水滴: 失败 ❌ 了呢,原因未知!`);
			console.log(result);
		}
	} catch (error) {
		console.log(error);
	}
}



/**
 * 新手彩蛋
 */
async function newcomer_egg() {
	try {
		let Option = {
			url: `${hostname}/ttgame/game_orchard_ecom/green_gift/reward?aid=1128`,
			headers: dy_headers,
		};
		let result = await httpGet(Option, `新手彩蛋`);

		if (result.status_code == 0) {
			DoubleLog(`新手彩蛋: 砸蛋成功了鸭🎉 ,获得水滴${result.data.reward_item.num} 个 , 领取后后共有 ${result.data.kettle.water_num} 水滴 ,等待 6 分钟,等下一个彩蛋孵化鸭!`);
			await wait(310);
		} else if (result.status_code == 1001) {
			DoubleLog(`新手彩蛋: ,可能是: ${result.message}!`)
		} else {
			DoubleLog(`新手彩蛋: 失败 ❌ 了呢,原因未知!`);
			console.log(result);
		}
	} catch (error) {
		console.log(error);
	}
}


/**
 * 三餐礼包
 */
async function eat_package(name) {
	try {
		let Option = {
			url: `${hostname}/ttgame/game_orchard_ecom/tasks/reward?task_id=2`,
			headers: dy_headers,
		};
		let result = await httpGet(Option, `三餐礼包`);

		if (result.status_code == 0) {
			DoubleLog(`${name}礼包: 领取成功了🎉 ,获得水滴${result.data.task.reward_item.num} 个 ,领取后后共有 ${result.data.kettle.water_num} 水滴`);
		} else if (result.status_code == 1001) {
			DoubleLog(`${name}礼包: ,可能是: ${result.message}!`)
		} else {
			DoubleLog(`${name}礼包: 失败 ❌ 了呢,原因未知!`);
			console.log(result);
		}
	} catch (error) {
		console.log(error);
	}
}


























// #region ********************************************************  固定代码  ********************************************************
/**
 * 变量检查
 */
async function Variable_Check(ck, Variables) {
	return new Promise((resolve) => {
		let ckArr = []
		if (ck) {
			if (ck.indexOf("@") !== -1) {

				ck.split("@").forEach((item) => {
					ckArr.push(item);
				});
			} else if (ck.indexOf("\n") !== -1) {

				ck.split("\n").forEach((item) => {
					ckArr.push(item);
				});
			} else {
				ckArr.push(ck);
			}
			resolve(ckArr)
		} else {
			console.log(` ${$.neme}:未填写变量 ${Variables} ,请仔细阅读脚本说明!`)
		}
	}
	)
}


/**
 * 获取远程版本
 * http://yml-gitea.ml:2233/yml/JavaScript-yml/raw/branch/master/${name}.js
 * https://raw.gh.fakev.cn/yml2213/javascript/master/${name}/${name}.js
 */
function Version_Check(name) {
	return new Promise((resolve) => {
		let url = {
			url: `https://raw.gh.fakev.cn/yml2213/javascript/master/${name}/${name}.js`,
		}
		$.get(url, async (err, resp, data) => {
			try {
				VersionCheck = resp.body.match(/VersionCheck = "([\d\.]+)"/)[1]
			} catch (e) {
				$.logErr(e, resp);
			} finally {
				resolve(VersionCheck)
			}
		}, timeout = 3)
	})
}

/**
 * 发送消息
 */
async function SendMsg(message) {
	if (!message) return;
	if (Notify > 0) {
		if ($.isNode()) {
			var notify = require("./sendNotify");
			await notify.sendNotify($.name, message);
		} else {
			// $.msg(message);
			$.msg($.name, '', message)
		}
	} else {
		console.log(message);
	}
}

/**
 * 双平台log输出
 */
function DoubleLog(data) {
	if (data) {
		console.log(`    ${data}`);
		msg += `\n    ${data}`;
	}
}

/**
 * 随机 数字 + 大写字母 生成
 */
function randomszdx(e) {
	e = e || 32;
	var t = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890",
		a = t.length,
		n = "";

	for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
	return n;
}


/**
 * 随机 数字 + 小写字母 生成
 */
function randomszxx(e) {
	e = e || 32;
	var t = "qwertyuioplkjhgfdsazxcvbnm1234567890",
		a = t.length,
		n = "";

	for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
	return n;
}




/**
 * 随机整数生成
 */
function randomInt(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}


/**
 * 时间戳 13位
 */
function ts13() {
	return Math.round(new Date().getTime()).toString();
}

/**
 * 时间戳 10位
 */
function ts10() {
	return Math.round(new Date().getTime() / 1000).toString();
}

/**
 * 获取当前小时数
 */
function local_hours() {
	let myDate = new Date();
	let h = myDate.getHours();
	return h;
}

/**
 * 获取当前分钟数
 */
function local_minutes() {
	let myDate = new Date();
	let m = myDate.getMinutes();
	return m;
}


/**
 * 获取当前年份 2022
 */
function local_year() {
	let myDate = new Date();
	y = myDate.getFullYear();
	return y;
}

/**
 * 获取当前月份(数字)  5月
 */
function local_month() {
	let myDate = new Date();
	let m = myDate.getMonth();
	return m;
}


/**
* 获取当前月份(数字)  05月 补零
*/
function local_month_two() {
	let myDate = new Date();
	let m = myDate.getMonth();
	if (m.toString().length == 1) {
		m = `0${m}`
	}
	return m;
}

/**
* 获取当前天数(数字)  5日  
*/
function local_day() {
	let myDate = new Date();
	let d = myDate.getDate();
	return d;
}


/**
* 获取当前天数  05日 补零
*/
function local_day_two() {
	let myDate = new Date();
	let d = myDate.getDate();
	if (d.toString().length == 1) {
		d = `0${d}`
	}
	return d;
}



/**
 * 等待 X 秒
 */
function wait(n) {
	return new Promise(function (resolve) {
		setTimeout(resolve, n * 1000);
	});
}


/**
 * 每日网抑云
 */
function wyy() {
	return new Promise((resolve) => {
		let url = {
			url: `http://ovooa.com/API/wyrp/api.php`,
		}
		$.get(url, async (err, resp, data) => {
			try {
				data = JSON.parse(data);
				// console.log(data);
				console.log(`网抑云时间: ${data.data.Content}  by--${data.data.Music}`)
				msg = `[网抑云时间]: ${data.data.Content}  by--${data.data.Music}`
				// DoubleLog(`[网抑云时间]: ${data.data.Content}  by--${data.data.Music}`);
			} catch (e) {
				$.logErr(e, resp);
			} finally {
				resolve()
			}
		}, timeout = 3)
	})
}

/**
 * get请求
 */
async function httpGet(getUrlObject, tip, timeout = 3) {
	return new Promise((resolve) => {
		let url = getUrlObject;
		if (!tip) {
			let tmp = arguments.callee.toString();
			let re = /function\s*(\w*)/i;
			let matches = re.exec(tmp);
			tip = matches[1];
		}
		if (debug) {
			console.log(`\n 【debug】=============== 这是 ${tip} 请求 url ===============`);
			console.log(url);
		}

		$.get(
			url,
			async (err, resp, data) => {
				try {
					if (debug) {
						console.log(`\n\n 【debug】===============这是 ${tip} 返回data==============`);
						console.log(data);
						console.log(`\n 【debug】=============这是 ${tip} json解析后数据============`);
						console.log(JSON.parse(data));
					}
					let result = JSON.parse(data);
					if (result == undefined) {
						return;
					} else {
						resolve(result);
					}

				} catch (e) {
					console.log(err, resp);
					console.log(`\n ${tip} 失败了!请稍后尝试!!`);
					msg = `\n ${tip} 失败了!请稍后尝试!!`
				} finally {
					resolve();
				}
			},
			timeout
		);
	});
}

/**
 * post请求
 */
async function httpPost(postUrlObject, tip, timeout = 3) {
	return new Promise((resolve) => {
		let url = postUrlObject;
		if (!tip) {
			let tmp = arguments.callee.toString();
			let re = /function\s*(\w*)/i;
			let matches = re.exec(tmp);
			tip = matches[1];
		}
		if (debug) {
			console.log(`\n 【debug】=============== 这是 ${tip} 请求 url ===============`);
			console.log(url);
		}

		$.post(
			url,
			async (err, resp, data) => {
				try {
					if (debug) {
						console.log(`\n\n 【debug】===============这是 ${tip} 返回data==============`);
						console.log(data);
						console.log(`\n 【debug】=============这是 ${tip} json解析后数据============`);
						console.log(JSON.parse(data));
					}
					let result = JSON.parse(data);
					if (result == undefined) {
						return;
					} else {
						resolve(result);
					}

				} catch (e) {
					console.log(err, resp);
					console.log(`\n ${tip} 失败了!请稍后尝试!!`);
					msg = `\n ${tip} 失败了!请稍后尝试!!`
				} finally {
					resolve();
				}
			},
			timeout
		);
	});
}

/**
 * 网络请求 (get, post等)
 */
async function httpRequest(postOptionsObject, tip, timeout = 3) {
	return new Promise((resolve) => {

		let Options = postOptionsObject;
		let request = require('request');
		if (!tip) {
			let tmp = arguments.callee.toString();
			let re = /function\s*(\w*)/i;
			let matches = re.exec(tmp);
			tip = matches[1];
		}
		if (debug) {
			console.log(`\n 【debug】=============== 这是 ${tip} 请求 信息 ===============`);
			console.log(Options);
		}

		request(Options, async (err, resp, data) => {
			try {
				if (debug) {
					console.log(`\n\n 【debug】===============这是 ${tip} 返回数据==============`);
					console.log(data);
					console.log(`\n 【debug】=============这是 ${tip} json解析后数据============`);
					console.log(JSON.parse(data));
				}
				let result = JSON.parse(data);
				if (!result) return;
				resolve(result);
			} catch (e) {
				console.log(err, resp);
				console.log(`\n ${tip} 失败了!请稍后尝试!!`);
				msg = `\n ${tip} 失败了!请稍后尝试!!`
			} finally {
				resolve();
			}
		}), timeout

	});
}


/**
 * debug调试
 */
function debugLog(...args) {
	if (debug) {
		console.log(...args);
	}
}



// /**
//  *  单名字 Env
//  */
// function Env() {
//     return new class {
//         isNode() {
//             return "undefined" != typeof module && !!module.exports
//         }
//     }()
// }


// md5
function MD5Encrypt(a) { function b(a, b) { return a << b | a >>> 32 - b } function c(a, b) { var c, d, e, f, g; return e = 2147483648 & a, f = 2147483648 & b, c = 1073741824 & a, d = 1073741824 & b, g = (1073741823 & a) + (1073741823 & b), c & d ? 2147483648 ^ g ^ e ^ f : c | d ? 1073741824 & g ? 3221225472 ^ g ^ e ^ f : 1073741824 ^ g ^ e ^ f : g ^ e ^ f } function d(a, b, c) { return a & b | ~a & c } function e(a, b, c) { return a & c | b & ~c } function f(a, b, c) { return a ^ b ^ c } function g(a, b, c) { return b ^ (a | ~c) } function h(a, e, f, g, h, i, j) { return a = c(a, c(c(d(e, f, g), h), j)), c(b(a, i), e) } function i(a, d, f, g, h, i, j) { return a = c(a, c(c(e(d, f, g), h), j)), c(b(a, i), d) } function j(a, d, e, g, h, i, j) { return a = c(a, c(c(f(d, e, g), h), j)), c(b(a, i), d) } function k(a, d, e, f, h, i, j) { return a = c(a, c(c(g(d, e, f), h), j)), c(b(a, i), d) } function l(a) { for (var b, c = a.length, d = c + 8, e = (d - d % 64) / 64, f = 16 * (e + 1), g = new Array(f - 1), h = 0, i = 0; c > i;)b = (i - i % 4) / 4, h = i % 4 * 8, g[b] = g[b] | a.charCodeAt(i) << h, i++; return b = (i - i % 4) / 4, h = i % 4 * 8, g[b] = g[b] | 128 << h, g[f - 2] = c << 3, g[f - 1] = c >>> 29, g } function m(a) { var b, c, d = "", e = ""; for (c = 0; 3 >= c; c++)b = a >>> 8 * c & 255, e = "0" + b.toString(16), d += e.substr(e.length - 2, 2); return d } function n(a) { a = a.replace(/\r\n/g, "\n"); for (var b = "", c = 0; c < a.length; c++) { var d = a.charCodeAt(c); 128 > d ? b += String.fromCharCode(d) : d > 127 && 2048 > d ? (b += String.fromCharCode(d >> 6 | 192), b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224), b += String.fromCharCode(d >> 6 & 63 | 128), b += String.fromCharCode(63 & d | 128)) } return b } var o, p, q, r, s, t, u, v, w, x = [], y = 7, z = 12, A = 17, B = 22, C = 5, D = 9, E = 14, F = 20, G = 4, H = 11, I = 16, J = 23, K = 6, L = 10, M = 15, N = 21; for (a = n(a), x = l(a), t = 1732584193, u = 4023233417, v = 2562383102, w = 271733878, o = 0; o < x.length; o += 16)p = t, q = u, r = v, s = w, t = h(t, u, v, w, x[o + 0], y, 3614090360), w = h(w, t, u, v, x[o + 1], z, 3905402710), v = h(v, w, t, u, x[o + 2], A, 606105819), u = h(u, v, w, t, x[o + 3], B, 3250441966), t = h(t, u, v, w, x[o + 4], y, 4118548399), w = h(w, t, u, v, x[o + 5], z, 1200080426), v = h(v, w, t, u, x[o + 6], A, 2821735955), u = h(u, v, w, t, x[o + 7], B, 4249261313), t = h(t, u, v, w, x[o + 8], y, 1770035416), w = h(w, t, u, v, x[o + 9], z, 2336552879), v = h(v, w, t, u, x[o + 10], A, 4294925233), u = h(u, v, w, t, x[o + 11], B, 2304563134), t = h(t, u, v, w, x[o + 12], y, 1804603682), w = h(w, t, u, v, x[o + 13], z, 4254626195), v = h(v, w, t, u, x[o + 14], A, 2792965006), u = h(u, v, w, t, x[o + 15], B, 1236535329), t = i(t, u, v, w, x[o + 1], C, 4129170786), w = i(w, t, u, v, x[o + 6], D, 3225465664), v = i(v, w, t, u, x[o + 11], E, 643717713), u = i(u, v, w, t, x[o + 0], F, 3921069994), t = i(t, u, v, w, x[o + 5], C, 3593408605), w = i(w, t, u, v, x[o + 10], D, 38016083), v = i(v, w, t, u, x[o + 15], E, 3634488961), u = i(u, v, w, t, x[o + 4], F, 3889429448), t = i(t, u, v, w, x[o + 9], C, 568446438), w = i(w, t, u, v, x[o + 14], D, 3275163606), v = i(v, w, t, u, x[o + 3], E, 4107603335), u = i(u, v, w, t, x[o + 8], F, 1163531501), t = i(t, u, v, w, x[o + 13], C, 2850285829), w = i(w, t, u, v, x[o + 2], D, 4243563512), v = i(v, w, t, u, x[o + 7], E, 1735328473), u = i(u, v, w, t, x[o + 12], F, 2368359562), t = j(t, u, v, w, x[o + 5], G, 4294588738), w = j(w, t, u, v, x[o + 8], H, 2272392833), v = j(v, w, t, u, x[o + 11], I, 1839030562), u = j(u, v, w, t, x[o + 14], J, 4259657740), t = j(t, u, v, w, x[o + 1], G, 2763975236), w = j(w, t, u, v, x[o + 4], H, 1272893353), v = j(v, w, t, u, x[o + 7], I, 4139469664), u = j(u, v, w, t, x[o + 10], J, 3200236656), t = j(t, u, v, w, x[o + 13], G, 681279174), w = j(w, t, u, v, x[o + 0], H, 3936430074), v = j(v, w, t, u, x[o + 3], I, 3572445317), u = j(u, v, w, t, x[o + 6], J, 76029189), t = j(t, u, v, w, x[o + 9], G, 3654602809), w = j(w, t, u, v, x[o + 12], H, 3873151461), v = j(v, w, t, u, x[o + 15], I, 530742520), u = j(u, v, w, t, x[o + 2], J, 3299628645), t = k(t, u, v, w, x[o + 0], K, 4096336452), w = k(w, t, u, v, x[o + 7], L, 1126891415), v = k(v, w, t, u, x[o + 14], M, 2878612391), u = k(u, v, w, t, x[o + 5], N, 4237533241), t = k(t, u, v, w, x[o + 12], K, 1700485571), w = k(w, t, u, v, x[o + 3], L, 2399980690), v = k(v, w, t, u, x[o + 10], M, 4293915773), u = k(u, v, w, t, x[o + 1], N, 2240044497), t = k(t, u, v, w, x[o + 8], K, 1873313359), w = k(w, t, u, v, x[o + 15], L, 4264355552), v = k(v, w, t, u, x[o + 6], M, 2734768916), u = k(u, v, w, t, x[o + 13], N, 1309151649), t = k(t, u, v, w, x[o + 4], K, 4149444226), w = k(w, t, u, v, x[o + 11], L, 3174756917), v = k(v, w, t, u, x[o + 2], M, 718787259), u = k(u, v, w, t, x[o + 9], N, 3951481745), t = c(t, p), u = c(u, q), v = c(v, r), w = c(w, s); var O = m(t) + m(u) + m(v) + m(w); return O.toLowerCase() }



// 完整 Env
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }

 //#endregion

