/*
cron 18 7 * * * yml_javascript/xlh.js

软件名称：骁龙会 微信小程序
羊毛地址：微信扫码打开
收益: 只有积分,可以换购b站会员欧   自行决定跑不跑

3-22   签到任务 、 阅读5/15分钟任务 完成，商城任务暂时没写   有效期测试中 
计划行双平台脚本测试,青龙完成  圈x还在写 
感谢所有测试人员

注意事项 ： 一定要仔细阅读一下内容
              青龙填写格式
=============青龙变量格式=============
必填变量：  export yml_xlh_data='xxx&xxxx@xxx&xxxx'   
可选变量    yml_xlh_UA='xxxxxx'
 多账号使用 @ 分割；
(再给小白啰嗦一句:export XXX ==> 是青龙 "配置文件" 变量格式; 如果要在 "环境变量" 中添加,不需要export)
=============青龙变量实例=============
export yml_xlh_data='6ac76a12-a014-4421-92a8-3d1a9a9e1c40'
=============变量解释==========
sessionKey&userId    抓包小程序即可  随便一个包就有相关变量
UA是 User-Agent 的简称   自己填写自己抓包的即可，不填使用默认UA
=============变量获取==========
懒得写了，自己研究吧

            
              圈x填写格式  
============= mimt(主机名) =============
mimt= 
============= 重写 =============
xxxx  url  script-request-body  xxxxx

还是不会的请百度或者群里求助：QQ群：1001401060  tg：https://t.me/yml_tg

*/


const $ = new Env('骁龙会');
const notify = $.isNode() ? require('./sendNotify') : '';
let wx_yml_xlh_data = [], yml_xlh_UA = [] , wx_yml_xlh_UA = [];


// 圈x声明变量
let status;
status = (status = ($.getval("yml_xlhstatus") || "1")) > 1 ? `${status}` : "";
const yml_xlhurlArr = [], yml_xlhhdArr = [], yml_xlhbodyArr = [], yml_xlhcount = ''
let yml_xlhurl = $.getdata('yml_xlhurl')
let yml_xlhhd = $.getdata('yml_xlhhd')
let yml_xlhbody = $.getdata('yml_xlhbody')


// 开始执行脚本
!(async () => {
    if ($.isNode()) {
        if (!process.env.yml_xlh_data) {
            console.log(`\n【${$.name}】：未填写 必填 变量 yml_xlh_data`);
            return;
        }
        // UA判断部分
        if (!process.env.yml_xlh_UA) {
            console.log(`\n【${$.name}】：未填写 UA 变量 yml_xlh_UA ,将默认分配一个`);
        } else {
            if (process.env.yml_xlh_UA && process.env.yml_xlh_UA.indexOf('@') > -1) {
                yml_xlh_UA = process.env.yml_xlh_UA.split('@');
            } else if (process.env.yml_xlh_UA && process.env.yml_xlh_UA.indexOf('\n') > -1) {
                yml_xlh_UA = process.env.yml_xlh_UA.split('\n');
            } else {
                yml_xlh_UA = process.env.yml_xlh_UA.split();
            }
        }

        Object.keys(yml_xlh_UA).forEach((item) => {
            if (yml_xlh_UA[item]) {
                wx_yml_xlh_UA.push(yml_xlh_UA[item]);
            }
            ;
        });



        // 必要变量判断部分
        if (process.env.yml_xlh_data && process.env.yml_xlh_data.indexOf('@') > -1) {
            yml_xlh_data = process.env.yml_xlh_data.split('@');
        } else if (process.env.yml_xlh_data && process.env.yml_xlh_data.indexOf('\n') > -1) {
            yml_xlh_data = process.env.yml_xlh_data.split('\n');
        } else {
            yml_xlh_data = process.env.yml_xlh_data.split();
        }

        Object.keys(yml_xlh_data).forEach((item) => {
            if (yml_xlh_data[item]) {
                wx_yml_xlh_data.push(yml_xlh_data[item]);
            }
        });

    } else {
        if (typeof $request !== "undefined") {

            yml_xlhck()

        } else {
            yml_xlhurlArr.push($.getdata('yml_xlhurl'))
            yml_xlhhdArr.push($.getdata('yml_xlhhd'))
            yml_xlhbodyArr.push($.getdata('yml_xlhbody'))

            let yml_xlhcount = ($.getval('yml_xlhcount') || '1');

            for (let i = 2; i <= yml_xlhcount; i++) {

                yml_xlhurlArr.push($.getdata(`yml_xlhurl${i}`))
                yml_xlhhdArr.push($.getdata(`yml_xlhhd${i}`))
                yml_xlhbodyArr.push($.getdata(`yml_xlhbody${i}`))

            }

            console.log(
                `\n\n=============================================== 脚本执行 - 北京时间(UTC+8)：${new Date(
                    new Date().getTime() +
                    new Date().getTimezoneOffset() * 60 * 1000 +
                    8 * 60 * 60 * 1000
                ).toLocaleString()} ===============================================\n`);

            for (let i = 0; i < yml_xlhhdArr.length; i++) {

                if (yml_xlhhdArr[i]) {

                    yml_xlhurl = yml_xlhurlArr[i];
                    yml_xlhhd = yml_xlhhdArr[i];
                    yml_xlhbody = yml_xlhbodyArr[i];

                    $.index = i + 1;
                    console.log(`\n\n开始【骁龙会${$.index}】`)


                    //循环运行
                    for (let c = 0; c < 1; c++) {
                        $.index = c + 1

                        await xlhqd_qx()//你要执行的版块
                        await $.wait(2 * 1000); //你要延迟的时间  1000=1秒
                        return

                    }
                }
            }
        }
    }

    // 脚本开始执行
    console.log(`\n=== 脚本执行 - 北京时间：${new Date(new Date().getTime() + new Date().getTimezoneOffset()
        * 60 * 1000 + 8 * 60 * 60 * 1000).toLocaleString()} ===\n`);

    await wyy();

    console.log(`===【共 ${wx_yml_xlh_data.length} 个账号】===\n`);
    for (i = 0; i < wx_yml_xlh_data.length; i++) {

        yml_xlh_UA = wx_yml_xlh_UA[i]
        if (!yml_xlh_UA) {
            yml_xlh_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.18(0x18001239) NetType/WIFI Language/zh_CN'
        }
        // console.log(yml_xlh_UA);

        yml_xlh_data = wx_yml_xlh_data[i].split('&');

        // console.log(wx_yml_xlh_data);
        // console.log(yml_xlh_data[0])
        // console.log(yml_xlh_data[1])

        // console.log(userId[1]);

        $.index = i + 1;
        console.log(`\n开始【第 ${$.index} 个账号任务】`);

        //执行任务
        // 签到
        await yml_xlh_sign()
        await $.wait(2 * 1000);

        // 获取文章列表
        await yml_xlh_articles()
        await $.wait(2 * 1000);

        // 阅读文章
        await yml_xlh_enterRead()
        await $.wait(2 * 1000);

        // 停止阅读文章
        await yml_xlh_exitRead()
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

function yml_xlhck() {
    if ($request.url.indexOf("sign.do") > -1) {
        const yml_xlhurl = $request.url
        if (yml_xlhurl) $.setdata(yml_xlhurl, `yml_xlhurl${status}`)
        $.log(yml_xlhurl)

        const yml_xlhhd = JSON.stringify($request.headers)
        if (yml_xlhhd) $.setdata(yml_xlhhd, `yml_xlhhd${status}`)
        $.log(yml_xlhhd)

        const yml_xlhbody = $request.body
        if (yml_xlhbody) $.setdata(yml_xlhbody, `yml_xlhbody${status}`)
        $.log(yml_xlhbody)

        $.msg($.name, "", `骁龙会${status}获取headers成功`)

    }
}
// 签到
function xlhqd_qx(timeout = 0) {
    return new Promise((resolve) => {

        let url = {
            url: yml_xlhurl,
            headers: JSON.parse(yml_xlhhd),
            // body: yml_xlhbody,
        }
        console.log(`=========url=========`)
        console.log(url)
        $.get(url, async (err, resp, data) => {
            try {

                data = JSON.parse(data)
                console.log(data)

                if (data.code == 1) {

                    console.log(`【🎉🎉🎉 签到状态 🎉🎉🎉】: ${result.data.msg}`)


                }
            } catch (e) {

            } finally {
                resolve()
            }
        }, timeout)
    })
}





// 签到  ql执行
// https://qualcomm.growthideadata.com/qualcomm-app/api/user/signIn?userId=281687
function yml_xlh_sign(timeout = 3 * 1000) {
    return new Promise((resolve, reject) => {
        let url = {
            url: `https://qualcomm.growthideadata.com/qualcomm-app/api/user/signIn?userId=${yml_xlh_data[1]}`,
            headers: {

                "userId": yml_xlh_data[1],
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                "Host": "qualcomm.growthideadata.com",
                "User-Agent": yml_xlh_UA,
                "sessionKey": yml_xlh_data[0],
                "Referer": "https://servicewechat.com/wx026c06df6adc5d06/176/page-frame.html",
                "Connection": "keep-alive"
            },

        }
        // console.log(`===================这是请求url===================`);
        // console.log(url);
        $.get(url, async (error, response, data) => {
            try {
                // console.log(`===================这是返回data===================`);
                // console.log(data)
                let result = JSON.parse(data);
                if (result.code == 200) {
                    console.log(`【🎉🎉🎉 签到状态 🎉🎉🎉】 ${result.message}`)
                } else if (result.code === 1) {
                    $.log(`\n【🎉🎉🎉 签到状态 🎉🎉🎉】 未能成功签到 ,可能是:${result.message}!\n `)
                }
                else {
                    $.log(`\n【🎉 恭喜个屁 🎉】执行签到:失败 ❌ 了呢,可能是被外星人偷走了!\n `)
                }

            } catch (e) {
                console.log(e)
            } finally {
                resolve();
            }
        }, timeout)
    })
}


// 阅读任务部分
// 获取文章列表,随机选择一篇文章获取 articleId 
function yml_xlh_articles(timeout = 3 * 1000) {
    return new Promise((resolve, reject) => {

        let d = new Date();
        let y = d.getFullYear();
        let m = d.getMonth() + 1;
        m = m.toString();
        if (m.length == 1) {
            m = `0${m}`
        }
        let time = `${y}-${m}`;
        // console.log(time);

        let url = {
            url: `https://qualcomm.growthideadata.com/qualcomm-app/api/home/articles?page=1&size=20&userId=${yml_xlh_data[1]}&labelId=&searchDate=${time}&showType=0`,
            headers: {

                "userId": yml_xlh_data[1],
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                "Host": "qualcomm.growthideadata.com",
                "User-Agent": yml_xlh_UA,
                "sessionKey": yml_xlh_data[0],
                "Referer": "https://servicewechat.com/wx026c06df6adc5d06/176/page-frame.html",
                "Connection": "keep-alive"
            },

        }
        // console.log(`===================这是请求url===================`);
        // console.log(url);

        $.get(url, async (error, response, data) => {
            try {

                // console.log(`===================这是返回data===================`);
                // console.log(data)

                let result = JSON.parse(data);
                if (result.code == 200) {
                    console.log(`【🎉🎉🎉 恭喜 🎉🎉🎉】\n 文章列表刷新成功了鸭!\n`)

                    console.log(`\n 请耐心等待 5 s\n`)
                    await $.wait(5 * 1000);

                    // 随机1-10 数字
                    let num = Math.floor(Math.random() * 10 + 1);
                    // console.log(num);

                    // 获取 articleId
                    articleId = result.data.articleList[num].id;
                    // console.log(articleId);
                    // 获取 title
                    title = result.data.articleList[num].title;
                    // console.log(title);

                }

            } catch (e) {
                console.log(error)
            } finally {
                resolve();
            }
        }, timeout)
    })
}


// 开始阅读
// https://qualcomm.growthideadata.com/qualcomm-app/api/article/enterRead?articleId=7626&userId=281687
function yml_xlh_enterRead(timeout = 3 * 1000) {
    return new Promise((resolve, reject) => {
        let url = {
            url: `https://qualcomm.growthideadata.com/qualcomm-app/api/article/enterRead?articleId=${articleId}&userId=${yml_xlh_data[1]}`,
            headers: {

                "userId": yml_xlh_data[1],
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                "Host": "qualcomm.growthideadata.com",
                "User-Agent": yml_xlh_UA,
                "sessionKey": yml_xlh_data[0],
                "Referer": "https://servicewechat.com/wx026c06df6adc5d06/176/page-frame.html",
                "Connection": "keep-alive"
            },

        }
        // console.log(`===================这是请求url===================`);
        // console.log(url);

        $.get(url, async (error, response, data) => {
            try {

                // console.log(`===================这是返回data===================`);
                // console.log(data)

                let result = JSON.parse(data);
                if (result.code == 200) {
                    console.log(`【🎉🎉🎉 尝试阅读${result.message} 🎉🎉🎉】\n恭喜你，开始阅读文章${title}\n 请耐心等待16分钟,你可以去做别的事情了鸭!\n`)

                    await $.wait(10 * 1000);
                    console.log(`\n 请耐心等待16分钟,你可以去做别的事情了鸭!`)

                    await $.wait(10 * 1000);
                    console.log(`\n 请耐心等待16分钟,你可以去做别的事情了鸭!`)

                    await $.wait(960 * 1000);


                }

            } catch (e) {
                console.log(error)
            } finally {
                resolve();
            }
        }, timeout)
    })
}


// 停止阅读
// https://qualcomm.growthideadata.com/qualcomm-app/api/article/enterRead?articleId=7626&userId=281687
// https://qualcomm.growthideadata.com/qualcomm-app/api/article/exitRead?articleId=7626&userId=281687
function yml_xlh_exitRead(timeout = 3 * 1000) {
    return new Promise((resolve, reject) => {
        let url = {
            url: `https://qualcomm.growthideadata.com/qualcomm-app/api/article/exitRead?articleId=${articleId}&userId=${yml_xlh_data[1]}`,
            headers: {

                "userId": yml_xlh_data[1],
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                "Host": "qualcomm.growthideadata.com",
                "User-Agent": yml_xlh_UA,
                "sessionKey": yml_xlh_data[0],
                "Referer": "https://servicewechat.com/wx026c06df6adc5d06/176/page-frame.html",
                "Connection": "keep-alive"
            },

        }
        // console.log(`===================这是请求url===================`);
        // console.log(url);

        $.get(url, async (error, response, data) => {
            try {

                // console.log(`===================这是返回data===================`);
                // console.log(data)

                let result = JSON.parse(data);
                if (result.code == 200) {
                    console.log(`【🎉🎉🎉 停止阅读${result.message} 🎉🎉🎉】\n恭喜你,停止阅读文章${title}\n 快去看看你的任务完成了吗!\n`)

                    await $.wait(2 * 1000);

                }

            } catch (e) {
                console.log(error)
            } finally {
                resolve();
            }
        }, timeout)
    })
}










// 默认  不用管
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