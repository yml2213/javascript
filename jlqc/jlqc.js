/*
cron 18 7 * * * yml_javascript/jlqc.js

软件名称：吉利汽车 app
下载地址：应用商店自行下载
收益: 只有积分,要很久才能换东西  自行决定跑不跑

3-20   签到任务 进行双平台脚本测试,青龙加圈x
感谢所有测试人员

注意事项 ： 一定要仔细阅读一下内容
              青龙填写格式
=============青龙变量格式=============
export yml_jlqc_data='token1@token2'
 多账号使用 @ 分割；
(给小白啰嗦一句:export XXX ==> 是青龙 "配置文件" 变量格式; 如果要在 "环境变量" 中添加,不需要export)
=============青龙变量实例=============
export yml_jlqc_token='6ac76a12-a014-4421-92a8-3d1a9a9e1c40'
=============变量解释==========
只需要自己抓包一个token即可
=============变量获取==========
懒得写了，自己研究吧

              圈x填写格式
============= mimt(主机名) =============
mimt= app.geely.com
============= 重写 =============
https://app.geely.com/api/v1/user/sign  url  script-request-body  https://raw.githubusercontent.com/yml2213/javascript/master/jlqc/jlqc.js

还是不会的请百度或者群里求助：QQ群：1001401060  tg：https://t.me/yml_tg

*/


const $ = new Env('吉利汽车');
const notify = $.isNode() ? require('./sendNotify') : '';
let app_yml_jlqc_token = []

// 圈x
let status;
status = (status = ($.getval("yml_jlqcstatus") || "1")) > 1 ? `${status}` : "";
const yml_jlqcurlArr = [], yml_jlqchdArr = [], yml_jlqcbodyArr = [], yml_jlqccount = ''
let yml_jlqcurl = $.getdata('yml_jlqcurl')
let yml_jlqchd = $.getdata('yml_jlqchd')
let yml_jlqcbody = $.getdata('yml_jlqcbody')

!(async () => {
    if ($.isNode()) {
        if (!process.env.yml_jlqc_token) {
            console.log(`\n【${$.name}】：未填写相应变量 yml_jlqc_token`);
            return;
        }

        if (process.env.yml_jlqc_token && process.env.yml_jlqc_token.indexOf('@') > -1) {
            yml_jlqc_token = process.env.yml_jlqc_token.split('@');
        } else if (process.env.yml_jlqc_token && process.env.yml_jlqc_token.indexOf('\n') > -1) {
            yml_jlqc_token = process.env.yml_jlqc_token.split('\n');
        } else {
            yml_jlqc_token = process.env.yml_jlqc_token.split();
        }

        Object.keys(yml_jlqc_token).forEach((item) => {
            if (yml_jlqc_token[item]) {
                app_yml_jlqc_token.push(yml_jlqc_token[item]);
            }
        });

    } else {
        if (typeof $request !== "undefined") {

            yml_jlqcck()

        } else {
            yml_jlqcurlArr.push($.getdata('yml_jlqcurl'))
            yml_jlqchdArr.push($.getdata('yml_jlqchd'))
            yml_jlqcbodyArr.push($.getdata('yml_jlqcbody'))

            let yml_jlqccount = ($.getval('yml_jlqccount') || '1');

            for (let i = 2; i <= yml_jlqccount; i++) {

                yml_jlqcurlArr.push($.getdata(`yml_jlqcurl${i}`))
                yml_jlqchdArr.push($.getdata(`yml_jlqchd${i}`))
                yml_jlqcbodyArr.push($.getdata(`yml_jlqcbody${i}`))

            }

            console.log(
                `\n\n=============================================== 脚本执行 - 北京时间(UTC+8)：${new Date(
                    new Date().getTime() +
                    new Date().getTimezoneOffset() * 60 * 1000 +
                    8 * 60 * 60 * 1000
                ).toLocaleString()} ===============================================\n`);

            for (let i = 0; i < yml_jlqchdArr.length; i++) {

                if (yml_jlqchdArr[i]) {

                    yml_jlqcurl = yml_jlqcurlArr[i];
                    yml_jlqchd = yml_jlqchdArr[i];
                    yml_jlqcbody = yml_jlqcbodyArr[i];

                    $.index = i + 1;
                    console.log(`\n\n开始【吉利汽车${$.index}】`)


                    //循环运行
                    for (let c = 0; c < 1; c++) {
                        $.index = c + 1

                        await jlqcqd_qx()//你要执行的版块
                        await $.wait(2 * 1000); //你要延迟的时间  1000=1秒

                    }
                }
            }
        }
    }


    console.log(
        `\n=== 脚本执行 - 北京时间：${new Date(
            new Date().getTime() +
            new Date().getTimezoneOffset() * 60 * 1000 +
            8 * 60 * 60 * 1000
        ).toLocaleString()} ===\n`
    );

    await wyy();

    console.log(`===【共 ${app_yml_jlqc_token.length} 个账号】===\n`);
    for (i = 0; i < app_yml_jlqc_token.length; i++) {
        yml_jlqc_token = app_yml_jlqc_token[i]
        // console.log(yml_jlqc_token)

        $.index = i + 1;
        console.log(`\n开始【第 ${$.index} 个账号任务】`);

        //执行任务
        await yml_jlqc_qd()
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

function yml_jlqcck() {
    if ($request.url.indexOf("sign") > -1) {
        const yml_jlqcurl = $request.url
        if (yml_jlqcurl) $.setdata(yml_jlqcurl, `yml_jlqcurl${status}`)
        $.log(yml_jlqcurl)

        const yml_jlqchd = JSON.stringify($request.headers)
        if (yml_jlqchd) $.setdata(yml_jlqchd, `yml_jlqchd${status}`)
        $.log(yml_jlqchd)

        const yml_jlqcbody = $request.body
        if (yml_jlqcbody) $.setdata(yml_jlqcbody, `yml_jlqcbody${status}`)
        $.log(yml_jlqcbody)

        $.msg($.name, "", `吉利汽车${status}获取headers成功`)

    }
}
// 签到
// https://app.geely.com/api/v1/user/sign/
function jlqcqd_qx(timeout = 0) {
    return new Promise((resolve) => {

        let url = {
            url: `https://app.geely.com/api/v1/user/sign/`,
            headers: JSON.parse(yml_jlqchd),
            body: yml_jlqcbody,
        }
        $.post(url, async (err, resp, data) => {
            try {

                data = JSON.parse(data)

                if (data.code == success) {

                    console.log(`【🎉🎉🎉 恭喜您鸭 🎉🎉🎉】签到状态:签到成功  ✅ `)


                } else {

                    console.log(`\n【🎉 恭喜个屁 🎉】签到转态:失败 ❌ 了呢,${data.message} `)
                }
            } catch (e) {

            } finally {
                resolve()
            }
        }, timeout)
    })
}





// 签到  ql执行
// https://app.geely.com/api/v1/user/sign/
function yml_jlqc_qd(timeout = 3 * 1000) {
    return new Promise((resolve, reject) => {
        let url = {
            url: `https://app.geely.com/api/v1/user/sign/`,
            headers: {
                "token":yml_jlqc_token,
            },
            body : '',

        }
        // console.log(url);
        $.post(url,async (error, response, data) => {
            try {
                // console.log(data)
                let result = JSON.parse(data);
                if (result.code == success) {

                    console.log(`【🎉🎉🎉 恭喜您鸭 🎉🎉🎉】签到状态:签到成功  ✅ `)

                } else {
                    console.log(`\n【🎉 恭喜个屁 🎉】签到转态:失败 ❌ 了呢 `)
                }

            } catch (e) {
                console.log(e)
            } finally {
                resolve();
            }
        },timeout)
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