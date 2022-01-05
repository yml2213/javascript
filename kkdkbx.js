/*
邀请码: QK9JN8
感谢填写!感谢填写!!感谢填写!!!
1.5 快看点开宝箱完成
平台:   青龙(其他未测试)
软件:  快看点 app 
收益:  10000金币 = 1元  不清楚,没写完   
注意事项 ： 一定要认真阅读以下内容

[Script])(青龙等)
cron "1-59/20 * * * *" script-path=https://raw.githubusercontent.com/yml2213/javascript/master/kkdkbx.js,tag=快看点开宝箱
=============变量=============
export kkdhd='{"Content-Type":"","Cookie":"","User-Agent":""}'
export kkdkbxurl=''

=============变量解释==========
kkdhd:快看点hd,把后面的变量填上即可食用
kkdkbxurl:快看点开宝箱专属url,每个人不同,抓包后直接扔变量即可

=============变量获取==========
ios:  可以使用圈x(需要把去广告功能关闭)  也可以使用 steam , thor 等工具
      圈x为例   开启http抓包
      打开app,观看一个视频,然后搜索关键字  receive
      即可找到 Content-Type , Cookie , User-Agent 

      url就是链接,直接复制即可

安卓:  使用小黄鸟进行抓包,Content-Type , Cookie , User-Agent  不在赘述,直接抓包后搜索关键字  receive  即可获取
      url就是抓到的有效包 总览 下面的那个链接 ,点击复制即可
      
=============变量实例==========
# 快看点
export kkdhd='{"Content-Type":"application/x-www-form-urlencoded", "Cookie":"did=B92C0F70-3B2A-4E00-8BC4-DBF7E4D0FD1B;userId=96226728;pearl.api_st=CgxwZWFybC5hcGkuc3QSkAGiCdPWn0cxfzKazBA6Q6WPdo6v3ApLjmxZXOTSQe5NIhARih4hgPAV6QvabWIES8tAmolR5Kovg5vqEVmev_lBQiC5_vPe-_NHX7bYwnOE3Q2txiQEl5MsKKG2sRySuAckIAhZNh0RtjLzXc7fgerlSTADSvSjcPWQs_LzP5AZPiUifrMhZM-nRyYZQocd4eoaEkpiLsuYxNmYZBtN5UjGoH9GpiIgsx6vxZ8fRMjsSdzULbmC-ekdXPDcfTDMqQluf5zC0XcoBTAB","User-Agent":"Artemis/3.55.1 (iPhone; iOS 15.2; Scale/3.00)"}'

export kkdkbxurl='https://api.yuncheapp.cn/pearl-incentive/api/v1/task/intervalAward/receive?oc=apple&lon=&dpbs=3sCt3iAAMzE1NTc1MTQ3Ac8HAIinM9cIsaW3TBAAAAC1e4eqFnhrRLWwUK%2BwfrGN&kpf=IPHONE&isp=460_01&kpn=pearl&fr=iOS&os=15.2&md=iPhone%2013%20Pro&app=pearl&mi=&ve=3.55.1&did=B92C0F70-3B2A-4E00-8BC4-DBF7E4D0FD1B&sr=1170*2532&egid=DFPA700BE9EC0CF6975BB8D6CB0044E4E22EAF38930C9630BB92C274A7154D2A&nt=WIFI&lat=&__clientSign2=XMXXVmHVAgxlOGY5YTNiYWMwNjQ0ZGM4NjRhMGEzYTI1NzRjYjI4ZGI1YmE2ZWRiYmRiMWJmYTk%3D&ss=U0RMUV81Rw%3D%3D'



还不会的请百度或者群里求助

*/

const $ = new Env("快看点开宝箱");
const notify = $.isNode() ? require("./sendNotify") : "";

/* 
let status;
status = (status = ($.getval(`kkdstatus`) || "1")) > 1 ? `${status}` : "";    // 账号扩展字符       
*/

let kkdhdArr = []; //数组 Array
let host = 'api.yuncheapp.cn';
let kkdhd = { "Content-Type": "", "Cookie": "", "User-Agent": "" };
let kkdkbxurl = process.env.kkdkbxurl;
let kkdhdstr = $.isNode() ? (process.env.kkdhd ? process.env.kkdhd : "") : ($.getdata('kkdhd') ? $.getdata('kkdhd') : "");   //字符串 str/String
let kkdhds = "";

//开始运行

!(async () => {
	if (process.env.kkdhd && process.env.kkdhd.indexOf('@') > -1) {
		kkdhdArr = process.env.kkdhd.split('@');
		console.log(`您选择的是用"@"隔开\n`)
	} else {
		kkdhds = [process.env.kkdhd]
	};
	Object.keys(kkdhds).forEach((item) => {
		if (kkdhds[item]) {
			kkdhdArr.push(kkdhds[item])
		}
	})

	console.log(`共${kkdhdArr.length}个账号`)
	for (let k = 0; k < kkdhdArr.length; k++) {
		kkdhd = kkdhdArr[k]
		$.index = k + 1;
		console.log(`\n开始【快看点账户 ${$.index}】`)
		await yml()
	}



	// message() //通知
})()
	.catch((e) => $.logErr(e))
	.finally(() => $.done())





// 1000 ms == 1 s    60000 ms == 1 min    600000 ms == 10 min
//这里是要执行的代码     ====== 如果有您不需要的  请自行注释  使用 // 注释就行 ========
async function yml() {

	await wyy();
	await $.wait(2000); // 延迟 2000ms  也就是2秒
	await kbx();

}



//每日网抑云
function wyy(timeout = 0) {
	return new Promise((resolve) => {
		let url = {
			url: `https://tenapi.cn/comment/`,
		};
		$.get(
			url,
			async (err, resp, data) => {
				try {
					data = JSON.parse(data);
					$.log(
						`\n【网抑云时间】: ${data.data.content}  by--${data.data.song}`
					);
				} catch (e) {
					$.logErr(e, resp);
				} finally {
					resolve();
				}
			},
			timeout
		);
	});
}


// 开宝箱
function kbx(timeout = 0) {
	return new Promise((resolve) => {
		let url = {
			url: kkdkbxurl,
			headers: {

				'Content-Type': JSON.parse(kkdhd)['Content-Type'],
				'Cookie': JSON.parse(kkdhd)['Cookie'],
				"User-Agent": JSON.parse(kkdhd)['User-Agent'],
				host: host,


			},
			body: "",
		};

		// console.log(url);

		$.post(
			url,
			async (err, resp, data) => {
				try {
					// console.log(`输出data开始===================`);
					// console.log(data);
					// console.log(`输出data结束===================`);

					result = JSON.parse(data);
					if (result.status == 0) {
						$.log(
							`\n【🎉🎉🎉 恭喜鸭 🎉🎉🎉】开宝箱:${result.data.title} , 好家伙获得了${result.data.coins}枚金币呢!`
						);
						await $.wait(10000);   // 延时 10秒
						// await kbx();
					} else {
						$.log(
							`\n【🎉 恭喜个屁 🎉】:开宝箱:失败🙅🏻了呢,原因可能是:${result.message}`
						);
					}
				} catch (e) {
					$.logErr(e, resp);
				} finally {
					resolve();
				}
			},
			timeout
		);
	});
}
























//固定板块，无需动
function Env(t, e) {
	class s {
		constructor(t) {
			this.env = t;
		}
		send(t, e = "GET") {
			t = "string" == typeof t ? { url: t } : t;
			let s = this.get;
			return (
				"POST" === e && (s = this.post),
				new Promise((e, i) => {
					s.call(this, t, (t, s, r) => {
						t ? i(t) : e(s);
					});
				})
			);
		}
		get(t) {
			return this.send.call(this.env, t);
		}
		post(t) {
			return this.send.call(this.env, t, "POST");
		}
	}
	return new (class {
		constructor(t, e) {
			(this.name = t),
				(this.http = new s(this)),
				(this.data = null),
				(this.dataFile = "box.dat"),
				(this.logs = []),
				(this.isMute = !1),
				(this.isNeedRewrite = !1),
				(this.logSeparator = "\n"),
				(this.encoding = "utf-8"),
				(this.startTime = new Date().getTime()),
				Object.assign(this, e),
				this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`);
		}
		isNode() {
			return "undefined" != typeof module && !!module.exports;
		}
		isQuanX() {
			return "undefined" != typeof $task;
		}
		isSurge() {
			return "undefined" != typeof $httpClient && "undefined" == typeof $loon;
		}
		isLoon() {
			return "undefined" != typeof $loon;
		}
		isShadowrocket() {
			return "undefined" != typeof $rocket;
		}
		toObj(t, e = null) {
			try {
				return JSON.parse(t);
			} catch {
				return e;
			}
		}
		toStr(t, e = null) {
			try {
				return JSON.stringify(t);
			} catch {
				return e;
			}
		}
		getjson(t, e) {
			let s = e;
			const i = this.getdata(t);
			if (i)
				try {
					s = JSON.parse(this.getdata(t));
				} catch { }
			return s;
		}
		setjson(t, e) {
			try {
				return this.setdata(JSON.stringify(t), e);
			} catch {
				return !1;
			}
		}
		getScript(t) {
			return new Promise((e) => {
				this.get({ url: t }, (t, s, i) => e(i));
			});
		}
		runScript(t, e) {
			return new Promise((s) => {
				let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
				i = i ? i.replace(/\n/g, "").trim() : i;
				let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
				(r = r ? 1 * r : 20), (r = e && e.timeout ? e.timeout : r);
				const [o, h] = i.split("@"),
					n = {
						url: `http://${h}/v1/scripting/evaluate`,
						body: { script_text: t, mock_type: "cron", timeout: r },
						headers: { "X-Key": o, Accept: "*/*" },
					};
				this.post(n, (t, e, i) => s(i));
			}).catch((t) => this.logErr(t));
		}
		loaddata() {
			if (!this.isNode()) return {};
			{
				(this.fs = this.fs ? this.fs : require("fs")),
					(this.path = this.path ? this.path : require("path"));
				const t = this.path.resolve(this.dataFile),
					e = this.path.resolve(process.cwd(), this.dataFile),
					s = this.fs.existsSync(t),
					i = !s && this.fs.existsSync(e);
				if (!s && !i) return {};
				{
					const i = s ? t : e;
					try {
						return JSON.parse(this.fs.readFileSync(i));
					} catch (t) {
						return {};
					}
				}
			}
		}
		writedata() {
			if (this.isNode()) {
				(this.fs = this.fs ? this.fs : require("fs")),
					(this.path = this.path ? this.path : require("path"));
				const t = this.path.resolve(this.dataFile),
					e = this.path.resolve(process.cwd(), this.dataFile),
					s = this.fs.existsSync(t),
					i = !s && this.fs.existsSync(e),
					r = JSON.stringify(this.data);
				s
					? this.fs.writeFileSync(t, r)
					: i
						? this.fs.writeFileSync(e, r)
						: this.fs.writeFileSync(t, r);
			}
		}
		lodash_get(t, e, s) {
			const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
			let r = t;
			for (const t of i) if (((r = Object(r)[t]), void 0 === r)) return s;
			return r;
		}
		lodash_set(t, e, s) {
			return Object(t) !== t
				? t
				: (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []),
					(e
						.slice(0, -1)
						.reduce(
							(t, s, i) =>
								Object(t[s]) === t[s]
									? t[s]
									: (t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}),
							t
						)[e[e.length - 1]] = s),
					t);
		}
		getdata(t) {
			let e = this.getval(t);
			if (/^@/.test(t)) {
				const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t),
					r = s ? this.getval(s) : "";
				if (r)
					try {
						const t = JSON.parse(r);
						e = t ? this.lodash_get(t, i, "") : e;
					} catch (t) {
						e = "";
					}
			}
			return e;
		}
		setdata(t, e) {
			let s = !1;
			if (/^@/.test(e)) {
				const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e),
					o = this.getval(i),
					h = i ? ("null" === o ? null : o || "{}") : "{}";
				try {
					const e = JSON.parse(h);
					this.lodash_set(e, r, t), (s = this.setval(JSON.stringify(e), i));
				} catch (e) {
					const o = {};
					this.lodash_set(o, r, t), (s = this.setval(JSON.stringify(o), i));
				}
			} else s = this.setval(t, e);
			return s;
		}
		getval(t) {
			return this.isSurge() || this.isLoon()
				? $persistentStore.read(t)
				: this.isQuanX()
					? $prefs.valueForKey(t)
					: this.isNode()
						? ((this.data = this.loaddata()), this.data[t])
						: (this.data && this.data[t]) || null;
		}
		setval(t, e) {
			return this.isSurge() || this.isLoon()
				? $persistentStore.write(t, e)
				: this.isQuanX()
					? $prefs.setValueForKey(t, e)
					: this.isNode()
						? ((this.data = this.loaddata()),
							(this.data[e] = t),
							this.writedata(),
							!0)
						: (this.data && this.data[e]) || null;
		}
		initGotEnv(t) {
			(this.got = this.got ? this.got : require("got")),
				(this.cktough = this.cktough ? this.cktough : require("tough-cookie")),
				(this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar()),
				t &&
				((t.headers = t.headers ? t.headers : {}),
					void 0 === t.headers.Cookie &&
					void 0 === t.cookieJar &&
					(t.cookieJar = this.ckjar));
		}
		get(t, e = () => { }) {
			if (
				(t.headers &&
					(delete t.headers["Content-Type"],
						delete t.headers["Content-Length"]),
					this.isSurge() || this.isLoon())
			)
				this.isSurge() &&
					this.isNeedRewrite &&
					((t.headers = t.headers || {}),
						Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })),
					$httpClient.get(t, (t, s, i) => {
						!t && s && ((s.body = i), (s.statusCode = s.status)), e(t, s, i);
					});
			else if (this.isQuanX())
				this.isNeedRewrite &&
					((t.opts = t.opts || {}), Object.assign(t.opts, { hints: !1 })),
					$task.fetch(t).then(
						(t) => {
							const { statusCode: s, statusCode: i, headers: r, body: o } = t;
							e(null, { status: s, statusCode: i, headers: r, body: o }, o);
						},
						(t) => e(t)
					);
			else if (this.isNode()) {
				let s = require("iconv-lite");
				this.initGotEnv(t),
					this.got(t)
						.on("redirect", (t, e) => {
							try {
								if (t.headers["set-cookie"]) {
									const s = t.headers["set-cookie"]
										.map(this.cktough.Cookie.parse)
										.toString();
									s && this.ckjar.setCookieSync(s, null),
										(e.cookieJar = this.ckjar);
								}
							} catch (t) {
								this.logErr(t);
							}
						})
						.then(
							(t) => {
								const {
									statusCode: i,
									statusCode: r,
									headers: o,
									rawBody: h,
								} = t;
								e(
									null,
									{ status: i, statusCode: r, headers: o, rawBody: h },
									s.decode(h, this.encoding)
								);
							},
							(t) => {
								const { message: i, response: r } = t;
								e(i, r, r && s.decode(r.rawBody, this.encoding));
							}
						);
			}
		}
		post(t, e = () => { }) {
			const s = t.method ? t.method.toLocaleLowerCase() : "post";
			if (
				(t.body &&
					t.headers &&
					!t.headers["Content-Type"] &&
					(t.headers["Content-Type"] = "application/x-www-form-urlencoded"),
					t.headers && delete t.headers["Content-Length"],
					this.isSurge() || this.isLoon())
			)
				this.isSurge() &&
					this.isNeedRewrite &&
					((t.headers = t.headers || {}),
						Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })),
					$httpClient[s](t, (t, s, i) => {
						!t && s && ((s.body = i), (s.statusCode = s.status)), e(t, s, i);
					});
			else if (this.isQuanX())
				(t.method = s),
					this.isNeedRewrite &&
					((t.opts = t.opts || {}), Object.assign(t.opts, { hints: !1 })),
					$task.fetch(t).then(
						(t) => {
							const { statusCode: s, statusCode: i, headers: r, body: o } = t;
							e(null, { status: s, statusCode: i, headers: r, body: o }, o);
						},
						(t) => e(t)
					);
			else if (this.isNode()) {
				let i = require("iconv-lite");
				this.initGotEnv(t);
				const { url: r, ...o } = t;
				this.got[s](r, o).then(
					(t) => {
						const { statusCode: s, statusCode: r, headers: o, rawBody: h } = t;
						e(
							null,
							{ status: s, statusCode: r, headers: o, rawBody: h },
							i.decode(h, this.encoding)
						);
					},
					(t) => {
						const { message: s, response: r } = t;
						e(s, r, r && i.decode(r.rawBody, this.encoding));
					}
				);
			}
		}
		time(t, e = null) {
			const s = e ? new Date(e) : new Date();
			let i = {
				"M+": s.getMonth() + 1,
				"d+": s.getDate(),
				"H+": s.getHours(),
				"m+": s.getMinutes(),
				"s+": s.getSeconds(),
				"q+": Math.floor((s.getMonth() + 3) / 3),
				S: s.getMilliseconds(),
			};
			/(y+)/.test(t) &&
				(t = t.replace(
					RegExp.$1,
					(s.getFullYear() + "").substr(4 - RegExp.$1.length)
				));
			for (let e in i)
				new RegExp("(" + e + ")").test(t) &&
					(t = t.replace(
						RegExp.$1,
						1 == RegExp.$1.length
							? i[e]
							: ("00" + i[e]).substr(("" + i[e]).length)
					));
			return t;
		}
		msg(e = t, s = "", i = "", r) {
			const o = (t) => {
				if (!t) return t;
				if ("string" == typeof t)
					return this.isLoon()
						? t
						: this.isQuanX()
							? { "open-url": t }
							: this.isSurge()
								? { url: t }
								: void 0;
				if ("object" == typeof t) {
					if (this.isLoon()) {
						let e = t.openUrl || t.url || t["open-url"],
							s = t.mediaUrl || t["media-url"];
						return { openUrl: e, mediaUrl: s };
					}
					if (this.isQuanX()) {
						let e = t["open-url"] || t.url || t.openUrl,
							s = t["media-url"] || t.mediaUrl;
						return { "open-url": e, "media-url": s };
					}
					if (this.isSurge()) {
						let e = t.url || t.openUrl || t["open-url"];
						return { url: e };
					}
				}
			};
			if (
				(this.isMute ||
					(this.isSurge() || this.isLoon()
						? $notification.post(e, s, i, o(r))
						: this.isQuanX() && $notify(e, s, i, o(r))),
					!this.isMuteLog)
			) {
				let t = [
					"",
					"==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3==============",
				];
				t.push(e),
					s && t.push(s),
					i && t.push(i),
					console.log(t.join("\n")),
					(this.logs = this.logs.concat(t));
			}
		}
		log(...t) {
			t.length > 0 && (this.logs = [...this.logs, ...t]),
				console.log(t.join(this.logSeparator));
		}
		logErr(t, e) {
			const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
			s
				? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack)
				: this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t);
		}
		wait(t) {
			return new Promise((e) => setTimeout(e, t));
		}
		done(t = {}) {
			const e = new Date().getTime(),
				s = (e - this.startTime) / 1e3;
			this.log(
				"",
				`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`
			),
				this.log(),
				(this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t);
		}
	})(t, e);
}
