/**
 * 脚本地址: https://raw.githubusercontent.com/yml2213/javascript/master/jrttjsb/jrttjsb.js
 * 转载请留信息,谢谢
 *
 * 今日头条极速版
 *
 * cron 1-59/15 6-23 * * *  yml2213_javascript_master/jrttjsb.js
 *
 * 5-26     完成 签到  宝箱  睡觉  走路  吃饭 阅读(基本黑号)等任务 ,农场看情况加不加
 * 6-12     默认关闭通知,出错才会提示
 * 
 * 不要问跟以前的有啥不同,都是开源脚本,自己看就行了
 *
 * 感谢所有测试人员
 * ========= 青龙--配置文件 =========
 * 变量格式: export jrttjsb_data='cookie & cookie'  多个账号用 @ 或 换行分割
 * 
 * 完整cookie 或 ck的 sessionid_ss 项都行 ,苹果的域名可能会变一点点,自己抓包注意下就行
 * 自己更改定时
 * 
 * tg频道: https://t.me/yml2213_tg  
 * tg群组: https://t.me/yml_tg    
 * qq频道: https://qun.qq.com/qqweb/qunpro/share?_wv=3&_wwv=128&appChannel=share&inviteCode=1W4InjV&appChannel=share&businessType=9&from=181074&biz=ka&shareSource=5
 * 
 */

const $ = new Env("今日头条极速版");
const notify = $.isNode() ? require("./sendNotify") : "";
const Notify = 0 		//0为关闭通知,1为打开通知,默认为1
const debug = 0 		//0为关闭调试,1为打开调试,默认为0
///////////////////////////////////////////////////////////////////
let ckStr = process.env.jrttjsb_data;
let msg = "";
let ck = "";
let ck_status = '';
let host = "api5-normal-lf.toutiaoapi.com";
let hostname = "https://" + host;
let version = "88011";
let adIdList = [26, 181, 186, 187, 188, 189, 190, 195, 210, 214, 216, 225, 308, 324, 327, 329];
let maxReadPerRun = ($.isNode() ? process.env.jrttjsbReadNum : $.getdata('jrttjsbReadNum')) || 10;
///////////////////////////////////////////////////////////////////
let Version = '\nyml   2022/5/24     折腾下这个老毛吧,没好的新毛  '
let thank = `感谢 xxxx 的投稿`
let test = `脚本测试中,有bug及时反馈!     脚本测试中,有bug及时反馈!`
///////////////////////////////////////////////////////////////////

async function tips(ckArr) {

    console.log(`${Version}`);
    msg += `${Version}`

    // console.log(thank);
    // msg += `${thank}`

    // console.log(test);
    // msg += `${test}`

    // console.log(` 脚本已恢复正常状态,请及时更新! `);
    // msg += `脚本已恢复正常状态,请及时更新`

    console.log(`==================================================\n 脚本执行 - 北京时间(UTC+8): ${new Date(
        new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000
    ).toLocaleString()} \n==================================================`);
    await wyy();

    console.log(`\n=================== 共找到 ${ckArr.length} 个账号 ===================`);
    msg += `\n=================== 共找到 ${ckArr.length} 个账号 ===================`
    debugLog(`【debug】 这是你的账号数组: \n ${ckArr} `);
}

!(async () => {
    let ckArr = await getCks(ckStr, "jrttjsb_data");
    await tips(ckArr);
    for (let index = 0; index < ckArr.length; index++) {
        jrttjsb_num = index + 1;
        console.log(`------------- 开始【第 ${jrttjsb_num} 个账号】------------- `);
        msg += `\n------------- 开始【第 ${jrttjsb_num} 个账号】------------- `

        ck = ckArr[index].split("&");

        debugLog(`【debug】 这是你第 ${jrttjsb_num} 账号信息: \n ${ck} `);
        await start();
    }
    await SendMsg(msg);
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done());


async function start() {

    console.log("开始 用户信息");
    await user_info(1);
    await $.wait(3 * 1000);

    if (ck_status == 0) {
        console.log("\n开始 睡觉状态");
        await QuerySleepStatus();
        await $.wait(3 * 1000);

        console.log("\n开始 走路状态");
        await QueryWalkInfo();
        await $.wait(3 * 1000);

        let time_hours = local_hours();
        if (time_hours >= 5 && time_hours <= 9) {
            console.log("\n开始 早餐补贴");
            await EatInfo('早餐补贴', 0);
            await $.wait(3 * 1000);
        }
        if (time_hours >= 11 && time_hours <= 14) {
            console.log("\n开始 午餐补贴");
            await EatInfo('午餐补贴', 1);
            await $.wait(3 * 1000);
        }
        if (time_hours >= 17 && time_hours <= 20) {
            console.log("\n开始 晚餐补贴");
            await EatInfo('晚餐补贴', 2);
            await $.wait(3 * 1000);
        }
        if (time_hours >= 21 && time_hours <= 24) {
            console.log("\n开始 夜宵补贴");
            await EatInfo('夜宵补贴', 3);
            await $.wait(3 * 1000);
        }


        console.log("\n开始 宝箱视频奖励");
        for (let adId of adIdList) await ExcitationAd(adId)
        await $.wait(3 * 1000);

        console.log("\n开始 阅读文章");
        await ReadArticles();
        await $.wait(3 * 1000);

    }



}


/**
 * 用户信息    GET
 */
async function user_info(doTask) {
    let options = {
        method: 'GET',
        url: `https://api5-normal-lf.toutiaoapi.com/luckycat/lite/v1/task/page_data/?aid=35`,
        headers: {
            'Host': 'api5-normal-lf.toutiaoapi.com',
            'Cookie': ck[0],
            'content-type': 'application/json'
        },
        // body: '',
    };
    let result = await httpRequest(options, `用户信息`);

    if (result.err_no == 0) {
        if (!result.data.treasure) {
            console.log(`    用户${jrttjsb_num} 查询状态失败,CK失效 `)
            return ck_status = 1;
        }
        if (doTask == 0) {
            console.log(`    账户信息:金币:${result.data.user_income.score_balance} ,现金:${result.data.user_income.cash_balance / 100}元 `)
        } else {
            if (result.data.treasure.next_treasure_time == result.data.treasure.current_time) {
                await OpenTreasureBox()
            } else {
                let cdTime = result.data.treasure.next_treasure_time - result.data.treasure.current_time
                console.log(`    宝箱状态: 开宝箱冷却时间还有 ${cdTime} 秒`);
                msg += `\n     宝箱状态: 开宝箱冷却时间还有 ${cdTime} 秒`;
            }
            if (result.data.signin_detail.today_signed == false) {
                await SignIn()
            } else {
                console.log(`    签到: 用户 ${jrttjsb_num} 今天已签到`);
                msg += `\n    签到: 用户 ${jrttjsb_num} 今天已签到`;
            }
        }
    } else {
        console.log(`    用户信息: 失败 ❌ 了呢,原因未知！  ${result} `);
        msg = `\n    用户信息: 失败 ❌ 了呢,原因未知!`;
        message = `\n    用户信息: 失败 ❌ 了呢,原因未知!`;
        let notify = require("./sendNotify");
        await notify.sendNotify($.name, message);
    }
}



/**
 * 开宝箱    POST
 */
async function OpenTreasureBox() {
    let options = {
        method: 'POST',
        url: `https://api5-normal-lf.toutiaoapi.com/score_task/v1/task/open_treasure_box/?aid=35`,
        headers: {
            'Host': 'api5-normal-lf.toutiaoapi.com',
            'Cookie': ck[0],
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "from": "task_page",
            "use_ecpm": 0,
            "rit": "coin",
            "enable_preload_exciting_video": 0,
            "open_treasure_box_enter_from": ""
        }),
    };
    let result = await httpRequest(options, `开宝箱`);

    if (result.err_no == 0) {
        console.log(`    开宝箱: 获得 ${result.data.score_amount} 金币`);
        msg += `\n    开宝箱: 获得 ${result.data.score_amount} 金币`;
    } else {
        console.log(`    开宝箱: 失败 ❌ 了呢,原因未知！ ${result.err_tips} `);
        msg += `\n    开宝箱: 失败 ❌ 了呢,原因未知!`;
    }
}



/**
 * 签到    POST
 */
async function SignIn() {
    let options = {
        method: 'POST',
        url: `https://api5-normal-lf.toutiaoapi.com/luckycat/lite/v1/sign_in/action?aid=35`,
        headers: {
            'Host': 'api5-normal-lf.toutiaoapi.com',
            'Cookie': ck[0],
            'content-type': 'application/json'
        },
        body: ''
    };
    let result = await httpRequest(options, `签到`);

    if (result.err_no == 0) {
        console.log(`    签到: ${result.err_tips} ,获得 ${result.data.score_amount} 金币,已连续签到 ${result.data.sign_times} 天`);
        msg += `\n    签到: ${result.err_tips} ,获得 ${result.data.score_amount} 金币,已连续签到 ${result.data.sign_times} 天`;
    } else {
        console.log(`    签到: 失败 ❌ 了呢,原因未知！  ${result} `);
        msg += `\n    签到: 失败 ❌ 了呢,原因未知!`;
    }
}


/**
 * 睡觉状态    GET
 */
async function QuerySleepStatus() {

    let curHour = local_hours()
    let options = {
        method: 'GET',
        url: `${hostname}/luckycat/lite/v1/sleep/status/?aid=35`,
        headers: {
            'Host': host,
            'Cookie': ck[0],
            'content-type': 'application/json'
        },
    };
    let result = await httpRequest(options, `睡觉状态`);

    if (result.err_no == 0) {
        let sleepHour = Math.floor(result.data.sleep_last_time / 36) / 100;
        if (result.data.sleeping == true) {
            if (sleepHour >= 12) {
                await SleepStop()
            } else if (result.data.sleep_unexchanged_score == result.data.max_coin && curHour >= 7) {
                let rnd = Math.random()
                if (rnd > 0.95) {
                    await SleepStop()
                } else {
                    console.log(`     用户${jrttjsb_num}随机醒来时间,本次不进行醒来,已经睡了${sleepHour}小时,可以获得${result.data.sleep_unexchanged_score}金币`);
                    msg += `\n     用户${jrttjsb_num}随机醒来时间,本次不进行醒来,已经睡了${sleepHour}小时,可以获得${result.data.sleep_unexchanged_score}金币`;
                }
            } else {
                console.log(`     用户${jrttjsb_num}睡眠中,已经睡了${sleepHour}小时,可以获得${result.data.sleep_unexchanged_score}金币,上限${result.data.max_coin}金币`);
                msg += `\n     用户${jrttjsb_num}睡眠中,已经睡了${sleepHour}小时,可以获得${result.data.sleep_unexchanged_score}金币,上限${result.data.max_coin}金币`;
            }
        } else {
            if (result.data.history_amount > 0) {
                await SleepDone(result.data.history_amount)
            }
            if (curHour >= 22 || curHour < 2) {
                await SleepStart()
            } else if (curHour >= 20) {
                let rnd = Math.random()
                if (rnd > 0.95) {
                    await SleepStart()
                } else {
                    console.log(`     用户${jrttjsb_num}随机睡眠时间,本次不进行睡眠`);
                    msg += `\n     用户${jrttjsb_num}随机睡眠时间,本次不进行睡眠`;
                }
            } else {
                console.log(`    用户${jrttjsb_num}未到睡觉时间`);
                msg += `\n     用户${jrttjsb_num}随机睡眠时间,本次不进行睡眠`;
            }
        }
    } else {
        console.log(`     用户${jrttjsb_num}查询睡觉状态失败：${result.err_tips}`);
        msg += `\n     用户${jrttjsb_num}随机睡眠时间,本次不进行睡眠`;
    }
}


/**
 * 睡觉醒来    POST
 */
async function SleepStop() {
    let options = {
        method: 'POST',
        url: `${hostname}/api/news/feed/v78/?aid=35`,
        headers: {
            'Host': host,
            'Cookie': ck[0],
            'content-type': 'application/json'
        }, body: '',
    };
    let result = await httpRequest(options, `睡觉醒来`);

    if (result.err_no == 0) {
        let sleepHour = result.data.sleep_last_time / 3600;
        console.log(`     用户${jrttjsb_num}结束睡眠,本次睡了${sleepHour}小时,可以领取${result.data.history_amount}金币`);
        msg += `\n     用户${jrttjsb_num}结束睡眠,本次睡了${sleepHour}小时,可以领取${result.data.history_amount}金币`;
        await SleepDone(result.data.history_amount)
    } else {
        console.log(`    睡觉醒来: 失败 ❌ 了呢,原因未知！  ${result} `);
        msg += `\n     睡觉醒来: 失败 ❌ 了呢,原因未知!`;
    }
}


/**
 * 睡觉醒来收金币    POST
 */
async function SleepDone(amount) {
    let timeInMS = ts13();
    let options = {
        method: 'POST',
        url: `${hostname}/luckycat/lite/v1/sleep/done_task/?aid=35&_rticket=${timeInMS}`,
        headers: {
            'Host': host,
            'Cookie': ck[0],
            'content-type': 'application/json'
        }, body: `{"score_amount":${amount},"enable_preload_exciting_video":0}`,
    };
    let result = await httpRequest(options, `睡觉醒来收金币`);

    if (result.err_no === 0) {
        console.log(`     领取睡觉金币奖励 ${amount} 金币成功`);
        msg += `\n     领取睡觉金币奖励 ${amount} 金币成功`;
    } else {
        console.log(`    睡觉醒来收金币: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
        msg += `\n     睡觉醒来收金币: 失败 ❌ 了呢,原因未知!`;
    }
}



/**
 * 开始睡觉    POST
 */
async function SleepStart() {
    let options = {
        method: 'POST',
        url: `${hostname}/luckycat/lite/v1/sleep/start/?aid=35`,
        headers: {
            'Host': host,
            'Cookie': ck[0],
            'content-type': 'application/json'
        }, body: '',
    };
    let result = await httpRequest(options, `开始睡觉`);

    if (result.err_no == 0) {
        console.log(`     开始睡觉, ZZZzzz...`);
        msg += `\n     开始睡觉, ZZZzzz...`;
        await SleepDone(result.data.history_amount)
    } else {
        console.log(`    开始睡觉: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
        msg += `\n     开始睡觉: 失败 ❌ 了呢,原因未知!`;
    }
}


/**
 * 查询走路状态    GET
 */
async function QueryWalkInfo() {
    let options = {
        method: 'GET',
        url: `${hostname}/luckycat/lite/v1/walk/page_data/?aid=35`,
        headers: {
            'Host': host,
            'Cookie': ck[0],
            // 'content-type': 'application/json'
        },
    };
    let result = await httpRequest(options, `查询走路状态`);

    if (result.err_no == 0) {
        if (result.data.can_get_amount > 0) await GetWalkBonus();
        console.log(`    查询走路状态: 暂时没有可领取步数!`);
        msg += `\n     查询走路状态: 暂时没有可领取步数!`;
    } else {
        console.log(`    查询走路状态: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
        msg += `\n     查询走路状态: 失败 ❌ 了呢,原因未知!`;
    }
}



/**
 * 走路奖励    POST
 */
async function GetWalkBonus() {
    let nowtime = ts10();
    let options = {
        method: 'POST',
        url: `${hostname}/luckycat/lite/v1/walk/bonus/?aid=35`,
        headers: {
            'Host': host,
            'Cookie': ck[0],
            'content-type': 'application/json'
        },
        body: `{"task_id":136,"client_time":${nowtime},"rit":"coin","use_ecpm":0,"enable_preload_exciting_video":0}`,
    };
    let result = await httpRequest(options, `走路奖励`);

    if (result.err_no == 0) {
        console.log(`    领取走路奖励获得 ${result.data.score_amount} 金币`);
        msg += `\n     领取走路奖励获得 ${result.data.score_amount} 金币`;
    } else if (result.err_no == 8005028) {
        console.log(`      ${result.err_tips} `);
        msg += `\n      ${result.err_tips} `;
    } else {
        console.log(`    走路奖励: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
        msg += `\n     走路奖励: 失败 ❌ 了呢,原因未知!`;
    }
}


/**
 * 查询吃饭补贴    GET
 */
async function EatInfo(eat_name, taskId) {
    let options = {
        method: 'GET',
        url: `${hostname}/luckycat/lite/v1/eat/eat_info/?aid=35`,
        headers: {
            'Host': host,
            'Cookie': ck[0],
            'content-type': 'application/json'
        },
    };
    let result = await httpRequest(options, `${eat_name}`);

    if (result.err_no == 0) {
        if (result.data.complete_status[taskId] == false) {
            await DoneEat()
        } else {

            console.log(`    ${eat_name}:已经领取过了!`);
        }
    } else {
        console.log(`    查询吃饭补贴: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
        msg += `\n     查询吃饭补贴: 失败 ❌ 了呢,原因未知!`;
    }
}


/**
 * 吃饭补贴    POST  
 * https://api5-normal-lf.toutiaoapi.com/luckycat/lite/v1/eat/done_eat/?update_version_code=88011&device_platform=android&aid=35
 */
async function DoneEat() {
    let options = {
        method: 'POST',
        url: `${hostname}/luckycat/lite/v1/eat/done_eat/?update_version_code=${version}&device_platform=android&aid=35`,
        headers: {
            'Host': host,
            'Cookie': ck[0],
            'content-type': 'application/json'
        }, body: '{"enable_preload_exciting_video":0}',
    };
    let result = await httpRequest(options, `吃饭补贴`);

    if (result.err_no == 0) {
        console.log(`     领取吃饭补贴获得 ${result.data.score_amount} 金币`);
        msg += `\n     领取吃饭补贴获得 ${result.data.score_amount} 金币`;
    } else if (result.err_no == 1071) {
        console.log(`     领取吃饭补贴 ${result.err_tips}`);
        msg += `\n     领取吃饭补贴获得 ${result.err_tips}`;
    } else {
        console.log(`    吃饭补贴: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
        msg += `\n     吃饭补贴: 失败 ❌ 了呢,原因未知!`;
    }
}


/**
 * 宝箱视频奖励    POST  
 */
async function ExcitationAd(task_id) {
    let options = {
        method: 'POST',
        url: `${hostname}/luckycat/lite/v1/task/done/excitation_ad?pass_through=default&is_pad=0&act_token=JL1HtwPHpvxHv_rcZQtKAC3ajuo-5azRQIvjbqJ6IzTAVtWR7EY0xlY06pA-0Zt20xMGw7GE1fPabIBqQE8pPw&act_hash=9da3c5e7bb026f0eff562764c9acc7e0&cookie_base=H-WaAsR8Y-beqKCfWCVyEih4XmEeLj9OlveW2Bswl8EKdR7DS9onPILukxh3Fi5qRwKVtr3wHSG4ATcEbn-Dj5aGAuGWeoH56k8wZtIjJaA&cookie_data=yOg0jvd7ihkqR-WciihsFA&iid=2819597821290968&device_id=4244563972598088&ac=wifi&channel=lite_xiaomi_64&aid=35&app_name=news_article_lite&version_code=880&version_name=8.8.0&device_platform=android&os=android&ab_version=668776%2C4174795%2C668907%2C4174798%2C1859937%2C668905%2C4174766%2C668906%2C4174774%2C668904%2C4174751%2C668903%2C4174792%2C668908%2C4174802%2C3596061%2C4007849%2C4046906%2C4071697%2C4098661%2C4126737%2C4131037%2C4098838&ab_client=a1%2Ce1%2Cf2%2Cg2%2Cf7&ab_feature=z1&abflag=3&ssmix=a&device_type=22041211AC&device_brand=Redmi&language=zh&os_api=31&os_version=12&manifest_version_code=8800&resolution=1080*2280&dpi=420&update_version_code=88011&_rticket=${ts13()}&sa_enable=0&dq_param=0&plugin_state=280419485511709&isTTWebView=1&session_id=82e83565-d2ca-47f3-a50b-5268dfd25a3a&host_abi=arm64-v8a&tma_jssdk_version=2.8.0.16&rom_version=miui_v130_v13.0.13.0.slncnxm&cdid=84ee2972-20d3-4b4e-ae10-b9ddcb1647ea&polaris_version=1.0.5&status_bar_height=29&luckydog_base=rBGqzakReKG1QpYNj3-hS1Rz0r1i-BYhGoCDMYsCqbu9JQbbmS3Ou7H4xAY7R5rTTJ-ia6K8iTQh-dGhXvnjyoVRkA0ldRfI4IM0qDGKF15PVuK9-NsBsdZybYpIyNMzOAIw300pgezuxrf1jFuSgHhfF7Iyt-nLd7EVGh0nsr0&luckydog_data=Ui61fJQ-9iBJBqLTyqqB_xXhSXNt_0bp1RgP7lnnk0yI8sDNBnRy4ef_HqCaw8vsjJRGjFPj7OfPZnwXWsTblLJoNGoFSJ7e3WYyuGF7A8Q&luckydog_token=F3c5TeVJoC5GxpnvQWnCm3Vci0Y2ODjz3qHi9hAnURa8_ZyVOm-Sv44zIxkk8DkhyKT4iuD7WvxAkEpytbobBg&luckydog_sdk_version=5.0.1-rc.11&luckydog_settings_version=15&luckycat_version_name=5.0.1-rc.26&luckycat_version_code=501026`,
        headers: {
            'Host': host,
            'Cookie': ck[0],
            'content-type': 'application/json'
        },
        body: `{"ad_id":11,"amount":1543,"ad_rit":"11","extra_data":{"enter_from":"task"},"task_key":"excitation_ad","extra":{"track_id":"7101510817782301470"},"task_id":"${task_id}","ad_alias_position":"coin","is_post_login":false,"ad_from":"coin","score_source":1,"coin_count":1543,"exci_extra":{"cid":1731121759811619,"req_id":"202205251129010102120720761B2CD0B2","rit":20047}}`,
    };
    let result = await httpRequest(options, `宝箱视频奖励`);

    if (result.err_no == 0) {
        console.log(`    领取宝箱视频奖励获得 ${result.data.score_amount} 金币`);
        msg += `\n    领取宝箱视频奖励获得 ${result.data.score_amount} 金币`;
    } else if (result.err_no == 1071) {
        console.log(`    领取宝箱视频奖励 ${result.err_tips}`);
        // msg += `\n    领取宝箱视频奖励获得 ${result.err_tips}`;
    } else {
        console.log(`    宝箱视频奖励: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
        // msg += `\n    宝箱视频奖励: 失败 ❌ 了呢,原因未知!`;
    }
}


/**
 * 阅读文章      
 */
async function ReadArticles() {
    console.log(`    开始阅读,将会阅读${maxReadPerRun}篇文章`)
    await ReadDouble()
    // await DailyArtsReward()
    // await DailyPushReward()
    Reading_state = true;
    for (let i = 0; i < maxReadPerRun; i++) {
        if (Reading_state == false) {
            return;
        } else {
            await ReadArtsReward();

        }
    }

}



/**
 * 阅读文章奖励    POST  
 */
async function ReadArtsReward() {
    let rndGroupId = Math.floor(Math.random() * 7000000000000000000)
    let options = {
        method: 'POST',
        url: `${hostname}/luckycat/lite/v1/activity/done_whole_scene_task/?device_id=4244563972598088&aid=35&device_platform=android&update_version_code=${version}`,
        headers: {
            'Host': host,
            'Cookie': ck[0],
            'content-type': 'application/json'
        },
        body: `{"group_id":"${rndGroupId}","scene_key":"little_headline","is_golden_egg":false}`,
    };
    let result = await httpRequest(options, `阅读文章奖励`);

    if (result.err_no == 0) {
        console.log(`    阅读文章奖励: 获得${result.data.score_amount}金币，今日阅读总收入：${result.data.total_score_amount}金币`);
        msg += `\n    阅读文章奖励: 获得${result.data.score_amount}金币，今日阅读总收入：${result.data.total_score_amount}金币`;
        console.log('    等待15秒阅读下一篇...');
        await $.wait(15 * 1000);
    } else if (result.err_no == 9) {
        console.log(`    阅读文章奖励: ${result.err_tips}`);
        msg += `\n    阅读文章奖励: ${result.err_tips}`;
        return Reading_state = false;
    } else {
        console.log(`    阅读文章奖励: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
        msg += `\n    阅读文章奖励: 失败 ❌ 了呢,原因未知!`;
    }
}





/**
 * 阅读翻倍    POST  
 */
async function ReadDouble() {
    let options = {
        method: 'POST',
        url: `${hostname}/luckycat/lite/v1/activity/double_whole_scene_task/?aid=35`,
        headers: {
            'Host': host,
            'Cookie': ck[0],
            'content-type': 'application/json'
        },
        body: `{}`,
    };
    let result = await httpRequest(options, `阅读翻倍`);

    if (result.err_no == 0) {
        console.log(`    阅读翻倍: 成功`);
        msg += `\n    阅读翻倍: 成功`;
    } else {
        console.log(`    阅读翻倍: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
        msg += `\n    阅读翻倍: 失败 ❌ 了呢,原因未知!`;
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
                console.log(`    【网抑云时间】: ${data.content}  by--${data.music}`);

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
            this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log()
        }
    }(t, e)
}





