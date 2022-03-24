/*
cron 28 7 * * * yml_javascript/xmly.js

软件名称：喜马拉雅 app
下载地址：应用商店自行下载
收益: 只有积分,要很久才能换东西  自行决定跑不跑

3-20   签到任务 进行双平台脚本测试,青龙加圈x
感谢所有测试人员

注意事项 ： 一定要仔细阅读一下内容
              青龙填写格式
=============青龙变量格式=============
export yml_xmly_cookie='cookie1@cookie2'
 多账号使用 @ 分割；
(给小白啰嗦一句:export XXX ==> 是青龙 "配置文件" 变量格式; 如果要在 "环境变量" 中添加,不需要export)
=============青龙变量实例=============
export yml_xmly_cookie='domain=.ximalaya.com; path=/; channel=ios-b1; 1&_device=iPhone&32866292-70F5-45A8-9F03-33A3DDEA3A94&9.0.22; impl=com.gemd.iting; XUM=32866292-70F5-45A8-9F03-33A3DDEA3A94; c-oper=%E8%81%94%E9%80%9A; net-mode=WIFI; res=1170%2C2532; 1&_token=230652218&497C23E0340C08D51383BE1B784794F0BC6D50F82B09F52FEA8D4A73F13AD896AA97DB615728147M825F3393CED220B_; idfa=32866292-70F5-45A8-9F03-33A3DDEA3A94; device_model=iPhone%2013%20Pro; XD=wrbjHmU5xnR+9Nz5Tx/zPg2yNxJSLDRQKe9VGyFxirbG6aQ5HmxbVGs0Mg17Xff92KG0ARPtymt8WsOejmP5VQ==; fp=009317647e2322q22164v05b2500000020211100200000001200001000; freeFlowType=0; minorProtectionStatus=0'
=============变量解释==========
只需要自己抓包一个 cookie 即可
=============变量获取==========
懒得写了，自己研究吧

              圈x填写格式
============= mimt(主机名) =============
mimt= hybrid.ximalaya.com
============= 重写 =============
http://hybrid.ximalaya.com/web-activity  url  script-request-body  https://raw.githubusercontent.com/yml2213/javascript/master/xmly/xmly.js

还是不会的请百度或者群里求助：QQ群：1001401060  tg：https://t.me/yml_tg

*/


const $ = new Env('喜马拉雅');
const notify = $.isNode() ? require('./sendNotify') : '';
let app_yml_xmly_cookie = []

// 圈x
let status;
status = (status = ($.getval("yml_xmlystatus") || "1")) > 1 ? `${status}` : "";
const yml_xmlyurlArr = [], yml_xmlyhdArr = [], yml_xmlybodyArr = [], yml_xmlycount = ''
let yml_xmlyurl = $.getdata('yml_xmlyurl')
let yml_xmlyhd = $.getdata('yml_xmlyhd')
let yml_xmlybody = $.getdata('yml_xmlybody')

!(async () => {
    if ($.isNode()) {
        if (!process.env.yml_xmly_cookie) {
            console.log(`\n【${$.name}】：未填写相应变量 yml_xmly_cookie`);
            return;
        }

        if (process.env.yml_xmly_cookie && process.env.yml_xmly_cookie.indexOf('@') > -1) {
            yml_xmly_cookie = process.env.yml_xmly_cookie.split('@');
        } else if (process.env.yml_xmly_cookie && process.env.yml_xmly_cookie.indexOf('\n') > -1) {
            yml_xmly_cookie = process.env.yml_xmly_cookie.split('\n');
        } else {
            yml_xmly_cookie = process.env.yml_xmly_cookie.split();
        }

        Object.keys(yml_xmly_cookie).forEach((item) => {
            if (yml_xmly_cookie[item]) {
                app_yml_xmly_cookie.push(yml_xmly_cookie[item]);
            }
        });

    } else {
        if (typeof $request !== "undefined") {

            yml_xmlyck()

        } else {
            yml_xmlyurlArr.push($.getdata('yml_xmlyurl'))
            yml_xmlyhdArr.push($.getdata('yml_xmlyhd'))
            yml_xmlybodyArr.push($.getdata('yml_xmlybody'))

            let yml_xmlycount = ($.getval('yml_xmlycount') || '1');

            for (let i = 2; i <= yml_xmlycount; i++) {

                yml_xmlyurlArr.push($.getdata(`yml_xmlyurl${i}`))
                yml_xmlyhdArr.push($.getdata(`yml_xmlyhd${i}`))
                yml_xmlybodyArr.push($.getdata(`yml_xmlybody${i}`))

            }

            console.log(
                `\n\n=============================================== 脚本执行 - 北京时间(UTC+8)：${new Date(
                    new Date().getTime() +
                    new Date().getTimezoneOffset() * 60 * 1000 +
                    8 * 60 * 60 * 1000
                ).toLocaleString()} ===============================================\n`);

            for (let i = 0; i < yml_xmlyhdArr.length; i++) {

                if (yml_xmlyhdArr[i]) {

                    yml_xmlyurl = yml_xmlyurlArr[i];
                    yml_xmlyhd = yml_xmlyhdArr[i];
                    yml_xmlybody = yml_xmlybodyArr[i];

                    $.index = i + 1;
                    console.log(`\n\n开始【喜马拉雅${$.index}】`)

                    //循环运行
                    for (let c = 0; c < 1; c++) {
                        $.index = c + 1
                        await wyy();
                        await xmlyqd_qx()//你要执行的版块
                        await $.wait(2 * 1000); //你要延迟的时间  1000=1秒
                        return

                    }
                }
            }
        }
    }

// 青龙执行部分
    console.log(
        `\n==== 脚本执行 - 北京时间：${new Date(
            new Date().getTime() +
            new Date().getTimezoneOffset() * 60 * 1000 +
            8 * 60 * 60 * 1000
        ).toLocaleString()} ====\n`
    );

    await wyy();

    console.log(`====【共 ${app_yml_xmly_cookie.length} 个账号】====\n`);
    for (i = 0; i < app_yml_xmly_cookie.length; i++) {
        yml_xmly_cookie = app_yml_xmly_cookie[i]
        // console.log(yml_xmly_cookie)

        $.index = i + 1;
        console.log(`\n开始【第 ${$.index} 个账号任务】`);

        //执行任务
        await yml_xmly_qd()
        await $.wait(2 * 1000);
    }

})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done());


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

// 圈x执行
function yml_xmlyck() {
    if ($request.url.indexOf("signIn") > -1) {
        const yml_xmlyurl = $request.url
        if (yml_xmlyurl) $.setdata(yml_xmlyurl, `yml_xmlyurl${status}`)
        $.log(yml_xmlyurl)

        const yml_xmlyhd = JSON.stringify($request.headers)
        if (yml_xmlyhd) $.setdata(yml_xmlyhd, `yml_xmlyhd${status}`)
        $.log(yml_xmlyhd)

        const yml_xmlybody = $request.body
        if (yml_xmlybody) $.setdata(yml_xmlybody, `yml_xmlybody${status}`)
        $.log(yml_xmlybody)

        $.msg($.name, "", `喜马拉雅${status}获取headers成功`)

    }
}
// 签到
// http://hybrid.ximalaya.com/web-activity/signIn/v2/signIn
function xmlyqd_qx(timeout = 0) {
    return new Promise((resolve) => {

        let url = {
            url: `http://hybrid.ximalaya.com/web-activity/signIn/v2/signIn`,
            headers: JSON.parse(yml_xmlyhd),
            body: yml_xmlybody,
        }
        $.post(url, async (err, resp, data) => {
            try {

                data = JSON.parse(data)

                if (data.data.code == 0) {
                    console.log(`【🎉🎉🎉 恭喜您鸭 🎉🎉🎉】签到状态:签到成功  ✅ `)
                } else {
                    console.log(`【🎉 恭喜个屁 🎉】签到状态:失败 ❌ 了呢,${data.data.msg} `)
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)
    })
}


// 签到  ql执行
// http://hybrid.ximalaya.com/web-activity/signIn/v2/signIn
function yml_xmly_qd(timeout = 3 * 1000) {
    return new Promise((resolve, reject) => {
        let url = {
            url: `http://hybrid.ximalaya.com/web-activity/signIn/v2/signIn`,
            headers: {
                'Content-Type': 'application/json',
                "Cookie": yml_xmly_cookie
            },
            body: JSON.stringify({
                "aid": 87
            })

        }
        // console.log(url);
        $.post(url, async (error, response, data) => {
            try {
                // console.log(data)
                let result = JSON.parse(data);
                console.log(`开始尝试执行签到任务`)
                if (result.data.code == 0) {

                    console.log(`【🎉🎉🎉 恭喜您鸭 🎉🎉🎉】签到状态:${result.data.msg}  ✅ `)

                } else if (result.data.code == -2) {

                    console.log(`【🎉 恭喜个屁 🎉】签到状态:未能成功签到,原因是${result.data.msg} `)

                } else {
                    console.log(`【🎉 恭喜个屁 🎉】签到状态:失败 ❌ 了呢,原因未知! `)
                }

            } catch (e) {
                console.log(e)
            } finally {
                resolve();
            }
        }, timeout)
    })
}


function Env(t, e) {
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
            this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`)
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
            } catch {
            }
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
                const [o, h] = i.split("@"), a = {
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
                this.post(a, (t, e, i) => s(i))
            }).catch(t => this.logErr(t))
        }

        loaddata() {
            if (!this.isNode()) return {};
            {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile),
                    e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t),
                    i = !s && this.fs.existsSync(e);
                if (!s && !i) return {};
                {
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
                const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i),
                    h = i ? "null" === o ? null : o || "{}" : "{}";
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

        get(t, e = (() => {
        })) {
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
                        this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
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

        post(t, e = (() => {
        })) {
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

        time(t) {
            let e = {
                "M+": (new Date).getMonth() + 1,
                "d+": (new Date).getDate(),
                "H+": (new Date).getHours(),
                "m+": (new Date).getMinutes(),
                "s+": (new Date).getSeconds(),
                "q+": Math.floor(((new Date).getMonth() + 3) / 3),
                S: (new Date).getMilliseconds()
            };
            /(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + "").substr(4 - RegExp.$1.length)));
            for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length)));
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
            this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r)));
            let h = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];
            h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n")), this.logs = this.logs.concat(h)
        }

        log(...t) {
            t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
        }

        logErr(t, e) {
            const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
            s ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t)
        }

        wait(t) {
            return new Promise(e => setTimeout(e, t))
        }

        done(t = {}) {
            const e = (new Date).getTime(),
                s = (e - this.startTime) / 1e3;
            this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
        }
    }(t, e)
}