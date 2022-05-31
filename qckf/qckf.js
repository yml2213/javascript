/**
 * 脚本地址: https://raw.githubusercontent.com/yml2213/javascript/master/qckf/qckf.js
 * 转载请留信息,谢谢
 *
 * 雀巢咖啡 小程序 
 *
 * cron 30 6,18 * * *  yml2213_javascript_master/qckf.js
 * 自己更改定时
 *
 * 5-29     完成 签到 自己培育 给好友培育 分享 等任务
 * 5-30     修复分享 邀请爱豆 领取失败bug
 * 5-31     增加版本号,修复领取失败bug
 * 5-31     增加微信步数爱豆  荫蔽树爱豆 两个领取任务 ,默认都18点跑 (微信需要自己授权下)
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
let VersionCheck = "0.1.4"
let Change = '增加微信步数爱豆  荫蔽树爱豆 两个领取任务 ,默认都18点跑!'
let thank = `\n感谢 xx 的投稿`
///////////////////////////////////////////////////////////////////

async function tips(ckArr) {
    let Version_latest = await Version_Check('qckf');
    let Version = `\n📌 本地脚本: V 0.1.4  远程仓库脚本: V ${Version_latest}`
    console.log(`${Version}`);
    msg += `\n${Version}`
    console.log(`📌 🆙 更新内容: ${Change}\n`);
    msg += `\n${Change}`

    // console.log(thank);
    // msg += `${thank}`

    await wyy();
    console.log(`\n=============== 共找到 ${ckArr.length} 个账号 ===============`);
    msg += `\n =============== 共找到 ${ckArr.length} 个账号 ===============`
    debugLog(`【debug】 这是你的账号数组: \n ${ckArr} `);
}

!(async () => {
    let ckArr = await getCks(ckStr, "qckf_data");
    await tips(ckArr);
    for (let index = 0; index < ckArr.length; index++) {
        qckf_num = index + 1;
        console.log(`\n------------- 开始【第 ${qckf_num} 个账号】------------- `);
        msg += `\n------------- 开始【第 ${qckf_num} 个账号】------------- `
        ck = ckArr[index].split("&");
        debugLog(`【debug】 这是你第 ${qckf_num} 账号信息: ${ck} `);
        await start();
    }
    await SendMsg(msg);
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done());

async function start() {

    console.log("\n开始 更新token");
    await Update_token();

    if (ck_status == 0) {
        console.log("\n开始 任务列表");
        await Task_List();

        console.log("\n开始 用户信息");
        await user_info();

        console.log("\n开始 荫蔽树爱豆");
        if (local_hours() == 18) {
            await tree_info();
        } else {
            console.log(`    荫蔽树爱豆:  每天18点领取 ,时间不对,跳过!`);
            msg += `\n    荫蔽树爱豆:  每天18点领取 ,时间不对,跳过!`;
        }


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

    if (result.error_code == 0) {
        console.log(`    更新token: 成功 🎉`);
        msg += `\n     更新token: 成功 🎉`;
        _tokne = result.data.token;
        await wait(3);
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

    if (result.error_code == 0) {
        if (result.data.sign.status == 0) {
            console.log(`    签到状态: 今日还没签到 ,去签到喽!🏃🏃🏃`);
            msg += `\n    签到状态: 今日还没签到 ,去签到喽!🏃🏃🏃`;
            await SignIn();
        } else {
            console.log(`    签到状态: 今日签到过了 ,明天再来吧!`);
            msg += `\n    签到状态: 今日签到过了 ,明天再来吧!`;
        }
        if (result.data.share.status == 0) {
            console.log(`    每日分享状态: 每日分享未完成 ,去分享喽 !`);
            msg += `\n    每日分享状态: 每日分享未完成 ,去分享喽 !`;
            await share();
            await share_Reward();
        } else {
            console.log(`    每日分享状态: 今日每日分享过了 ,明天再来吧!`);
            msg += `\n    每日分享状态: 今日每日分享过了 ,明天再来吧!`;
        }
        if (result.data.invitation.status != 0 && result.data.invitation.credit != 0) {
            console.log(`    邀请好友: 可以领取爱豆 ${result.data.invitation.credit}`);
            msg += `\n    邀请好友: 可以领取爱豆 ${result.data.invitation.credit}`;
            await invitation_Reward();
        } else {
            console.log(`    邀请好友: 暂无可领取爱豆!`);
            msg += `\n    邀请好友: 暂无可领取爱豆!`;
        }

        if (result.data.foster.num < 3) {
            console.log(`    好友培育: ${result.data.foster.num}/3`);
            msg += `\n    好友培育: ${result.data.foster.num}/3`
            if (result.data.foster.num < 3) {
                await friend_breed_info();
            }
        } else {
            console.log(`    好友培育: 今日完成了 ,明天再来吧!`);
            msg += `\n    好友培育: 今日完成了 ,明天再来吧!`;
        }
        if (result.data.run.show != 0 && result.data.run.credit != 0) {
            console.log(`    微信步数: 预计可以领取爱豆 ${result.data.run.credit}`);
            msg += `\n    微信步数: 预计可以领取爱豆 ${result.data.run.credit}`;
            if (local_hours() == 18) {
                await wechat_step();
            } else {
                console.log(`    微信步数: 每天18点领取 ,时间不对,跳过!`);
                msg += `\n    微信步数: 每天18点领取 ,时间不对,跳过!`;
            }
        } else {
            console.log(`    微信步数: 暂无可领取爱豆!`);
            msg += `\n    微信步数: 暂无可领取爱豆!`;
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

    if (result.error_code == 0) {
        console.log(`    签到: 成功 ,获得 ${result.data.list[0].credit} 爱豆`);
        msg += `\n    签到: 成功 ,获得 ${result.data.list[0].credit} 爱豆`;
        await wait(3);
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

    if (result.error_code == 0) {
        console.log(`    分享: 成功 ,预计获得 ${result.data.credit} 爱豆`);
        msg += `\n    分享: 成功 ,预计获得 ${result.data.credit} 爱豆`;
        await wait(3);
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

    if (result.error_code == 0) {
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

    if (result.error_code == 0) {
        console.log(`    培育: 成功 `);
        msg += `\n    培育: 成功 `;
        await wait(3);
        await breed();
    } else if (result.error_code == 1) {
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
 * 好友培育信息    POST
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
    let result = await httpRequest(options, `好友培育信息`);

    if (result.error_code == 0) {
        if (result.data.friends.length > 3) {
            console.log(`    好友培育信息:您当前有 ${result.data.friends.length - 1} 个好友 ,将会进行 好友培育 任务!`);
            msg += `\n    好友培育信息:您当前有 ${result.data.friends.length - 1} 个好友 ,将会进行 好友培育 任务!`;
            for (let index = 1; index < 4; index++) {
                let friend_id = result.data.friends[index].manor.user_id;
                let friend_name = result.data.friends[index].manor.name;
                let landId = result.data.friends[index].land.id;
                console.log(`    好友培育信息:培育好友 ${friend_name} ,庄园id:${landId}`);
                msg += `\n    好友培育信息:培育好友 ${friend_name} ,庄园id:${landId}`
                await friend_breed(friend_id, landId);
            }
            await friend_breed_Reward();
        } else {
            console.log(`    好友培育信息:您当前有 ${result.data.friends.length - 1} 个好友 ,跳过 好友培育 任务!`);
            msg += `\n    好友培育信息:您当前有 ${result.data.friends.length - 1} 个好友 ,跳过 好友培育 任务!`;
        }
    } else if (result.error_code == 1) {
        console.log(`    好友培育信息: ${result.error_message}`);
        msg += `\n    好友培育信息: ${result.error_message}`;
    } else {
        console.log(`    好友培育信息: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
        msg += `\n    好友培育信息: 失败 ❌ 了呢,原因未知!`;
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

    if (result.error_code == 0) {
        console.log(`    好友培育:成功了!`);
        msg += `\n    好友培育:成功了!`;
        await wait(3);
    } else if (result.error_code == 1) {
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
 * https://coffeefarm.shheywow.com/api/user/taskv2/foster/friend/get/credit
 */
async function friend_breed_Reward() {
    let options = {
        method: 'POST',
        url: `${hostname}/api/user/taskv2/foster/friend/get/credit`,
        headers: {
            'Host': host,
            'Authorization': `Bearer ${_tokne}`,
            'content-type': 'application/json'
        },
        body: JSON.stringify({})
    };
    let result = await httpRequest(options, `领取好友培育奖励`);

    if (result.error_code == 0) {
        console.log(`    领取好友培育奖励: 成功了`);
        msg += `\n    领取好友培育奖励: 成功了`;
        await wait(3);
    } else if (result.error_code == 1) {
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

    if (result.error_code == 0) {
        console.log(`    领取邀请奖励:成功了`);
        msg += `\n    领取邀请奖励:成功了`;
        await wait(3);
    } else if (result.error_code == 1) {
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
        url: `${hostname}/api/user/taskv2/share/get/credit`,
        headers: {
            'Host': host,
            'Authorization': `Bearer ${_tokne}`,
            'content-type': 'application/json'
        },
        body: JSON.stringify({})
    };
    let result = await httpRequest(options, `领取每日分享奖励`);

    if (result.error_code == 0) {
        console.log(`    领取每日分享奖励:领取成功了! `);
        msg += `\n    领取每日分享奖励:领取成功了! `;
        await wait(3);
    } else if (result.error_code == 1) {
        console.log(`    领取每日分享奖励: ${result.error_message}`);
        msg += `\n    领取每日分享奖励: ${result.error_message}`;
    } else {
        console.log(`    领取每日分享奖励: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
        msg += `\n    领取每日分享奖励: 失败 ❌ 了呢,原因未知!`;
    }
}




/**
* 微信步数   POST
*/
async function wechat_step() {
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
    let result = await httpRequest(options, `微信步数`);

    if (result.error_code == 0) {
        console.log(`    微信步数:领取爱豆成功了`);
        msg += `\n    微信步数:领取爱豆成功了`;
        await wait(3);
    } else if (result.error_code == 1) {
        console.log(`    微信步数: ${result.error_message}`);
        msg += `\n    微信步数: ${result.error_message}`;
    } else {
        console.log(`    微信步数: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
        msg += `\n    微信步数: 失败 ❌ 了呢,原因未知!`;
    }
}




/**
* 荫蔽树爱豆   POST
*/
async function tree_info() {
    let options = {
        method: 'POST',
        url: `${hostname}/api/user/land/tree/credit/list`,
        headers: {
            'Host': host,
            'Authorization': `Bearer ${_tokne}`,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "landId": lang_id
        })
    };
    let result = await httpRequest(options, `荫蔽树爱豆`);
    // console.log(result);
    if (result.data.creditList.length != 0) {
        for (var key in result.data.creditList) {
            // console.log(JSON.stringify(result.data.creditList[key].id));
            let tree_idol_id = JSON.stringify(result.data.creditList[key].id);
            await tree_Receive(tree_idol_id);
        }
    } else if (result.error_code == 0) {
        console.log(`    荫蔽树爱豆:  荫蔽树上暂时没有爱豆,等等吧!`);
        msg += `\n    荫蔽树爱豆:  荫蔽树上暂时没有爱豆,等等吧!`;
    } else {
        console.log(`    荫蔽树爱豆: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
        msg += `\n    荫蔽树爱豆: 失败 ❌ 了呢,原因未知!`;
    }
}



/**
* 领取荫蔽树爱豆   POST
*/
async function tree_Receive(id) {
    let options = {
        method: 'POST',
        url: `${hostname}/api/user/land/tree/credit/getV2`,
        headers: {
            'Host': host,
            'Authorization': `Bearer ${_tokne}`,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "treeCreditId": id
        })
    };
    let result = await httpRequest(options, `领取荫蔽树爱豆`);

    if (result.error_code == 0) {
        console.log(`    领取荫蔽树爱豆: 领取爱豆成功了`);
        msg += `\n    领取荫蔽树爱豆: 领取爱豆成功了`;
        await wait(3);
    } else if (result.error_code == 1) {
        console.log(`    领取荫蔽树爱豆:  ${result.error_message}`);
        msg += `\n    领取荫蔽树爱豆:  ${result.error_message}`;
    } else {
        console.log(`    领取荫蔽树爱豆: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
        msg += `\n    领取荫蔽树爱豆: 失败 ❌ 了呢,原因未知!`;
    }
}












// #region *************************************************************  固定代码  *************************************************************
/**
 * 变量检查
 */
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


/**
 * 获取远程版本
 */
function Version_Check(name) {
    return new Promise((resolve) => {
        let url = {
            url: `https://raw.gh.fakev.cn/yml2213/javascript/master/${name}/${name}.js`,
        }
        $.get(url, async (err, resp, data) => {
            try {
                let VersionCheck = resp.body.match(/VersionCheck = "([\d\.]+)"/)[1]
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
                data = JSON.parse(data)
                // console.log(data);
                console.log(`【网抑云时间】 ${data.data.Content}  by--${data.data.Music}`);

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
                        console.log(`======`);
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
                    msg += `\n ${tip} 失败了!请稍后尝试!!`
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
                        console.log(`======`);
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
                    msg += `\n ${tip} 失败了!请稍后尝试!!`
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



// 完整 Env
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }

     //#endregion

