/* 
10-9	第一版完成，改用 request，支持青龙

*/
module.exports = {
	checkEnv: checkEnv,
	phone_num: phone_num,
	randomszdx: randomszdx,
	randomszxx: randomszxx,
	randomInt: randomInt,
	ts13: ts13,
	ts10: ts10,
	tmtoDate: tmtoDate,
	local_hours: local_hours,
	local_minutes: local_minutes,
	local_year: local_year,
	local_month: local_month,
	local_month_two: local_month_two,
	local_day: local_day,
	local_day_two: local_day_two,
	MD5Encrypt: MD5Encrypt,
	yiyan: yiyan,
	wait: wait,
	httpRequest: httpRequest,
};

var request = require("request");

//
/**
 * 测试get post合一   10-9改 request
 */
async function httpRequest(name, options) {
	return new Promise((resolve) => {
		if (!name) {
			let tmp = arguments.callee.toString();
			let re = /function\s*(\w*)/i;
			let matches = re.exec(tmp);
			name = matches[1];
		}

		request(options, function (error, response) {
			if (error) throw new Error(error);
			// response.body
			let data = response.body;
			try {
				// console.log(typeof (data));
				if (typeof data == "string") {
					if (isJsonString(data)) {
						let result = JSON.parse(data);
						resolve(result);
					} else {
						let result = data;
						resolve(result);
					}
					function isJsonString(str) {
						if (typeof str == "string") {
							try {
								if (typeof JSON.parse(str) == "object") {
									return true;
								}
							} catch (e) {
								return false;
							}
						}
						return false;
					}
				} else {
					let result = data;
					resolve(result);
				}
			} catch (e) {
				console.log(error, response);
				console.log(`\n ${name} 失败了!请稍后尝试!!`);
			} finally {
				resolve();
			}
		});
	});
}



/**
 * 一言
 */
function yiyan() {
	return new Promise((resolve) => {
		var options = {
			method: "GET",
			url: "https://v1.hitokoto.cn/",
			headers: {},
		};
		request(options, function (error, response) {
			if (error) throw new Error(error);
			try {
				// console.log(data);
				let data = JSON.parse(response.body);
				let data_ = `[一言]: ${data.hitokoto}  by--${data.from}`;
				console.log(data_);
				msg += `\n    ${data}`;
				// return data_
			} catch (e) {
				// console.log(error, response);
			} finally {
				resolve();
			}
		});
	});
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
 * 变量检查
 */
async function checkEnv(ck, name) {
	return new Promise((resolve) => {
		let ckArr = [];
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
			resolve(ckArr);
		} else {
			console.log();
			console.log(`未填写变量 ${name} ,请仔细阅读脚本说明!`);
		}
	});
}



/**
 * 获取远程版本
 * http://yml-gitea.ml:2233/yml/JavaScript-yml/raw/branch/master/${name}.js
 * https://raw.gh.fakev.cn/yml2213/javascript/master/${name}/${name}.js
 */
function Version_Check(name, type) {
	return new Promise((resolve) => {
		if (type == 1) {
			data = `https://raw.gh.fakev.cn/yml2213/javascript/master/${name}/${name}.js`;
		} else if (type == 2) {
			data = `http://yml-gitea.ml:2233/yml/JavaScript-yml/raw/branch/master/${name}.js`;
		}
		let url = {
			url: data,
		};
		$.get(
			url,
			async (err, resp, data) => {
				try {
					VersionCheck = resp.body.match(/VersionCheck = "([\d\.]+)"/)[1];
				} catch (e) {
					console.log(e, resp);
				} finally {
					resolve(VersionCheck);
				}
			},
			(timeout = 3)
		);
	});
}

/**
 * 手机号中间遮挡
 */
function phone_num(phone_num) {
	if (phone_num.length == 11) {
		let data = phone_num.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
		return data;
	} else {
		return phone_num;
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
 * 时间戳 转 日期
 */
function tmtoDate(time = +new Date()) {
	if (time.toString().length == 13) {
		var date = new Date(time + 8 * 3600 * 1000);
		return date.toJSON().substr(0, 19).replace("T", " ");
	} else if (time.toString().length == 10) {
		time = time * 1000;
		var date = new Date(time + 8 * 3600 * 1000);
		return date.toJSON().substr(0, 19).replace("T", " ");
	}
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
		m = `0${m}`;
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
		d = `0${d}`;
	}
	return d;
}

/**
 * md5 加密
 */
function MD5Encrypt(a) {
	function b(a, b) {
		return (a << b) | (a >>> (32 - b));
	}
	function c(a, b) {
		var c, d, e, f, g;
		return (
			(e = 2147483648 & a),
			(f = 2147483648 & b),
			(c = 1073741824 & a),
			(d = 1073741824 & b),
			(g = (1073741823 & a) + (1073741823 & b)),
			c & d
				? 2147483648 ^ g ^ e ^ f
				: c | d
					? 1073741824 & g
						? 3221225472 ^ g ^ e ^ f
						: 1073741824 ^ g ^ e ^ f
					: g ^ e ^ f
		);
	}
	function d(a, b, c) {
		return (a & b) | (~a & c);
	}
	function e(a, b, c) {
		return (a & c) | (b & ~c);
	}
	function f(a, b, c) {
		return a ^ b ^ c;
	}
	function g(a, b, c) {
		return b ^ (a | ~c);
	}
	function h(a, e, f, g, h, i, j) {
		return (a = c(a, c(c(d(e, f, g), h), j))), c(b(a, i), e);
	}
	function i(a, d, f, g, h, i, j) {
		return (a = c(a, c(c(e(d, f, g), h), j))), c(b(a, i), d);
	}
	function j(a, d, e, g, h, i, j) {
		return (a = c(a, c(c(f(d, e, g), h), j))), c(b(a, i), d);
	}
	function k(a, d, e, f, h, i, j) {
		return (a = c(a, c(c(g(d, e, f), h), j))), c(b(a, i), d);
	}
	function l(a) {
		for (
			var b,
			c = a.length,
			d = c + 8,
			e = (d - (d % 64)) / 64,
			f = 16 * (e + 1),
			g = new Array(f - 1),
			h = 0,
			i = 0;
			c > i;

		)
			(b = (i - (i % 4)) / 4),
				(h = (i % 4) * 8),
				(g[b] = g[b] | (a.charCodeAt(i) << h)),
				i++;
		return (
			(b = (i - (i % 4)) / 4),
			(h = (i % 4) * 8),
			(g[b] = g[b] | (128 << h)),
			(g[f - 2] = c << 3),
			(g[f - 1] = c >>> 29),
			g
		);
	}
	function m(a) {
		var b,
			c,
			d = "",
			e = "";
		for (c = 0; 3 >= c; c++)
			(b = (a >>> (8 * c)) & 255),
				(e = "0" + b.toString(16)),
				(d += e.substr(e.length - 2, 2));
		return d;
	}
	function n(a) {
		a = a.replace(/\r\n/g, "\n");
		for (var b = "", c = 0; c < a.length; c++) {
			var d = a.charCodeAt(c);
			128 > d
				? (b += String.fromCharCode(d))
				: d > 127 && 2048 > d
					? ((b += String.fromCharCode((d >> 6) | 192)),
						(b += String.fromCharCode((63 & d) | 128)))
					: ((b += String.fromCharCode((d >> 12) | 224)),
						(b += String.fromCharCode(((d >> 6) & 63) | 128)),
						(b += String.fromCharCode((63 & d) | 128)));
		}
		return b;
	}
	var o,
		p,
		q,
		r,
		s,
		t,
		u,
		v,
		w,
		x = [],
		y = 7,
		z = 12,
		A = 17,
		B = 22,
		C = 5,
		D = 9,
		E = 14,
		F = 20,
		G = 4,
		H = 11,
		I = 16,
		J = 23,
		K = 6,
		L = 10,
		M = 15,
		N = 21;
	for (
		a = n(a),
		x = l(a),
		t = 1732584193,
		u = 4023233417,
		v = 2562383102,
		w = 271733878,
		o = 0;
		o < x.length;
		o += 16
	)
		(p = t),
			(q = u),
			(r = v),
			(s = w),
			(t = h(t, u, v, w, x[o + 0], y, 3614090360)),
			(w = h(w, t, u, v, x[o + 1], z, 3905402710)),
			(v = h(v, w, t, u, x[o + 2], A, 606105819)),
			(u = h(u, v, w, t, x[o + 3], B, 3250441966)),
			(t = h(t, u, v, w, x[o + 4], y, 4118548399)),
			(w = h(w, t, u, v, x[o + 5], z, 1200080426)),
			(v = h(v, w, t, u, x[o + 6], A, 2821735955)),
			(u = h(u, v, w, t, x[o + 7], B, 4249261313)),
			(t = h(t, u, v, w, x[o + 8], y, 1770035416)),
			(w = h(w, t, u, v, x[o + 9], z, 2336552879)),
			(v = h(v, w, t, u, x[o + 10], A, 4294925233)),
			(u = h(u, v, w, t, x[o + 11], B, 2304563134)),
			(t = h(t, u, v, w, x[o + 12], y, 1804603682)),
			(w = h(w, t, u, v, x[o + 13], z, 4254626195)),
			(v = h(v, w, t, u, x[o + 14], A, 2792965006)),
			(u = h(u, v, w, t, x[o + 15], B, 1236535329)),
			(t = i(t, u, v, w, x[o + 1], C, 4129170786)),
			(w = i(w, t, u, v, x[o + 6], D, 3225465664)),
			(v = i(v, w, t, u, x[o + 11], E, 643717713)),
			(u = i(u, v, w, t, x[o + 0], F, 3921069994)),
			(t = i(t, u, v, w, x[o + 5], C, 3593408605)),
			(w = i(w, t, u, v, x[o + 10], D, 38016083)),
			(v = i(v, w, t, u, x[o + 15], E, 3634488961)),
			(u = i(u, v, w, t, x[o + 4], F, 3889429448)),
			(t = i(t, u, v, w, x[o + 9], C, 568446438)),
			(w = i(w, t, u, v, x[o + 14], D, 3275163606)),
			(v = i(v, w, t, u, x[o + 3], E, 4107603335)),
			(u = i(u, v, w, t, x[o + 8], F, 1163531501)),
			(t = i(t, u, v, w, x[o + 13], C, 2850285829)),
			(w = i(w, t, u, v, x[o + 2], D, 4243563512)),
			(v = i(v, w, t, u, x[o + 7], E, 1735328473)),
			(u = i(u, v, w, t, x[o + 12], F, 2368359562)),
			(t = j(t, u, v, w, x[o + 5], G, 4294588738)),
			(w = j(w, t, u, v, x[o + 8], H, 2272392833)),
			(v = j(v, w, t, u, x[o + 11], I, 1839030562)),
			(u = j(u, v, w, t, x[o + 14], J, 4259657740)),
			(t = j(t, u, v, w, x[o + 1], G, 2763975236)),
			(w = j(w, t, u, v, x[o + 4], H, 1272893353)),
			(v = j(v, w, t, u, x[o + 7], I, 4139469664)),
			(u = j(u, v, w, t, x[o + 10], J, 3200236656)),
			(t = j(t, u, v, w, x[o + 13], G, 681279174)),
			(w = j(w, t, u, v, x[o + 0], H, 3936430074)),
			(v = j(v, w, t, u, x[o + 3], I, 3572445317)),
			(u = j(u, v, w, t, x[o + 6], J, 76029189)),
			(t = j(t, u, v, w, x[o + 9], G, 3654602809)),
			(w = j(w, t, u, v, x[o + 12], H, 3873151461)),
			(v = j(v, w, t, u, x[o + 15], I, 530742520)),
			(u = j(u, v, w, t, x[o + 2], J, 3299628645)),
			(t = k(t, u, v, w, x[o + 0], K, 4096336452)),
			(w = k(w, t, u, v, x[o + 7], L, 1126891415)),
			(v = k(v, w, t, u, x[o + 14], M, 2878612391)),
			(u = k(u, v, w, t, x[o + 5], N, 4237533241)),
			(t = k(t, u, v, w, x[o + 12], K, 1700485571)),
			(w = k(w, t, u, v, x[o + 3], L, 2399980690)),
			(v = k(v, w, t, u, x[o + 10], M, 4293915773)),
			(u = k(u, v, w, t, x[o + 1], N, 2240044497)),
			(t = k(t, u, v, w, x[o + 8], K, 1873313359)),
			(w = k(w, t, u, v, x[o + 15], L, 4264355552)),
			(v = k(v, w, t, u, x[o + 6], M, 2734768916)),
			(u = k(u, v, w, t, x[o + 13], N, 1309151649)),
			(t = k(t, u, v, w, x[o + 4], K, 4149444226)),
			(w = k(w, t, u, v, x[o + 11], L, 3174756917)),
			(v = k(v, w, t, u, x[o + 2], M, 718787259)),
			(u = k(u, v, w, t, x[o + 9], N, 3951481745)),
			(t = c(t, p)),
			(u = c(u, q)),
			(v = c(v, r)),
			(w = c(w, s));
	var O = m(t) + m(u) + m(v) + m(w);
	return O.toLowerCase();
}
