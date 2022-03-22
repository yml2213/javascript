/*
cron 8 7 * * * yml_javascript/sytt.js

软件名称：十堰头条
下载地址：http://appx.10yan.com.cn/appshare/
或者自己搜索下载
3-17   完成签到、评论、分享、回帖 任务
3-21   关闭评论、回帖功能   需要的自行打开，并自行设置回复内容
感谢所有测试人员

自行安装  axios  qs  依赖；  自行安装 axios  qs  依赖；  自行安装  axios  qs  依赖；
青龙直接node中安装就行

注意事项 ： 一定要仔细阅读一下内容
=============青龙变量格式=============
export yml_sytt_data='手机号&密码'
 多账号使用 @ 分割；

=============青龙变量实例=============
我觉得已经不需要例子了 填上账号密码再不回那就别薅羊毛了吧
=============变量解释==========
手机号 密码 填入自己的数据就行
=============变量获取==========
懒得写了，自己研究吧
不会的请百度或者群里求助：QQ群：1001401060  tg：https://t.me/yml_tg

*/
const axios = require("axios");
const qs = require("qs");
const $ = new Env('十堰头条');
const notify = $.isNode() ? require('./sendNotify') : '';
let app_yml_sytt_data='';
let user = '';
let pwd = '';
let uid;
// 这里设置评论内容  打开的请 自行修改内容   默认关闭
// 回帖评论
let htpl='十堰太美了呀！'
// 评论红包
let plhb='十堰太美了呀！'


!(async () => {
    if ($.isNode()) {
        //$.isNode()环境执行部分  青龙执行
        if (!process.env.yml_sytt_data) {
            console.log(`\n【${$.name}】：未填写相应变量 yml_sytt_data`);
            return;
        }
        if (process.env.yml_sytt_data && process.env.yml_sytt_data.indexOf('@') > -1) {
            app_yml_sytt_data = process.env.yml_sytt_data.split('@');
        }else {
            app_yml_sytt_data = process.env.yml_sytt_data.split();
        }
    }
    console.log(`=============================更新内容==================================`)
    console.log(`\n3-21   默认关闭评论、回帖功能；需要的自行打开，并自行设置回复内容，脚本内有清晰注释\n\n`)

    console.log(`-------- 共 ${app_yml_sytt_data.length} 个账号 --------`)
    // console.log(app_yml_sytt_data)
    console.log(
        `\n====== 脚本执行 - 北京时间(UTC+8)：${new Date(
            new Date().getTime() +
            new Date().getTimezoneOffset() * 60 * 1000 +
            8 * 60 * 60 * 1000
        ).toLocaleString()} ======\n`);


    await wyy();

    for (i = 0; i < app_yml_sytt_data.length; i++) {
        $.index = i + 1;
        console.log(`\n====== 开始【第 ${$.index} 个账号】======`)
        // console.log(`这里是分割后:${app_yml_sytt_data}`);
        data = app_yml_sytt_data[i].split('&');
        // console.log(`====== ${data}`)
        user = data[0]
        // console.log(`====user==== ${user}`)
        pwd = data[1]
        // console.log(`====pwd==== ${pwd}`)

        //执行任务
        await syttdl();
        await $.wait(2 * 1000);
        await cxsy();
        await $.wait(2 * 1000);
        await syttqd();
        await $.wait(2 * 1000);
        await fxwz();
        await $.wait(2 * 1000);

        
        // 发布评论（评论红包）
        // await plid();
        // await $.wait(2 * 1000);

         
        //  回复帖子
        // await tzid();
        // await $.wait(2 * 1000);
    }

})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())


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


// 登录
function syttdl(timeout = 0) {
    urldl = `https://app.site.10yan.com.cn/index.php?s=/Api/Loginv3/signInv3&password=${pwd}&username=${user}`
    // console.log(urldl)
    return new Promise((resolve) => {
        let url = {
            url: urldl,
            headers: { } ,
            body: '',
        }
        // console.log(url);
        $.post(url, async (err, resp, data) => {
            try {
                // console.log(`输出 登录 data开始===================`);
                // console.log(data);
                // console.log(`输出 登录 data结束===================`);
                result = JSON.parse(data);
                if (result.code == "200") {
                    console.log(`登录用户： ${user}`)
                    $.log(`\n【🎉🎉🎉 恭喜您鸭 🎉🎉🎉】登录状态: ${result.retinfo} ✅ `)
                    // await $.wait(3 * 1000)
                }else {
                    $.log(`\n【🎉 恭喜个屁 🎉】登录状态:${result.retinfo} `)
                }
                uid = result.data.uid
                console.log(`这是你的用户id：uid=${uid}`)
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)

    })
}


// 查询收益
function cxsy(timeout = 0) {
    return new Promise((resolve) => {
        let url = {
            url: `https://app.site.10yan.com.cn/index.php?s=/Api/Activityv1/minemonetotal&id=5&uid=${uid}&source=android&ver=6.2.3&build=145`,
            headers:'',
        }
        // console.log(url);
        $.get(url, async (err, resp, data) => {
            try {
                // console.log(`========输出签到 data开始===========`);
                // console.log(data);
                // console.log(`========输出签到 data结束=========`);
                result = JSON.parse(data);
                if (result.code == 200) {
                    $.log(`\n【🎉🎉🎉 查询收益 🎉🎉🎉】\n 今日收益${result.data.todaymoney} \n 累计收益${result.data.totalmoney} \n 待提现 ${result.data.cashmoney}   💪🏻 `)
                    // await $.wait(3 * 1000)
                }else {
                    $.log(`\n【🎉🎉🎉 查询收益 🎉🎉🎉】:失败 ❌ 了呢,原因未知! `)
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)

    })
}



// 签到
function syttqd(timeout = 0) {
    return new Promise((resolve) => {
        let url = {
            url: `https://app.site.10yan.com.cn/index.php?s=/Api/Activityv1/sign&uid=${uid}&source=android&ver=6.2.3&build=145`,
            headers:'',
        }
        // console.log(url);
        $.get(url, async (err, resp, data) => {
            try {
                // console.log(`========输出签到 data开始===========`);
                // console.log(data);
                // console.log(`========输出签到 data结束=========`);
                result = JSON.parse(data);
                if (result.code == 200) {
                    $.log(`\n【🎉🎉🎉 恭喜您鸭 🎉🎉🎉】签到状态:(${result.retinfo}) ,获得 ${result.money}  ✅ `)
                    // await $.wait(3 * 1000)
                } else if (result.code == 400) {
                    $.log(`\n【🎉 恭喜个屁 🎉】签到状态: ${result.retinfo}`)
                }else {
                    $.log(`\n【🎉 恭喜个屁 🎉】执行签到:失败 ❌ 了呢,原因未知! `)
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)

    })
}

//  评论任务部分
// 评论id
function plid(timeout = 0) {
    // 获取文章id
    return new Promise((resolve) => {
        let url = {
            url: `https://app.site.10yan.com.cn/index.php?s=/Api/Newsv4/newslist&page=1&type=reply&source=android`,
            headers: {},
        }
        // console.log(url);
        $.get(url, async (err, resp, data) => {
            try {
                // console.log(`输出 data开始===================`);
                // console.log(data);
                // console.log(`输出data结束===================`);
                result = JSON.parse(data);
                for (let l = 0; l < 3; l++) {
                    // console.log(`我是l===== ${l}`)
                    wzid = result.list[l].contentid
                    console.log(`获取评论文章id=${wzid}`)
                    console.log(`开始发布评论`)
                    await fbpl();
                    console.log(`延迟5秒`)
                    await $.wait(5 * 1000);
                    console.log(`删除评论`)
                    await hqplid();
                    console.log(`\n`)
                }

            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)

    })
}
// 发布评论（评论红包）
function fbpl(timeout = 0) {
    let axios = require('axios')
    axios
        .post(`https://app.site.10yan.com.cn/index.php?s=/Api/Article/artReply/&actiontype=12&contentid=${wzid}&reply=${plhb}&sessionid=801cf37e86eaa651914b3cac0c756f9a&title=%%E6%%88%%91%%E5%%B8%%82%%E4%%B8%%80%%E5%%BD%%A9%%E5%%8F%%8B%%E5%%88%%AE%%E4%%B8%%AD%%E2%%80%%9C%%E5%%A5%%BD%%E8%%BF%%90%%E5%%8D%%81%%E5%%80%%8D%%E2%%80%%9D%%E5%%A4%%B4%%E5%%A5%%9640%%E4%%B8%%87&uid=${uid}&source=android&build=145`, {
        })
        .then(res => {
            // console.log(res.data)
        })
        .catch(error => {
            console.error(error)
        })
}
// 获取评论 rid 并 删除评论
function hqplid(timeout = 0) {
    let axios = require('axios');
    let config = {
        method: 'get',
        url: `https://app.site.10yan.com.cn/index.php?s=/Api/Article/index/&contentid=${wzid}&page=1&uid=${uid}`,
        headers: { }
    };
    axios(config)
        .then(function (response) {
            // console.log(`===========`)
            // console.log(JSON.stringify(response.data));
            // pl_data =response.data.list
            // console.log(pl_data)
            for ( k = 0; k < response.data.list.length; k++) {
                usid = response.data.list[k].userid;
                // console.log(usid)
                if (usid == `${uid}`) {
                    // console.log(`====rid 开始=====`)
                    // console.log(response.data.list[k].pid)
                    // console.log(`=====rid 结束=====`)
                    // rid = response.data.list[i].pid
                    rid = response.data.list[k].pid
                    // console.log(`我是 rid ${rid}`)

                    // 删除评论
                    let axios = require('axios');
                    let qs = require('qs');
                    let data = qs.stringify({
                        'rid': `${rid}`,
                        'uid': `${uid}`,
                        // 'source': 'android',
                        'ver': '6.2.3',
                        'build': '145'
                    });
                    let config = {
                        method: 'post',
                        url: 'https://app.site.10yan.com.cn/index.php?s=/Api/Article/delReply/',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data : data
                    };

                    axios(config)
                        .then(function (response) {
                            // console.log(JSON.stringify(response.data));
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

// 分享任务部分
// 分享
function fxwz(timeout = 0) {
    // 获取分享文章列表 id
    return new Promise((resolve) => {
        let url = {
            url: `https://app.site.10yan.com.cn/index.php?s=/Api/Newsv4/newslist&page=1&type=share&ver=6.2.3`,
            headers: {},
        }
        // console.log(url);
        $.get(url, async (err, resp, data) => {
            try {
                // console.log(`输出 data开始===================`);
                // console.log(data);
                // console.log(`输出data结束===================`);
                result = JSON.parse(data);
                for (let m = 0; m < 3; m++) {
                    // console.log(`我是m===== ${m}`)
                    fxwzid = result.list[m].contentid
                    console.log(`获取分享文章id=${fxwzid}`)
                    console.log(`开始分享文章`)
                    await fxwz1();
                    console.log(`延迟5秒`)
                    await $.wait(5 * 1000);
                    console.log(`\n`)
                }

            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)

    })
}

// 文章分享调用函数
function fxwz1(timeout = 0) {
    let axios = require('axios');
    let config = {
        method: 'get',
        url: `https://app.site.10yan.com.cn/index.php?s=/Api/Activityv1/getNewsShareTask&contentid=${fxwzid}&uid=${uid}&source=android&ver=6.2.3`,
        headers: { }
    };

    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });

}


// 帖子id
function tzid(timeout = 0) {
    // 获取帖子 文章id
    return new Promise((resolve) => {
        let url = {
            url: `https://app.site.10yan.com.cn/index.php?s=/Api/Dynamic&isrecommend=1&page=1&uid=${uid}`,
            headers: {},
        }
        // console.log(url);
        $.get(url, async (err, resp, data) => {
            try {
                // console.log(`输出data开始===================`);
                // console.log(data);
                // console.log(`输出data结束===================`);
                result = JSON.parse(data);
                for (let n = 0; n < 3; n++) {
                    tzid1 = result.data[n].id
                    console.log(`开始回帖：id=${tzid1}`)
                    await tzpl();
                    console.log(`延迟5秒`)
                    await $.wait(5 * 1000);
                    console.log(`\n`)
                }

            } catch (e) {
                // $.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)

    })
}
// 帖子发布评论
function tzpl(timeout = 0) {
    var axios = require('axios');
    var data = `content=${htpl}&pid=${tzid1}&uid=${uid}&source=android&ver=6.2.3&build=145`
    var config = {
        method: 'post',
        url: 'https://app.site.10yan.com.cn/index.php?s=/Api/Dynamic/reply',
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        data : data
    };

    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });

}











//固定板块，无需动
function Env(t, e) {
    class s {
        constructor(t) {
            this.env = t
        }

        send(t, e = "GET") {
            t = "string" == typeof t ? {url: t} : t;
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
            this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.encoding = "utf-8", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`)
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

        isShadowrocket() {
            return "undefined" != typeof $rocket
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
                this.get({url: t}, (t, s, i) => e(i))
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
                    body: {script_text: t, mock_type: "cron", timeout: r},
                    headers: {"X-Key": o, Accept: "*/*"}
                };
                this.post(n, (t, e, i) => s(i))
            }).catch(t => this.logErr(t))
        }

        loaddata() {
            if (!this.isNode()) return {};
            {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e);
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
                const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data);
                s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r)
            }
        }

        lodash_get(t, e, s) {
            const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
            let r = t;
            for (const t of i) if (r = Object(r)[t], void 0 === r) return s;
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
            if (t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {"X-Surge-Skip-Scripting": !1})), $httpClient.get(t, (t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
            }); else if (this.isQuanX()) this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {hints: !1})), $task.fetch(t).then(t => {
                const {statusCode: s, statusCode: i, headers: r, body: o} = t;
                e(null, {status: s, statusCode: i, headers: r, body: o}, o)
            }, t => e(t)); else if (this.isNode()) {
                let s = require("iconv-lite");
                this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
                    try {
                        if (t.headers["set-cookie"]) {
                            const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
                            s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
                        }
                    } catch (t) {
                        this.logErr(t)
                    }
                }).then(t => {
                    const {statusCode: i, statusCode: r, headers: o, rawBody: h} = t;
                    e(null, {status: i, statusCode: r, headers: o, rawBody: h}, s.decode(h, this.encoding))
                }, t => {
                    const {message: i, response: r} = t;
                    e(i, r, r && s.decode(r.rawBody, this.encoding))
                })
            }
        }

        post(t, e = (() => {
        })) {
            const s = t.method ? t.method.toLocaleLowerCase() : "post";
            if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {"X-Surge-Skip-Scripting": !1})), $httpClient[s](t, (t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
            }); else if (this.isQuanX()) t.method = s, this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {hints: !1})), $task.fetch(t).then(t => {
                const {statusCode: s, statusCode: i, headers: r, body: o} = t;
                e(null, {status: s, statusCode: i, headers: r, body: o}, o)
            }, t => e(t)); else if (this.isNode()) {
                let i = require("iconv-lite");
                this.initGotEnv(t);
                const {url: r, ...o} = t;
                this.got[s](r, o).then(t => {
                    const {statusCode: s, statusCode: r, headers: o, rawBody: h} = t;
                    e(null, {status: s, statusCode: r, headers: o, rawBody: h}, i.decode(h, this.encoding))
                }, t => {
                    const {message: s, response: r} = t;
                    e(s, r, r && i.decode(r.rawBody, this.encoding))
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
                if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {"open-url": t} : this.isSurge() ? {url: t} : void 0;
                if ("object" == typeof t) {
                    if (this.isLoon()) {
                        let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"];
                        return {openUrl: e, mediaUrl: s}
                    }
                    if (this.isQuanX()) {
                        let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl;
                        return {"open-url": e, "media-url": s}
                    }
                    if (this.isSurge()) {
                        let e = t.url || t.openUrl || t["open-url"];
                        return {url: e}
                    }
                }
            };
            if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) {
                let t = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];
                t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t)
            }
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
            const e = (new Date).getTime(), s = (e - this.startTime) / 1e3;
            this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
        }
    }(t, e)
}