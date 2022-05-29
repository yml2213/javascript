/**
 * 脚本地址: https://raw.githubusercontent.com/yml2213/javascript/master/qckf/qckf.js
 * 转载请留信息,谢谢
 *
 * 雀巢咖啡 小程序 
 *
 * cron 30 6 * * *  yml2213_javascript_master/qckf.js
 * 自己更改定时
 *
 * 5-29     完成 签到 自己培育 给好友培育 分享 等任务
 *
 * 感谢所有测试人员
 * ========= 青龙--配置文件 =========
 * 变量格式: export qckf_data='openid & unionid @ openid & unionid  '  多个账号用 换行 或 @ 分割
 * 
 * 抓包 coffeefarm.shheywow.com   找到这个关键字 body 中的 openid 和 unionid 两个参数就行了
 * 
 * tg频道: https://t.me/yml2213_tg  
 * tg群组: https://t.me/yml_tg    
 * qq频道: https://qun.qq.com/qqweb/qunpro/share?_wv=3&_wwv=128&appChannel=share&inviteCode=1W4InjV&appChannel=share&businessType=9&from=181074&biz=ka&shareSource=5
 * 
 */

const $ = new Env("雀巢咖啡");
const notify = $.isNode() ? require("./sendNotify") : "";
const Notify = 1 		//0为关闭通知,1为打开通知,默认为1
const debug = 0 		//0为关闭调试,1为打开调试,默认为0
///////////////////////////////////////////////////////////////////
let ckStr = process.env.qckf_data;
let msg = "";
let ck = "";
let lang_id = "";
let ck_status = 0;
let host = "coffeefarm.shheywow.com";
let hostname = "https://" + host;
///////////////////////////////////////////////////////////////////
let Version = '\nyml   2022/5/29-2   完成 签到 自己培育 给好友培育  '
let thank = `感谢 心雨 的投稿`
let test = `脚本测试中,有bug及时反馈! 脚本测试中,有bug及时反馈!`
///////////////////////////////////////////////////////////////////

async function tips(ckArr) {

    console.log(Version);
    msg += `${Version}`

    console.log(thank);
    msg += `${thank}`

    console.log(test);
    msg += `${test}`

    // console.log(` 脚本已恢复正常状态,请及时更新!`);
    // msg += `脚本已恢复正常状态,请及时更新`

    console.log(`==================================================\n  脚本执行 - 北京时间(UTC+8): ${new Date(
        new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000
    ).toLocaleString()} \n==================================================`);
    await wyy();
    console.log(`\n=================== 共找到 ${ckArr.length} 个账号 ===================`);
    msg += `\n =================== 共找到 ${ckArr.length} 个账号 ===================`
    debugLog(`【debug】 这是你的账号数组: \n ${ckArr} `);
}

!(async () => {
    let ckArr = await getCks(ckStr, "qckf_data");
    await tips(ckArr);
    for (let index = 0; index < ckArr.length; index++) {
        qckf_num = index + 1;
        console.log(`------------- 开始【第 ${qckf_num} 个账号】------------- `);
        msg += `\n------------- 开始【第 ${qckf_num} 个账号】------------- `
        ck = ckArr[index].split("&");
        debugLog(`【debug】 这是你第 ${qckf_num} 账号信息: \n ${ck} `);
        await start();
    }
    await SendMsg(msg);
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done());

async function start() {

    console.log("\n开始 更新token");
    await Update_token();
    await $.wait(3 * 1000);

    if (ck_status == 0) {
        console.log("\n开始 任务列表");
        await Task_List();
        await $.wait(3 * 1000);

        console.log("\n开始 用户信息");
        await user_info();
        await $.wait(3 * 1000);


        await invitation_Reward();
        await $.wait(3 * 1000);

    }
}


/**
 * 更新token    POST
 */
async function Update_token() {
    let options = {
        method: 'POST',
        url: `${hostname}/api/user/auth`,
        headers: {
            'Host': host,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "openid": `${ck[0]}`,
            "unionid": `${ck[1]}`
        }),
    };
    let result = await httpRequest(options, `更新token`);

    if (result.error_code === 0) {
        console.log(`    更新token: 成功 🎉`);
        msg += `\n     更新token: 成功 🎉`;
        _tokne = result.data.token;
        // console.log(_tokne);
        // return tokne;
    } else {
        console.log(`    更新token: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
        msg += `\n    更新token: 失败 ❌ 了呢,原因未知!`;
        return ck_status = 1;
    }
}



/**
 * 任务列表    POST
 */
async function Task_List() {
    let options = {
        method: 'POST',
        url: `${hostname}/api/user/taskv2/list`,
        headers: {
            'Host': host,
            'Authorization': `Bearer ${_tokne}`,
            'content-type': 'application/json'
        },
        body: JSON.stringify({})
    };
    let result = await httpRequest(options, `任务列表`);

    if (result.error_code === 0) {
        if (result.data.sign.status === 0) {
            console.log(`    签到状态: 今日还没签到 ,去签到喽 ,顺便分享下!🏃🏃🏃`);
            msg += `\n    签到状态: 今日还没签到 ,去签到喽 ,顺便分享下!🏃🏃🏃`;
            await SignIn();
            await $.wait(3 * 1000);

            await share();
            await $.wait(3 * 1000);
        } else {
            console.log(`    签到状态: 今日签到过了 ,明天再来吧!`);
            msg += `\n    签到状态: 今日签到过了 ,明天再来吧!`;
        }
        if (result.data.foster.status === 0) {
            console.log(`    好友培育: ${result.data.foster.num}/3`);
            msg += `\n    好友培育: ${result.data.foster.num}/3`
            if (result.data.foster.num < 3) {
                await friend_breed_info();
                await $.wait(3 * 1000);
            }
        } else {
            console.log(`    好友培育: 今日完成了 ,明天再来吧!`);
            msg += `\n    好友培育: 今日完成了 ,明天再来吧!`;
        }
    } else {
        console.log(`    任务列表: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
        msg += `\n    任务列表: 失败 ❌ 了呢,原因未知!`;
    }
}



/**
 * 签到    POST
 */
async function SignIn() {
    let options = {
        method: 'POST',
        url: `${hostname}/api/user/taskv2/sign`,
        headers: {
            'Host': host,
            'Authorization': `Bearer ${_tokne}`,
            'content-type': 'application/json'
        },
        body: JSON.stringify({})
    };
    let result = await httpRequest(options, `签到`);

    if (result.error_code === 0) {
        console.log(`    签到: 成功 ,获得 ${result.data.list[0].credit} 爱豆`);
        msg += `\n    签到: 成功 ,获得 ${result.data.list[0].credit} 爱豆`;
    } else {
        console.log(`    签到: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
        msg += `\n    签到: 失败 ❌ 了呢,原因未知!`;
    }
}


/**
 * 分享    POST
 */
async function share() {
    let options = {
        method: 'POST',
        url: `${hostname}/api/user/taskv2/share`,
        headers: {
            'Host': host,
            'Authorization': `Bearer ${_tokne}`,
            'content-type': 'application/json'
        },
        body: JSON.stringify({})
    };
    let result = await httpRequest(options, `分享`);

    if (result.error_code === 0) {
        console.log(`    分享: 成功 ,预计获得 ${result.data.credit} 爱豆`);
        msg += `\n    分享: 成功 ,预计获得 ${result.data.credit} 爱豆`;
        await share_Reward();
    } else {
        console.log(`    分享: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
        msg += `\n    分享: 失败 ❌ 了呢,原因未知!`;
    }
}



/**
 * 用户信息    POST
 */
async function user_info() {
    let options = {
        method: 'POST',
        url: `${hostname}/api/user/index`,
        headers: {
            'Host': host,
            'Authorization': `Bearer ${_tokne}`,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "share_id": 0,
            "shareType": 1
        })
    };
    let result = await httpRequest(options, `用户信息`);

    if (result.error_code === 0) {
        console.log(`    用户信息: 欢迎 ${result.data.user.name} ,现有 ${result.data.user.credit} 爱豆 ,庄园等级: ${result.data.land.level.level} 级 ${result.data.land.level.name} ,庄园ID: ${result.data.land.id}`);
        msg += `\n    用户信息: 欢迎 ${result.data.user.name} ,现有 ${result.data.user.credit} 爱豆 ,庄园等级: ${result.data.land.level.level} 级 ${result.data.land.level.name} ,庄园ID: ${result.data.land.id}`;
        lang_id = result.data.land.id;
        if (result.data.user.credit > 0) {
            console.log(`    现有 ${result.data.user.credit} 爱豆 ,去培育了!`);
            msg += `\n    现有 ${result.data.user.credit} 爱豆 ,去培育了!`
            await breed();
        }
    } else {
        console.log(`    用户信息: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
        msg += `\n    用户信息: 失败 ❌ 了呢,原因未知!`;
    }
}






/**
 * 培育    POST
 */
async function breed() {
    let options = {
        method: 'POST',
        url: `${hostname}/api/user/land/culture/v2`,
        headers: {
            'Host': host,
            'Authorization': `Bearer ${_tokne}`,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "landId": lang_id,
            "collectType": 0
        })
    };
    let result = await httpRequest(options, `培育`);

    if (result.error_code === 0) {
        console.log(`    培育: 成功 `);
        msg += `\n    培育: 成功 `;
        await $.wait(3 * 1000);
        await breed();
    } else if (result.error_code === 1) {
        console.log(`    培育: ${result.error_message}`);
        msg += `\n    培育: ${result.error_message}`;
    }
    else if (result.error_code === 3) {
        console.log(`    培育: ${result.error_message}`);
        msg += `\n    培育: ${result.error_message}`;
    } else {
        console.log(`    培育: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
        msg += `\n    培育: 失败 ❌ 了呢,原因未知!`;
    }
}




/**
 * 好友培育    POST
 */
async function friend_breed_info() {
    let options = {
        method: 'POST',
        url: `${hostname}/api/user/friend/listv2`,
        headers: {
            'Host': host,
            'Authorization': `Bearer ${_tokne}`,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "landId": lang_id,
        })
    };
    let result = await httpRequest(options, `好友培育`);

    if (result.error_code === 0) {
        if (result.data.friends.length > 3) {
            console.log(`    好友培育:您当前有 ${result.data.friends.length - 1} 个好友 ,将会进行好友培育任务!`);
            msg += `\n    好友培育:您当前有 ${result.data.friends.length - 1} 个好友 ,将会进行好友培育任务!`;
            for (let index = 1; index < 4; index++) {
                let friend_id = result.data.friends[index].manor.user_id;
                let friend_name = result.data.friends[index].manor.name;
                let landId = result.data.friends[index].land.id;
                console.log(`    好友培育:培育好友 ${friend_name} ,庄园id:${landId}`);
                msg += `\n    好友培育:培育好友 ${friend_name} ,庄园id:${landId}`
                await friend_breed(friend_id, landId);
                await $.wait(3 * 1000);
            }
            await friend_breed_Reward();
            await $.wait(3 * 1000);

            await invitation_Reward();
            await $.wait(3 * 1000);
        } else {
            console.log(`    好友培育:您当前有 ${result.data.friends.length - 1} 个好友 ,跳过 好友培育任务!`);
            msg += `\n    好友培育:您当前有 ${result.data.friends.length - 1} 个好友 ,将会进行 好友培育任务!`;
        }

    } else if (result.error_code === 1) {
        console.log(`    好友培育: ${result.error_message}`);
        msg += `\n    好友培育: ${result.error_message}`;
    } else {
        console.log(`    好友培育: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
        msg += `\n    好友培育: 失败 ❌ 了呢,原因未知!`;
    }
}



/**
 * 好友培育    POST
 */
async function friend_breed(friend_id, landId) {
    let options = {
        method: 'POST',
        url: `${hostname}/api/user/friend/foster/add`,
        headers: {
            'Host': host,
            'Authorization': `Bearer ${_tokne}`,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "friendId": friend_id,
            "landId": landId
        })
    };
    let result = await httpRequest(options, `好友培育`);

    if (result.error_code === 0) {
        console.log(`    好友培育:成功了!`);
        msg += `\n    好友培育:成功了!`;
    } else if (result.error_code === 1) {
        console.log(`    好友培育: ${result.error_message}`);
        msg += `\n    好友培育: ${result.error_message}`;
    } else {
        console.log(`    好友培育: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
        msg += `\n    好友培育: 失败 ❌ 了呢,原因未知!`;
    }
}



/**
 * 领取好友培育奖励   POST
 */
async function friend_breed_Reward() {
    let options = {
        method: 'POST',
        url: `${hostname}/user/taskv2/foster/friend/get/credit`,
        headers: {
            'Host': host,
            'Authorization': `Bearer ${_tokne}`,
            'content-type': 'application/json'
        },
        body: JSON.stringify({})
    };
    let result = await httpRequest(options, `领取好友培育奖励`);

    if (result.error_code === 0) {
        console.log(`    领取好友培育奖励:成功了`);
        msg += `\n    领取好友培育奖励:成功了`;
    } else if (result.error_code === 1) {
        console.log(`    领取好友培育奖励: ${result.error_message}`);
        msg += `\n    领取好友培育奖励: ${result.error_message}`;
    } else {
        console.log(`    领取好友培育奖励: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
        msg += `\n    领取好友培育奖励: 失败 ❌ 了呢,原因未知!`;
    }
}



/**
 * 领取邀请奖励   POST
 */
async function invitation_Reward() {
    let options = {
        method: 'POST',
        url: `${hostname}/api/user/taskv2/invitation/get/credit`,
        headers: {
            'Host': host,
            'Authorization': `Bearer ${_tokne}`,
            'content-type': 'application/json'
        },
        body: JSON.stringify({})
    };
    let result = await httpRequest(options, `领取邀请奖励`);

    if (result.error_code === 0) {
        console.log(`    领取邀请奖励:成功了`);
        msg += `\n    领取邀请奖励:成功了`;
    } else if (result.error_code === 1) {
        console.log(`    领取邀请奖励: ${result.error_message}`);
        msg += `\n    领取邀请奖励: ${result.error_message}`;
    } else {
        console.log(`    领取邀请奖励: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
        msg += `\n    领取邀请奖励: 失败 ❌ 了呢,原因未知!`;
    }
}

/**
 * 领取领取每日分享奖励   POST
 */
async function share_Reward() {
    let options = {
        method: 'POST',
        url: `${hostname}/api/user/taskv2/share/get/creditt`,
        headers: {
            'Host': host,
            'Authorization': `Bearer ${_tokne}`,
            'content-type': 'application/json'
        },
        body: JSON.stringify({})
    };
    let result = await httpRequest(options, `领取每日分享奖励`);

    if (result.error_code === 0) {
        console.log(`    领取每日分享奖励:领取成功了! `);
        msg += `\n    领取每日分享奖励:领取成功了! `;
    } else if (result.error_code === 1) {
        console.log(`    领取每日分享奖励: ${result.error_message}`);
        msg += `\n    领取每日分享奖励: ${result.error_message}`;
    } else {
        console.log(`    领取每日分享奖励: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
        msg += `\n    领取每日分享奖励: 失败 ❌ 了呢,原因未知!`;
    }
}
















//#region 固定代码
// ============================================变量检查============================================ \\

async function getCks(ck, str) {
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
            console.log(` :未填写变量 ${str}`)
        }
    }
    )
}

// ============================================发送消息============================================ \\
async function SendMsg(message) {
    if (!message) return;
    if (Notify > 0) {
        if ($.isNode()) {
            let notify = require("./sendNotify");
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
    let t = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890",
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
    h = myDate.getHours();
    return h;
}

/**
 * 获取当前分钟数
 */
function local_minutes() {
    let myDate = new Date();
    m = myDate.getMinutes();
    return m;
}




/**
 * 每日网抑云    GET
 */
function wyy() {
    return new Promise((resolve) => {
        let request = require('request');
        let options = {
            'method': 'GET',
            'url': 'https://keai.icu/apiwyy/api',
            'headers': {
            }
        };

        request(options, function (error, response) {
            try {
                if (error) throw new Error(error);
                // console.log(response.body);
                data = JSON.parse(response.body)
                console.log(`【网抑云时间】: ${data.content}  by--${data.music}`);

            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve()
            }
        });
    })

}




// ======================================== 网络请求 (get, post等) ======================================== \\
async function httpRequest(postOptionsObject, tip, timeout = 3 * 1000) {
    return new Promise((resolve) => {

        let options = postOptionsObject;
        let request = require('request');
        if (!tip) {
            let tmp = arguments.callee.toString();
            let re = /function\s*(\w*)/i;
            let matches = re.exec(tmp);
            tip = matches[1];
        }
        if (debug) {
            console.log(`\n 【debug】=============== 这是 ${tip} 请求 信息 ===============`);
            console.log(options);
        }

        request(options, async (err, resp, data) => {
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
                msg += `\n ${tip} 失败了!请稍后尝试!!`
            } finally {
                resolve();
            }
        }), timeout

    });
}


// ============================================ debug调试 ============================================ \\
function debugLog(...args) {
    if (debug) {
        console.log(...args);
    }
}



function Env(t, e) {
    class s {
        constructor(t) {
            this.env = t
        }
    }
    return new class {
        constructor(t, e) {
            this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`)
        }

        isNode() {
            return "undefined" != typeof module && !!module.exports
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

        log(...t) {
            t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
        }

        logErr(t, e) {
            s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t)
        }

        wait(t) {
            return new Promise(e => setTimeout(e, t))
        }

        done(t = {}) {
            const e = (new Date).getTime(), s = (e - this.startTime) / 1e3;
            this.log("", `🔔${this.name}, 结束!🕛 ${s} 秒`), this.log()
        }
    }(t, e)
}





