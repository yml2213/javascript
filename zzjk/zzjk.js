/*

2022.7.8

* 7-8		修改为Y 大佬代码 ,清自行修改变量

一天一次   
微信小程序   众安健康 
域名   https://ihealth.zhongan.com/
手动抓hd里的Access-Token和下面任务里面域名https://ihealth.zhongan.com/api/lemon/v1/applet/mgm/activity/add/award里面的Cookie
青龙变量格式: export ZAJK_token = 'Access-Token&Cookie'多账号直接换行即可

 */

const $ = new Env("众安健康");
const notify = $.isNode() ? require("./sendNotify") : "";
const Notify = 0; //0为关闭通知，1为打开通知,默认为1
const debug = 0; //0为关闭调试，1为打开调试,默认为0
//////////////////////

let ckStr = ($.isNode() ? process.env.ZAJK_token : $.getdata(`ZAJK_token`)) || '';

let msg = "";
let ck = "";
let G = '   修改为Y 大佬代码 ,清自行修改变量'
/////////////////////////////////////////////////////////
console.log(`${G}\n`);
msg += `${G}\n`;
/////////////////////////////////////////////////////////



async function tips(ckArr) {
	console.log(
		`\n脚本执行 - 北京时间(UTC+8): ${new Date(
			new Date().getTime() +
			new Date().getTimezoneOffset() * 60 * 1000 +
			8 * 60 * 60 * 1000
		).toLocaleString()} \n`
	);

	console.log(
		`\n=================== 共找到 ${ckArr.length} 个账号 ===================`
	);
	debugLog(`【debug】 这是你的账号数组:\n ${ckArr}`);
}

!(async () => {
	if (typeof $request !== "undefined") {
		await GetRewrite()
	} else {
		let ckArr = await getCks(ckStr, "ZAJK_token");

		await tips(ckArr);

		for (let index = 0; index < ckArr.length; index++) {
			let num = index + 1;
			console.log(`\n========= 开始【第 ${num} 个账号】=========\n`);
			// if (ckArr[index].match(/&/g)) {
			ck = ckArr[index].split("&");
			await all();
			//   }

			debugLog(`【debug】 这是你第 ${num} 账号信息:\n ${ck}`);

		}


	}
})()
	.catch((e) => $.logErr(e))
	.finally(() => $.done());


async function all() {


	header = {
		"Host": "ihealth.zhongan.com",
		"Connection": "keep-alive",
		"Content-Length": "65",
		"Access-Token": `${ck[0]}`,
		"Content-Type": "application/json",
		"Accept": "application/json",
		"Accept-Encoding": "gzip,compress,br,deflate",
		"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.23(0x1800172f) NetType/WIFI Language/zh_CN",
		"Referer": "https://servicewechat.com/wxbac45cc1588a5a75/210/page-frame.html"
	}

	S = `众安健康签到`
	if (S == `众安健康签到`) {
		await task(`post`, `https://ihealth.zhongan.com/api/lemon/v1/common/activity/signIn`, header, `{"activityCode":"ONA20220411001","channelCode":"c20195660470001"}`)
		console.log(`众安健康签到`)
		console.log(DATA)
		DD = RT(6000, 8000)
		console.log(`等待${DD}`);
		await $.wait(DD)

	}

	S = `众安健康任务单1`
	if (S == `众安健康任务单1`) {
		await task(`post`, `https://ihealth.zhongan.com/api/lemon/v1/common/activity/homePage`, header, `{"activityCode":"ONA20220411001","channelCode":"c20195660470001"}`)

		S = `任务1`
		if (S == `任务1`) {
			let gid1 = Object.keys(DATA.result.productRecommend)[0]
			header1 = {
				"Host": "ihealth.zhongan.com",
				"Content-Type": "application/json",
				"Origin": "https://ihealth.zhongan.com",
				"Accept-Encoding": "gzip, deflate, br",
				"Cookie": `${ck[1]}`,
				"Connection": "keep-alive",
				"Accept": "application/json",
				"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.23(0x1800172f) NetType/WIFI Language/zh_CN miniProgram/wxbac45cc1588a5a75",
				"Referer": "https://ihealth.zhongan.com/insure/gt?channelCode=1000000004&channelSource=T202203150201070094&goodsCode=G202202070005&iseeTap=Y&sign=dCoB-REYo5yOkcTKT632WA&version=V1&taskId=110&activityCode=ONA20220411001&&xflow_d_t_wv%3D%7B%22uid%22%3A%221654134428126-3515802-03f7ac8d0e12ac-76902524%22%2C%22trace_id%22%3A%221657177070748-5547940-033ce4500c92e78-11730460%22%2C%22session_id%22%3A%221657177070748-6532276-0eafe6476c23d4-16508133%22%2C%22session_time%22%3A%222022-07-07%2014%3A57%3A50%22%2C%22open_id%22%3A%22oPE7_0OZ10J-bQad06GflOPhiGR0%22%2C%22union_id%22%3A%22oDE5puPykR1Ql7uOZWGx3lqnVx5I%22%7D",
				"Content-Length": "103",
				"Accept-Language": "zh-cn"
			}
			console.log(`开始任务${gid1}`)
			await task(`post`, `https://ihealth.zhongan.com/api/lemon/v1/applet/mgm/activity/add/award`, header1, `{"activityCode":"ONA20220411001","channelCode":"1000000004","goodsCode":"${gid1}","taskId":"110"}`)
			console.log(DATA)
			DD = RT(6000, 8000)
			console.log(`等待${DD}`);
			await $.wait(DD)
		}

	}
	S = `众安健康任务单2`
	if (S == `众安健康任务单2`) {
		await task(`post`, `https://ihealth.zhongan.com/api/lemon/v1/common/activity/homePage`, header, `{"activityCode":"ONA20220411001","channelCode":"c20195660470001"}`)
		S = `任务2`
		if (S == `任务2`) {
			let gid1 = Object.keys(DATA.result.productRecommend)[1]
			console.log(`开始任务${gid1}`)
			await task(`post`, `https://ihealth.zhongan.com/api/lemon/v1/applet/mgm/activity/add/award`, header1, `{"activityCode":"ONA20220411001","channelCode":"1000000004","goodsCode":"${gid1}","taskId":"110"}`)
			console.log(DATA)
			DD = RT(6000, 8000)
			console.log(`等待${DD}`);
			await $.wait(DD)
		}

		S = `众安健康任务单3`
		if (S == `众安健康任务单3`) {
			await task(`post`, `https://ihealth.zhongan.com/api/lemon/v1/common/activity/homePage`, header, `{"activityCode":"ONA20220411001","channelCode":"c20195660470001"}`)
			S = `任务3`
			if (S == `任务3`) {
				let gid1 = Object.keys(DATA.result.productRecommend)[2]
				console.log(`开始任务${gid1}`)
				await task(`post`, `https://ihealth.zhongan.com/api/lemon/v1/applet/mgm/activity/add/award`, header1, `{"activityCode":"ONA20220411001","channelCode":"1000000004","goodsCode":"${gid1}","taskId":"110"}`)
				console.log(DATA)
				DD = RT(6000, 8000)
				console.log(`等待${DD}`);
				await $.wait(DD)
			}
		}
	}
	S = `众安健康领取奖励`
	if (S == `众安健康领取奖励`) {
		await task(`post`, `https://ihealth.zhongan.com/api/lemon/v1/common/activity/homePage`, header, `{"activityCode":"ONA20220411001","channelCode":"c20195660470001"}`)
		let rw1 = DATA.result.valuableRewardList[0]
		if (rw1 != undefined) {
			taskarr = DATA.result.valuableRewardList
			for (let i = 0; i < taskarr.length; i++) {
				let idnum = taskarr[i].awardDetailId
				console.log(`开始任务${idnum}`)
				await task(`post`, `https://ihealth.zhongan.com/api/lemon/v1/common/activity/lottery`, header, `{"channelCode":"c20195660470001","activityCode":"ONA20220411001","id":${idnum}}`)
				console.log(DATA)
			}
		}
	}

}




//#region 固定代码
// ============================================变量检查============================================ \\

async function getCks(ck, str) {
	return new Promise((resolve, reject) => {
		let ckArr = []
		if (ck) {
			if (ck.indexOf("\n") != -1) {
				ck.split("\n").forEach((item) => {
					ckArr.push(item);
				});
			} else {
				ckArr.push(ck);
			}
			resolve(ckArr)
		} else {
			console.log(`\n 【${$.name}】：未填写变量 ${str}`)
		}

	})
}

async function GetRewrite() { //member/userInfo/getLoginInfoSpecial

	if ($request.url.indexOf("member") > -1 && $request.url.indexOf("userInfo") > -1 && $request.url.indexOf("getLoginInfoSpecial") > -1) {
		cks = $request.body
		const ck = cks.split(`"ticket":"`)[1].split(`"`)[0]

		if (ckStr) {
			if (ckStr.indexOf(ck) == -1) {
				ckStr = ckStr + '\n' + ck
				$.setdata(ckStr, 'ZAJK_token');
				ckList = ckStr.split('\n')
				$.msg($.name + ` 获取第${ckList.length}个ck成功: ${ck}`)
			}
		} else {
			$.setdata(ck, 'ZAJK_token');
			$.msg($.name + ` 获取第1个ck成功: ${ck}`)
		}
	}
}

// ============================================发送消息============================================ \\

async function SendMsg(message) {
	if (!message) return;

	if (Notify > 0) {
		if ($.isNode()) {
			var notify = require("./sendNotify");
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

	for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
	return n;
}

/**
 * 随机整数生成
 */

function RT(X, Y) {
	do rt = Math.round(Math.random() * Y);
	while (rt < X)
	return rt;
}

//时间
nowTimes = new Date(
	new Date().getTime() +
	new Date().getTimezoneOffset() * 60 * 1000 +
	8 * 60 * 60 * 1000
);


//当前日期年月日+时间
//console.log('\n'+getCurrentDate());
function getCurrentDate() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
		" " + date.getHours() + seperator2 + date.getMinutes() +
		seperator2 + date.getSeconds();
	return currentdate;


}

//当前10位时间戳
function ts() {
	TS = Math.round((new Date().getTime() +
		new Date().getTimezoneOffset() * 60 * 1000 +
		8 * 60 * 60 * 1000) / 1000).toString();

	return TS;
};

function tss() {
	TS = Math.round(new Date().getTime() +
		new Date().getTimezoneOffset() * 60 * 1000 +
		8 * 60 * 60 * 1000).toString();
	return TS;
};

function task(method, taskurl, taskheader, taskbody) {
	return new Promise(async resolve => {
		let url = {
			url: taskurl,
			headers: taskheader,
			body: taskbody,
			timeout: 5000,
		}
		if (debug) {
			console.log(
				`\n 【debug】=============== 这是 ${S} 请求 url ===============`
			);
			console.log(url);
		}

		$[method](url, (err, resp, data) => {
			try {
				if (debug) {
					console.log(
						`\n\n 【debug】===============这是 ${S} 返回data==============`
					);
					console.log(data);
					console.log(`======`);
					console.log(JSON.parse(data));
				}
				if (err) {
					console.log(`${JSON.stringify(err)}`)
				} else {
					if (data) {
						if (data.indexOf(`<body>`) >= 0) {
							DATA = data
						} else {
							DATA = JSON.parse(data);
						}
					} else {
						console.log(`服务器返回数据为空`)
					}
				}
			} catch (e) {
				$.logErr(e, resp)
			} finally {
				resolve();
			}
		},

		)
	})
}
function debugLog(...args) {
	if (debug) {
		console.log(...args);
	}
}

/**
 * 当前年月日
 */
function nyr() {
	let date = new Date();
	Y = date.getFullYear() + '-';
	M = date.getMonth() + 1 + '-';
	D = date.getDate();
	let nyr = Y + M + D;
	return nyr;
}


function rrr() {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxxxxxxyxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
	});
	return uuid;
};



function Env(t, e) {
	"undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0);
	class s {
		constructor(t) {
			this.env = t
		}
		send(t, e = "GET") {
			t = "string" == typeof t ? {
				url: t
			} : t;
			let s = this.get;
			return "POST" === e && (s = this.post), new Promise((e, i) => {
				s.call(this, t, (t, s, r) => {
					t ? i(t) : e(s)
				})
			})
		}
		get(t) {
			return this.send.call(this.env, t)
		}
		post(t) {
			return this.send.call(this.env, t, "POST")
		}
	}
	return new class {
		constructor(t, e) {
			this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`)
		}
		isNode() {
			return "undefined" != typeof module && !!module.exports
		}
		isQuanX() {
			return "undefined" != typeof $task
		}
		isSurge() {
			return "undefined" != typeof $httpClient && "undefined" == typeof $loon
		}
		isLoon() {
			return "undefined" != typeof $loon
		}
		toObj(t, e = null) {
			try {
				return JSON.parse(t)
			} catch {
				return e
			}
		}
		toStr(t, e = null) {
			try {
				return JSON.stringify(t)
			} catch {
				return e
			}
		}
		getjson(t, e) {
			let s = e;
			const i = this.getdata(t);
			if (i) try {
				s = JSON.parse(this.getdata(t))
			} catch { }
			return s
		}
		setjson(t, e) {
			try {
				return this.setdata(JSON.stringify(t), e)
			} catch {
				return !1
			}
		}
		getScript(t) {
			return new Promise(e => {
				this.get({
					url: t
				}, (t, s, i) => e(i))
			})
		}
		runScript(t, e) {
			return new Promise(s => {
				let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
				i = i ? i.replace(/\n/g, "").trim() : i;
				let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
				r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
				const [o, h] = i.split("@"), n = {
					url: `http://${h}/v1/scripting/evaluate`,
					body: {
						script_text: t,
						mock_type: "cron",
						timeout: r
					},
					headers: {
						"X-Key": o,
						Accept: "*/*"
					}
				};
				this.post(n, (t, e, i) => s(i))
			}).catch(t => this.logErr(t))
		}
		loaddata() {
			if (!this.isNode()) return {}; {
				this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
				const t = this.path.resolve(this.dataFile),
					e = this.path.resolve(process.cwd(), this.dataFile),
					s = this.fs.existsSync(t),
					i = !s && this.fs.existsSync(e);
				if (!s && !i) return {}; {
					const i = s ? t : e;
					try {
						return JSON.parse(this.fs.readFileSync(i))
					} catch (t) {
						return {}
					}
				}
			}
		}
		writedata() {
			if (this.isNode()) {
				this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
				const t = this.path.resolve(this.dataFile),
					e = this.path.resolve(process.cwd(), this.dataFile),
					s = this.fs.existsSync(t),
					i = !s && this.fs.existsSync(e),
					r = JSON.stringify(this.data);
				s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r)
			}
		}
		lodash_get(t, e, s) {
			const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
			let r = t;
			for (const t of i)
				if (r = Object(r)[t], void 0 === r) return s;
			return r
		}
		lodash_set(t, e, s) {
			return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t)
		}
		getdata(t) {
			let e = this.getval(t);
			if (/^@/.test(t)) {
				const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : "";
				if (r) try {
					const t = JSON.parse(r);
					e = t ? this.lodash_get(t, i, "") : e
				} catch (t) {
					e = ""
				}
			}
			return e
		}
		setdata(t, e) {
			let s = !1;
			if (/^@/.test(e)) {
				const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}";
				try {
					const e = JSON.parse(h);
					this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i)
				} catch (e) {
					const o = {};
					this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i)
				}
			} else s = this.setval(t, e);
			return s
		}
		getval(t) {
			return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null
		}
		setval(t, e) {
			return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null
		}
		initGotEnv(t) {
			this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar))
		}
		get(t, e = (() => { })) {
			t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
				"X-Surge-Skip-Scripting": !1
			})), $httpClient.get(t, (t, s, i) => {
				!t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
			})) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
				hints: !1
			})), $task.fetch(t).then(t => {
				const {
					statusCode: s,
					statusCode: i,
					headers: r,
					body: o
				} = t;
				e(null, {
					status: s,
					statusCode: i,
					headers: r,
					body: o
				}, o)
			}, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
				try {
					if (t.headers["set-cookie"]) {
						const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
						s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
					}
				} catch (t) {
					this.logErr(t)
				}
			}).then(t => {
				const {
					statusCode: s,
					statusCode: i,
					headers: r,
					body: o
				} = t;
				e(null, {
					status: s,
					statusCode: i,
					headers: r,
					body: o
				}, o)
			}, t => {
				const {
					message: s,
					response: i
				} = t;
				e(s, i, i && i.body)
			}))
		}
		post(t, e = (() => { })) {
			if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
				"X-Surge-Skip-Scripting": !1
			})), $httpClient.post(t, (t, s, i) => {
				!t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
			});
			else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
				hints: !1
			})), $task.fetch(t).then(t => {
				const {
					statusCode: s,
					statusCode: i,
					headers: r,
					body: o
				} = t;
				e(null, {
					status: s,
					statusCode: i,
					headers: r,
					body: o
				}, o)
			}, t => e(t));
			else if (this.isNode()) {
				this.initGotEnv(t);
				const {
					url: s,
					...i
				} = t;
				this.got.post(s, i).then(t => {
					const {
						statusCode: s,
						statusCode: i,
						headers: r,
						body: o
					} = t;
					e(null, {
						status: s,
						statusCode: i,
						headers: r,
						body: o
					}, o)
				}, t => {
					const {
						message: s,
						response: i
					} = t;
					e(s, i, i && i.body)
				})
			}
		}
		time(t, e = null) {
			const s = e ? new Date(e) : new Date;
			let i = {
				"M+": s.getMonth() + 1,
				"d+": s.getDate(),
				"H+": s.getHours(),
				"m+": s.getMinutes(),
				"s+": s.getSeconds(),
				"q+": Math.floor((s.getMonth() + 3) / 3),
				S: s.getMilliseconds()
			};
			/(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length)));
			for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length)));
			return t
		}
		msg(e = t, s = "", i = "", r) {
			const o = t => {
				if (!t) return t;
				if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {
					"open-url": t
				} : this.isSurge() ? {
					url: t
				} : void 0;
				if ("object" == typeof t) {
					if (this.isLoon()) {
						let e = t.openUrl || t.url || t["open-url"],
							s = t.mediaUrl || t["media-url"];
						return {
							openUrl: e,
							mediaUrl: s
						}
					}
					if (this.isQuanX()) {
						let e = t["open-url"] || t.url || t.openUrl,
							s = t["media-url"] || t.mediaUrl;
						return {
							"open-url": e,
							"media-url": s
						}
					}
					if (this.isSurge()) {
						let e = t.url || t.openUrl || t["open-url"];
						return {
							url: e
						}
					}
				}
			};
			if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) {
				let t = ["", "==============📣系统通知📣=============="];
				t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t)
			}
		}
		log(...t) {
			t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
		}
		logErr(t, e) {
			const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
			s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t)
		}
		wait(t) {
			return new Promise(e => setTimeout(e, t))
		}
		done(t = {}) {
			const e = (new Date).getTime(),
				s = (e - this.startTime) / 1e3;
			this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
		}
	}(t, e)
}