/**
 * 微笑趣泡 
 * cron 18 7 * * *  yml2213_javascript_master/wxwp.js
 * 
 * 微笑趣泡 微信小程序 
 * 3-27   签到任务 、 分享小程序  点赞 完成  有效期测试中 已稳定2天 
 * 感谢所有测试人员
 * ========= 青龙 =========
 * 变量格式：  export wxwpCookies='账号1 user_id的值 @ 账号2 user_id的值'  多个账号用 @分割 
 * bublysmile.com  关键词    user_id在body中   基本每个包都有变量
 * 
 * 还是不会的请百度或者群里求助：QQ群：884234287  tg：https://t.me/yml_tg
 */

const $ = new Env("微笑趣泡");
const notify = $.isNode() ? require('./sendNotify') : '';
const Notify = 1; //0为关闭通知，1为打开通知,默认为1
const debug = 0; //0为关闭调试，1为打开调试,默认为0


let wxwpCookies = ($.isNode() ? process.env.wxwpCookies : $.getdata('wxwpCookies')) || "";
let wxwpCookiesArr = [];
let msg = '';
let UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.18(0x1800123a) NetType/WIFI Language/zh_CN'
let request_url = {
	url: 'https://mspace.gmmc.com.cn/',
	headers: {
		"Accept-Encoding": "gzip,compress,br,deflate",
		"Connection": "keep-alive",
		// "Content-Length": "281",
		"Host": "bublysmile.com",
		"Referer": "https://servicewechat.com/wx386dc9241cd9f748/27/page-frame.html",
		"User-Agent": `${UA}`,
		"content-type": "application/x-www-form-urlencoded",
	},
	body: ''
}


!(async () => {

	if (!(await Envs()))  //多账号分割 判断变量是否为空  初步处理多账号
		return;
	else {

		console.log(
			`\n\n=========================================    脚本执行 - 北京时间(UTC+8)：${new Date(
				new Date().getTime() +
				new Date().getTimezoneOffset() * 60 * 1000 +
				8 * 60 * 60 * 1000
			).toLocaleString()} =========================================\n`);


		await wyy();
		await $.wait(2 * 1000);


		$.log(`\n=================== 共找到 ${wxwpCookiesArr.length} 个账号 ===================`)

		if (debug) {
			console.log(`【debug】 这是你的账号数组:\n ${wxwpCookiesArr}`);
		}

		if (debug) {
			console.log(`\n【debug】 这是你的UA数据:\n ${UA}\n`);
		}

		for (let index = 0; index < wxwpCookiesArr.length; index++) {


			let num = index + 1
			$.log(`\n========= 开始【第 ${num} 个账号】=========\n`)
			msg += `\n【第 ${num} 个账号】`
			let user_id = wxwpCookiesArr[index]
			if (debug) {
				console.log(`\n【debug】 这是你第 ${num} 账号信息:\n user_id:${user_id}\n`);
			}


			$.log('开始 【签到】')
			await sign(user_id);
			await $.wait(2 * 1000);


			$.log('开始 【分享小程序】')
			await ShareApplet(user_id)
			await $.wait(3 * 1000);


			$.log('开始 【获取笑点列表】')
			await getJokeList(user_id)
			await $.wait(2 * 1000);


			$.log('开始 【点赞笑点】')
			await addLikeRec(user_id)
			await $.wait(2 * 1000);


		}
		await SendMsg(msg);

	}

})()
	.catch((e) => $.logErr(e))
	.finally(() => $.done())

//#region 固定代码
// ============================================变量检查============================================ \\
async function Envs() {
	if (wxwpCookies) {
		if (wxwpCookies.indexOf("@") != -1) {
			wxwpCookies.split("@").forEach((item) => {
				wxwpCookiesArr.push(item);
			});
		} else {
			wxwpCookiesArr.push(wxwpCookies);
		}
	} else {
		$.log(`\n【${$.name}】：未填写变量 wxwpCookies`)
		return;
	}

	return true;
}

// ============================================发送消息============================================ \\
async function SendMsg(message) {
	if (!message)
		return;

	if (Notify > 0) {
		if ($.isNode()) {
			var notify = require('./sendNotify');
			await notify.sendNotify($.name, message);
		} else {
			$.msg(message);
		}
	} else {
		console.log(message);
	}
}

/**
 * 随机数生成
 */
function randomString(e) {
	e = e || 32;
	var t = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890",
		a = t.length,
		n = "";
	for (i = 0; i < e; i++)
		n += t.charAt(Math.floor(Math.random() * a));
	return n
}

/**
 * 随机整数生成
 */
function randomInt(min, max) {
	return Math.round(Math.random() * (max - min) + min)
}

//每日网抑云
function wyy(timeout = 3 * 1000) {
	return new Promise((resolve) => {
		let url = {
			url: `https://keai.icu/apiwyy/api`
		}
		$.get(url, async (err, resp, data) => {
			try {
				data = JSON.parse(data)
				$.log(`\n【网抑云时间】: ${data.content}  by--${data.music}`);

			} catch (e) {
				$.logErr(e, resp);
			} finally {
				resolve()
			}
		}, timeout)
	})
}

//#endregion




/**
 * 签到
 * https://bublysmile.com/Cg/Itf/Java/CmnMisItf.jsp?ItfName=addTaskExecuteRec&method=GetSqlData
 */
function sign(user_id, timeout = 3 * 1000) {
	request_url.url = 'https://bublysmile.com/Cg/Itf/Java/CmnMisItf.jsp?ItfName=addTaskExecuteRec&method=GetSqlData'
	request_url.body = `user_id=${user_id}&task_key=CheckIn`



	return new Promise((resolve) => {

		if (debug) {
			console.log(`\n【debug】=============== 这是 签到 请求 url ===============`);
			console.log(request_url);
		}

		$.post(request_url, async (error, response, data) => {
			try {
				if (debug) {
					console.log(`\n\n【debug】===============这是 签到 返回data==============`);
					console.log(data)
				}
				let result = JSON.parse(data);
				if (result.IsSuccess == "1") {

					console.log(`\n【签到】成功了🎉 ，获得笑点${result.get_points} 个 ， 签到后共有 ${result.total_points} 个笑点， 既然生活那么苦了，那就多笑笑鸭！`)
					msg += `\n【签到】成功了🎉 ，获得笑点${result.get_points} 个 ， 签到后共有 ${result.total_points} 个笑点， 既然生活那么苦了，那就多笑笑鸭！`
					$.msg(`\n【签到】成功了🎉 ，获得笑点${result.get_points} 个 ， 签到后共有 ${result.total_points} 个笑点， 既然生活那么苦了，那就多笑笑鸭！`)

				} else if (result.IsSuccess === "0") {

					$.log(`\n【签到】 失败 ,可能是:签到 ${result.ErrMsg}!\n `)
					msg += `\n【签到】 失败 ,可能是:签到 ${result.ErrMsg}!\n`
					$.msg(`【${$.name}】 【签到】:签到 ${result.ErrMsg}`)

				} else {

					$.log(`\n【签到】 失败 ❌ 了呢,可能是网络被外星人抓走了!\n `)
					msg += `\n【签到】 失败 ❌ 了呢,可能是网络被外星人抓走了!\n`
					$.msg(`【${$.name}】 【签到】: 失败 ❌ 了呢,可能是网络被外星人抓走了!`)

				}

			} catch (e) {
				console.log(e)
			} finally {
				resolve();
			}
		}, timeout)
	})
}


/**
 * 分享小程序
 * https://bublysmile.com/Cg/Itf/Java/CmnMisItf.jsp?ItfName=addShareRec&method=GetSqlData
 */
function ShareApplet(user_id, timeout = 3 * 1000) {
	request_url.url = 'https://bublysmile.com/Cg/Itf/Java/CmnMisItf.jsp?ItfName=addShareRec&method=GetSqlData'
	request_url.body = `user_id=${user_id}&task_key=ShareApplet`

	return new Promise((resolve) => {

		if (debug) {
			console.log(`\n【debug】=============== 这是 分享小程序 请求 url ===============`);
			console.log(request_url);
		}

		$.post(request_url, async (error, response, data) => {
			try {
				if (debug) {
					console.log(`\n\n【debug】===============这是 分享小程序 返回data==============`);
					console.log(data)
				}
				let result = JSON.parse(data);
				if (result.overage) {

					console.log(`\n【分享小程序】成功了🎉 ，获得笑点${result.get_points} 个 ， 分享后共有 ${result.total_points} 个笑点， 既然生活那么苦了，那就多笑笑鸭！`)
					msg += `\n【分享小程序】成功了🎉 ，获得笑点${result.get_points} 个 ， 分享后共有 ${result.total_points} 个笑点， 既然生活那么苦了，那就多笑笑鸭！`
					$.msg(`\n【分享小程序】成功了🎉 ，获得笑点${result.get_points} 个 ， 分享后共有 ${result.total_points} 个笑点， 既然生活那么苦了，那就多笑笑鸭！`)

				} else {

					$.log(`\n【分享小程序】 失败 ❌ 了呢,可能已经分享过了或者网络被外星人抓走了!\n `)
					msg += `\n【分享小程序】 失败 ❌ 了呢,可能已经分享过了或者网络被外星人抓走了!\n`
					$.msg(`【${$.name}】 【分享小程序】 失败 ❌ 了呢,可能已经分享过了或者网络被外星人抓走了!`)

				}

			} catch (e) {
				console.log(e)
			} finally {
				resolve();
			}
		}, timeout)
	})
}




/**
 * 获取笑点列表
 * https://bublysmile.com/Cg/Itf/Java/CmnMisItf.jsp?ItfName=getJokeList&method=GetSqlData
 */
function getJokeList(user_id, timeout = 3 * 1000) {
	request_url.url = 'https://bublysmile.com/Cg/Itf/Java/CmnMisItf.jsp?ItfName=getJokeList&method=GetSqlData'
	request_url.body = `user_id=${user_id}&list_type=normal&CurPage=1&PageSize=10`

	return new Promise((resolve) => {

		if (debug) {
			console.log(`\n【debug】=============== 这是 获取笑点列表 请求 url ===============`);
			console.log(request_url);
		}

		$.post(request_url, async (error, response, data) => {
			try {
				if (debug) {
					console.log(`\n\n【debug】===============这是 获取笑点列表 返回data==============`);
					console.log(data)
					// console.log(`======`)
					// console.log(JSON.parse(data))

				}
				let result = JSON.parse(data);
				if (result.IsSuccess == "1") {

					console.log(`\n【获取笑点列表】成功了🎉 `)
					msg += `\n【获取笑点列表】成功了🎉  `
					$.msg(`\n【获取笑点列表】成功了🎉 `)

					console.log(`\n 请耐心等待 5 s\n`)
					await $.wait(5 * 1000);

					// 随机1-8 数字
					let num = randomInt(1, 8);
					if (debug) {
						console.log(`\n【debug】=============== 这是 随机数字 ===============`);
						console.log(num);
					}

					// 获取点赞笑点id joke_id
					joke_id = result.data[num].joke_id;
					if (debug) {
						console.log(`\n【debug】=============== 这是 你点赞的笑点 id ===============`);
						console.log(joke_id);
					}

					// 获取点赞笑点标题 joke_desc
					joke_desc = result.data[num].joke_desc;
					if (debug) {
						console.log(`\n【debug】=============== 这是 你点赞的笑点 标题 ===============`);
						console.log(joke_desc);
					}


				} else {

					$.log(`\n【获取笑点列表】 失败 ❌ 了呢,可能是网络被外星人抓走了!\n `)
					msg += `\n【获取笑点列表】 失败 ❌ 了呢,可能是网络被外星人抓走了!\n`
					$.msg(`【${$.name}】 【获取笑点列表】: 失败 ❌ 了呢,可能是网络被外星人抓走了!`)

				}

			} catch (e) {
				console.log(e)
			} finally {
				resolve();
			}
		}, timeout)
	})
}




/**
 * 点赞笑点
 * https://bublysmile.com/Cg/Itf/Java/CmnMisItf.jsp?ItfName=addLikeRec&method=GetSqlData
 */
function addLikeRec(user_id, timeout = 3 * 1000) {
	request_url.url = 'https://bublysmile.com/Cg/Itf/Java/CmnMisItf.jsp?ItfName=addLikeRec&method=GetSqlData'
	request_url.body = `user_id=${user_id}&joke_id=${joke_id}`


	return new Promise((resolve) => {

		if (debug) {
			console.log(`\n【debug】=============== 这是 点赞笑点 请求 url ===============`);
			console.log(request_url);
		}

		$.post(request_url, async (error, response, data) => {
			try {
				if (debug) {
					console.log(`\n\n【debug】===============这是 点赞笑点 返回data==============`);
					console.log(data)
					// console.log(`======`)
					// console.log(JSON.parse(data))
				}
				let result = JSON.parse(data);
				if (result.IsSuccess == "1") {

					console.log(`\n【点赞笑点】成功了🎉 ，获得笑点${result.get_points} 个 ， 点赞后共有 ${result.total_points} 个笑点， 既然生活那么苦了，那就多笑笑鸭！`)
					msg += `\n【点赞笑点】成功了🎉 ，获得笑点${result.get_points} 个 ， 点赞后共有 ${result.total_points} 个笑点， 既然生活那么苦了，那就多笑笑鸭！`
					$.msg(`\n【点赞笑点】成功了🎉 ，获得笑点${result.get_points} 个 ， 点赞后共有 ${result.total_points} 个笑点， 既然生活那么苦了，那就多笑笑鸭！`)

				} else if (result.IsSuccess === "0") {

					$.log(`\n 点赞笑点】 失败 ,可能是:签到 ${result.ErrMsg}!\n `)
					msg += `\n【点赞笑点】 失败 ,可能是:签到 ${result.ErrMsg}!\n`
					$.msg(`【${$.name}】 【点赞笑点】:签到 ${result.ErrMsg}`)

				} else {

					$.log(`\n【点赞笑点】 失败 ❌ 了呢,可能是网络被外星人抓走了!\n `)
					msg += `\n【点赞笑点】 失败 ❌ 了呢,可能是网络被外星人抓走了!\n`
					$.msg(`【${$.name}】 【点赞笑点】: 失败 ❌ 了呢,可能是网络被外星人抓走了!`)

				}

			} catch (e) {
				console.log(e)
			} finally {
				resolve();
			}
		}, timeout)
	})
}








// prettier-ignore
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }

