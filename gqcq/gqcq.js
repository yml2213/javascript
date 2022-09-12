/**
 * 转载请留信息,谢谢
 *
 * 广汽传祺  app 
 *
 * cron 30 6 * * *  https://raw.githubusercontent.com/yml2213/javascript/master/gqcq/gqcq.js
 *
 * 广汽传祺 app
 * 4-13     	完成签到 抽奖 分享 发帖 评论 任务   有bug及时反馈
 * 4-14     	修复已知bug  恢复正常使用
 * 5-21     	更新通知,优化代码
 * 6-10		    更新模板,修改部分逻辑!
 * 9-12         修复抽奖，增加签到宝箱开启
 *
 * 感谢所有测试人员
 * ========= 青龙--配置文件 =========
 * 变量格式: export gqcq_data='token @ token'  多个账号用 换行 或 @分割
 *
 * tg频道: https://t.me/yml2213_tg  
 * tg群组: https://t.me/yml_tg    
 * 
 */
const $ = new Env("广汽传祺");
const notify = $.isNode() ? require("./sendNotify") : "";
const Notify = 1 		//0为关闭通知,1为打开通知,默认为1
const debug = 1			//0为关闭调试,1为打开调试,默认为0
///////////////////////////////////////////////////////////////////
let ckStr = process.env.gqcq_data;
let msg = "";
let ck = "";
let host = "gsp.gacmotor.com";
let hostname = "https://" + host;
let ck_status = "";

const salt = '17aaf8118ffb270b766c6d6774317a133.4.0'
let reqNonc = randomInt(100000, 999999)
let ts = ts10();
let reqSign = MD5Encrypt(`signature${reqNonc}${ts}${salt}`)
let textarr = ['最简单的提高观赏性的办法就是把地球故事的部分剪辑掉半小时， emo的部分剪辑掉半小时。这样剩下的90分钟我们就看看外星人，看看月球，看看灾难片大场面就不错。', '顶着叛国罪的风险无比坚信前妻，这种还会离婚？', '你以为它是灾难片，其实它是科幻片；你以为它是科幻片，其实它是恐怖片；你以为它是恐怖片，其实它是科教片', '我的天，剧情真的好阴谋论，但是还算是能自圆其说', '大杂烩啊……我能理解这电影为什么在海外卖的不好了，因为核心创意真的已经太老套了', '一开始我以为这就是外国人看《流浪地球》时的感受啊，后来发现这不是我当初看《胜利号》的感受么']
let add_comment_text_arr = ['感谢推荐的电影呢', '有时间一定看看这个电影怎么样', '晚上就去看', '66666666666', '这部电影我看过，非常好看']
ram_num = randomInt(1, 5)
let text = textarr[ram_num];
let add_comment_text = add_comment_text_arr[ram_num];
///////////////////////////////////////////////////////////////////
let VersionCheck = "1.0.2"
let Change = '更新模板,修改部分逻辑!'
let thank = `\n感谢 xx 的投稿`
///////////////////////////////////////////////////////////////////

async function tips(ckArr) {
    let Version_latest = await Version_Check('gqcq');
    let Version = `\n📌 本地脚本: V 1.0.1  远程仓库脚本: V ${Version_latest}`
    console.log(`${Version}`);
    msg += `${Version}`
    console.log(`📌 🆙 更新内容: ${Change}\n`);
    msg += `${Change}`

    // console.log(thank);
    // msg += `${thank}`

    await wyy();
    console.log(`\n================= 共找到 ${ckArr.length} 个账号 =================`);
    msg += `\n================= 共找到 ${ckArr.length} 个账号 =================`
    debugLog(`【debug】 这是你的账号数组:\n ${ckArr}`);
}


!(async () => {
    let ckArr = await getCks(ckStr, "gqcq_data");
    await tips(ckArr);
    for (let index = 0; index < ckArr.length; index++) {
        let num = index + 1;
        console.log(`\n------------- 开始【第 ${num} 个账号】------------- `);
        msg += `\n------------- 开始【第 ${num} 个账号】------------- `
        ck = ckArr[index].split("&");
        debugLog(`【debug】 这是你第 ${num} 账号信息:\n ${ck}`);
        await start();
    }
    await SendMsg(msg);
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done());


async function start() {

    console.log("\n开始 积分查询");
    await Points_Enquiry();

    console.log("\n开始 宝箱查询");
    await unopenlist();

    //console.log("\n开始 抽奖");
    //await dolottery();

    if (!ck_status) {
        console.log("\n开始 任务列表");
        await task_list();

    }



}




/**
 * 积分查询    httpGet
 * https://gsp.gacmotor.com/gateway/app-api/my/statsV3
 */
async function Points_Enquiry() {
    let url = {
        url: `${hostname}/gateway/app-api/my/statsV3`,
        headers: {
            "User-Agent": "okhttp/3.10.0",
            "token": ck[0],
            "verification": "signature",
            "reqTs": ts,
            "reqNonc": reqNonc,
            "reqSign": reqSign,
            "Host": host,
            "Connection": "Keep-Alive",
            "Accept-Encoding": "gzip",
        },
    };
    let result = await httpGet(url, `积分查询`);

    if (result.errorCode == 200) {
        DoubleLog(`积分查询:您当前有 ${result.data.pointCount} 积分`);
    } else {
        DoubleLog(`积分查询:失败 ❌ 了呢,原因未知！`);
        console.log(result);
        return ck_status = false;
    }
}




/**
 * 任务列表    httpPost
 * https://gsp.gacmotor.com/gw/app/community/api/mission/getlistv1?place=1
 */
async function task_list() {
    let reqNonc = randomInt(100000, 999999)
    let ts = ts10();
    let reqSign = MD5Encrypt(`signature${reqNonc}${ts}${salt}`)
    let Options = {
        url: `${hostname}/gw/app/community/api/mission/getlistv1?place=1`,
        headers: {
            "User-Agent": "okhttp/3.10.0",
            "token": ck[0],
            "verification": "signature",
            "reqTs": ts,
            "reqNonc": reqNonc,
            "reqSign": reqSign,
            "Host": "gsp.gacmotor.com",
            "Connection": "Keep-Alive",
            "Accept-Encoding": "gzip",
        },
        body: ''
    };
    let result = await httpPost(Options, `任务列表`);

    if (result.errorCode == 20000) {
        if (result.data[0].finishedNum == 0) {
            DoubleLog(`签到状态： 未签到，去执行签到 ,顺便抽个奖`);
            await signin();
            await dolottery();
        } else if (result.data[0].finishedNum == 1) {
            DoubleLog(`签到状态：今天已经签到过了鸭，明天再来吧！`);
        } else {
            DoubleLog(`获取签到状态:  失败 ❌ 了呢,原因未知！`)
        }

        if (result.data[1].finishedNum < 2) {
            DoubleLog(`发帖：${result.data[1].finishedNum} / ${result.data[1].total}`);
            DoubleLog(`发帖：执行第一次发帖,评论，删除评论`);
            await post_topic();
            DoubleLog(`发帖：执行第二次发帖,评论，删除评论`);
            await post_topic();
        } else if (result.data[1].finishedNum == 2) {
            DoubleLog(`今天已经发帖了，明天再来吧!`);
        } else {
            DoubleLog(`获取发帖状态:  失败 ❌ 了呢,原因未知!`);
        }


        if (result.data[3].finishedNum < 2) {
            DoubleLog(`分享状态：${result.data[3].finishedNum} / ${result.data[3].total}`);
            await share();
            await share();
        } else if (result.data[3].finishedNum == 2) {

            DoubleLog(`今天已经分享过了鸭，明天再来吧!`);
        } else {
            DoubleLog(`获取分享状态:  失败 ❌ 了呢,原因未知!`)
        }

    } else {
        DoubleLog(`任务列表: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
    }
}


/**
 * 签到    httpGet
 * https://gsp.gacmotor.com/gateway/app-api/sign/submit
 */
async function signin() {
    let url = {
        url: `${hostname}/gateway/app-api/sign/submit`,
        headers: {
            "User-Agent": "okhttp/3.10.0",
            "token": ck[0],
            "verification": "signature",
            "reqTs": ts,
            "reqNonc": reqNonc,
            "reqSign": reqSign,
            "Host": "gsp.gacmotor.com",
            "Connection": "Keep-Alive",
            "Accept-Encoding": "gzip",
        },
    };
    let result = await httpGet(url, `签到`);

    if (result.errorCode == 200) {
        DoubleLog(`签到:${result.errorMessage} ,你已经连续签到 ${result.data.dayCount} 天 ,签到获得G豆 ${result.data.operationValue} 个`);
    } else if (result.errorCode == "200015") {
        DoubleLog(`签到: ${result.errorMessage}`);
    } else {
        DoubleLog(`签到: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
    }
}


/**
 * 签到宝箱列表    httpPost
 * https://gsp.gacmotor.com/gw/app/activity/api/winrecord/unopenlist
 */
async function unopenlist() {
    let url = {
        url: `https://gsp.gacmotor.com/gw/app/activity/api/winrecord/unopenlist`,
        headers: {
            "token": ck[0],
            "Host": "gsp.gacmotor.com",
            "Origin": "https://gsp.gacmotor.com",
            "Accept": "application/json, text/plain, */*",
            "Cache-Control": "no-cache",
            "Sec-Fetch-Dest": "empty",
            "X-Requested-With": "com.cloudy.component",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "cors",
            "Referer": "https://gsp.gacmotor.com/h5/html/draw/index.html",
            "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        form: {
            'activityCode': 'SIGN-BOX'
        },
    };
    let result = await httpPost(url, `宝箱列表`);

    if (result.errorCode == 20000) {
        box = result.data;
        //console.log(box.length);
        DoubleLog(`共有宝箱:${box.length}个!`);
        //console.log(boxid.length);
        if (box.length > 0) {
            for (let i = 0; i < box.length; i++) {
                boxid = box[i].recordId;
                await openbox();
                await wait(2);
            }
        }
    } else {
        DoubleLog(`宝箱列表获取: 失败❌了呢,原因:${result.errorMessage}!`);
        console.log(result);
    }
}


/**
 * 开宝箱    httpPost
 * https://gsp.gacmotor.com/gw/app/activity/api/medal/openbox
 */
async function openbox() {
    let url = {
        url: `https://gsp.gacmotor.com/gw/app/activity/api/medal/openbox`,
        headers: {
            "token": ck[0],
            "Host": "gsp.gacmotor.com",
            "Origin": "https://gsp.gacmotor.com",
            "Accept": "application/json, text/plain, */*",
            "Cache-Control": "no-cache",
            "Sec-Fetch-Dest": "empty",
            "X-Requested-With": "com.cloudy.component",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "cors",
            "Referer": "https://gsp.gacmotor.com/h5/html/draw/index.html",
            "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        form: {
            'activityCode': 'OPEN-BOX',
            'recordId': boxid,
        },
    };
    let result = await httpPost(url, `开宝箱`);

    if (result.errorCode == 20000) {
        DoubleLog(`开宝箱:${result.errorMessage} ,恭喜你获得 ${result.data.medalName} 奖品为 ${result.data.medalDescription}`);
    } else {
        DoubleLog(`抽奖: 失败❌了呢,原因:${result.errorMessage}!`);
        console.log(result);
    }
}


/**
 * 抽奖剩余次数检测    httpPost
 * https://gsp.gacmotor.com/gw/app/activity/shopDraw/getchances
 */
async function lottery() {
    let url = {
        url: `https://gsp.gacmotor.com/gw/app/activity/shopDraw/getchances`,
        headers: {
            "token": ck[0],
            "Host": "gsp.gacmotor.com",
            "Origin": "https://gsp.gacmotor.com",
            "Accept": "application/json, text/plain, */*",
            "Cache-Control": "no-cache",
            "Sec-Fetch-Dest": "empty",
            "X-Requested-With": "com.cloudy.component",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "cors",
            "Referer": "https://gsp.gacmotor.com/h5/html/draw/index.html",
            "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        form: {
            'activityCode': 'shop-draw'
        },
    };
    let result = await httpPost(url, `抽奖查询`);

    if (result.errorCode == 20000) {
        chances = result.data;
        if (chances = 10) {
            await dolottery();
            await wait(2);
        }
    } else {
        DoubleLog(`抽奖: 失败❌了呢,原因:${result.errorMessage}!`);
        console.log(result);
    }
}

/**
 * 抽奖    httpPost
 * https://gsp.gacmotor.com/gw/app/activity/shopDraw/luckyDraw
 */
async function dolottery() {
    let url = {
        url: `https://gsp.gacmotor.com/gw/app/activity/shopDraw/luckyDraw`,
        headers: {
            "token": ck[0],
            "Host": "gsp.gacmotor.com",
            "Origin": "https://gsp.gacmotor.com",
            "Accept": "application/json, text/plain, */*",
            "Cache-Control": "no-cache",
            "Sec-Fetch-Dest": "empty",
            "X-Requested-With": "com.cloudy.component",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "cors",
            "Referer": "https://gsp.gacmotor.com/h5/html/draw/index.html",
            "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        form: {
            'activityCode': 'shop-draw'
        },
    };
    let result = await httpPost(url, `抽奖`);

    if (result.errorCode == 20000) {
        DoubleLog(`抽奖:${result.errorMessage} ,恭喜你获得 ${result.data.medalName} 奖品为 ${result.data.medalDescription}`);
    } else {
        DoubleLog(`抽奖: 失败❌了呢,原因:${result.errorMessage}!`);
        console.log(result);
    }
}



/**
 * 发布帖子  httpPost
 * https://gsp.gacmotor.com/gw/app/community/api/topic/appsavepost
 */
async function post_topic() {
    let url = {
        url: `https://gsp.gacmotor.com/gw/app/community/api/topic/appsavepost`,
        headers: {
            "User-Agent": "okhttp/3.10.0",
            "token": ck[0],
            "verification": "signature",
            "reqTs": ts,
            "reqNonc": reqNonc,
            "reqSign": reqSign,
            "Host": "gsp.gacmotor.com",
            "Connection": "Keep-Alive",
            "Accept-Encoding": "gzip",
        },
        body: `postId=&postType=2&topicId=176&columnId=&postTitle=那些年我们看过的电影&postContent=[{"text":"${text}"}]&coverImg=https://pic-gsp.gacmotor.com/app/42a97ad9-0bfb-4205-b838-8170ad3289e2.png&publishedTime=&contentWords=${text}&contentImgNums=1&lng=&lat=&address=&cityId=`,
    };
    let result = await httpPost(url, `发布帖子`);

    if (result.errorCode == 20000) {
        DoubleLog(`发布帖子:${result.errorMessage} ,帖子ID: ${result.data.postId}`);
        topic_id = result.data.postId;
        await wait(30);
        await add_comment();

    } else {
        DoubleLog(`发布帖子: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
    }
}



/**
 * 评论帖子  httpPost
 * https://gsp.gacmotor.com/gw/app/community/api/comment/add
 */
async function add_comment() {
    let url = {
        url: `https://gsp.gacmotor.com/gw/app/community/api/comment/add`,
        headers: {
            "User-Agent": "okhttp/3.10.0",
            "token": ck[0],
            "verification": "signature",
            "reqTs": ts,
            "reqNonc": reqNonc,
            "reqSign": reqSign,
            "Host": "gsp.gacmotor.com",
            "Connection": "Keep-Alive",
            "Accept-Encoding": "gzip",
        },
        body: `commentType=0&postId=${topic_id}&commentContent=${add_comment_text}&commentId=0&commentatorId=NDIwNTA0NQ==&isReplyComment=1`,
    };
    let result = await httpPost(url, `评论帖子`);

    if (result.errorCode == 20000) {
        DoubleLog(`评论帖子: 评论 ${topic_id} 帖子 ${result.errorMessage}`);
        await wait(2);
        await delete_topic();
    } else {
        DoubleLog(`评论帖子: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
    }
}




/**
 * 删除帖子  httpPost
 * https://gsp.gacmotor.com/gw/app/community/api/post/delete
 */
async function delete_topic() {
    let url = {
        url: `https://gsp.gacmotor.com/gw/app/community/api/post/delete`,
        headers: {
            "token": ck[0],
            "Origin": "https://gsp.gacmotor.com",
            "Accept": "application/json, text/plain, */*",
            "Cache-Control": "no-cache",
            "Sec-Fetch-Dest": "empty",
            "X-Requested-With": "com.cloudy.component",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "cors",
            "Referer": "https://gsp.gacmotor.com/h5/html/community/myHome.html?userId=NDIwNTA0NQ==&version=newApp",
            "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `postId=${topic_id}`,
    };
    let result = await httpPost(url, `删除帖子`);

    if (result.errorCode == 20000) {
        DoubleLog(`删除帖子: 帖子ID: ${topic_id} , 执行删除 ${result.errorMessage}`);
        await wait(2);
    } else {
        DoubleLog(`删除帖子: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
    }
}





/**
 * 分享文章   每天两次   httpPost
 * https://gsp.gacmotor.com/gw/app/community/api/post/forward
 */
async function share() {
    postId = '';
    await Article_list();
    let url = {
        url: `https://gsp.gacmotor.com/gw/app/community/api/post/forward`,
        headers: {
            "User-Agent": "okhttp/3.10.0",
            "token": ck[0],
            "verification": "signature",
            "reqTs": ts,
            "reqNonc": reqNonc,
            "reqSign": reqSign,
            "Host": "gsp.gacmotor.com",
            "Connection": "Keep-Alive",
            "Accept-Encoding": "gzip",
        },
        body: `postId=${postId}&userId=`,
    };
    let result = await httpPost(url, `分享文章`);

    if (result.errorCode == 20000) {
        DoubleLog(`分享文章:${result.errorMessage}`);
        await wait(2);
    } else {
        DoubleLog(`分享文章: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
    }
}



/**
 * 文章列表    httpGet
 * https://gsp.gacmotor.com/gw/app/community/api/post/channelPostList?current=1&size=20&channelId=&sortType=1
 */
async function Article_list() {
    let url = {
        url: `${hostname}/gw/app/community/api/post/channelPostList?current=1&size=20&channelId=&sortType=1`,
        headers: {
            "User-Agent": "okhttp/3.10.0",
            "token": ck[0],
            "verification": "signature",
            "reqTs": ts,
            "reqNonc": reqNonc,
            "reqSign": reqSign,
            "Host": "gsp.gacmotor.com",
            "Connection": "Keep-Alive",
            "Accept-Encoding": "gzip",
        },
    };
    let result = await httpGet(url, `文章列表`);

    if (result.errorCode === "20000") {
        let num = randomInt(1, 19);
        DoubleLog(`分享的文章: ${result.data.records[num].topicNames}  文章ID:${result.data.records[num].postId}`);
        postId = result.data.records[num].postId;
    } else {
        DoubleLog(`分享文章: 失败 ❌ 了呢,原因未知!`);
        console.log(result);
    }
}




















// #region ********************************************************  固定代码  ********************************************************
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
                VersionCheck = resp.body.match(/VersionCheck = "([\d\.]+)"/)[1]
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

/**
 * 双平台log输出
 */
function DoubleLog(data) {
    if (data) {
        console.log(`    ${data}`);
        msg += `\n    ${data}`;
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


// md5
function MD5Encrypt(a) { function b(a, b) { return a << b | a >>> 32 - b } function c(a, b) { var c, d, e, f, g; return e = 2147483648 & a, f = 2147483648 & b, c = 1073741824 & a, d = 1073741824 & b, g = (1073741823 & a) + (1073741823 & b), c & d ? 2147483648 ^ g ^ e ^ f : c | d ? 1073741824 & g ? 3221225472 ^ g ^ e ^ f : 1073741824 ^ g ^ e ^ f : g ^ e ^ f } function d(a, b, c) { return a & b | ~a & c } function e(a, b, c) { return a & c | b & ~c } function f(a, b, c) { return a ^ b ^ c } function g(a, b, c) { return b ^ (a | ~c) } function h(a, e, f, g, h, i, j) { return a = c(a, c(c(d(e, f, g), h), j)), c(b(a, i), e) } function i(a, d, f, g, h, i, j) { return a = c(a, c(c(e(d, f, g), h), j)), c(b(a, i), d) } function j(a, d, e, g, h, i, j) { return a = c(a, c(c(f(d, e, g), h), j)), c(b(a, i), d) } function k(a, d, e, f, h, i, j) { return a = c(a, c(c(g(d, e, f), h), j)), c(b(a, i), d) } function l(a) { for (var b, c = a.length, d = c + 8, e = (d - d % 64) / 64, f = 16 * (e + 1), g = new Array(f - 1), h = 0, i = 0; c > i;)b = (i - i % 4) / 4, h = i % 4 * 8, g[b] = g[b] | a.charCodeAt(i) << h, i++; return b = (i - i % 4) / 4, h = i % 4 * 8, g[b] = g[b] | 128 << h, g[f - 2] = c << 3, g[f - 1] = c >>> 29, g } function m(a) { var b, c, d = "", e = ""; for (c = 0; 3 >= c; c++)b = a >>> 8 * c & 255, e = "0" + b.toString(16), d += e.substr(e.length - 2, 2); return d } function n(a) { a = a.replace(/\r\n/g, "\n"); for (var b = "", c = 0; c < a.length; c++) { var d = a.charCodeAt(c); 128 > d ? b += String.fromCharCode(d) : d > 127 && 2048 > d ? (b += String.fromCharCode(d >> 6 | 192), b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224), b += String.fromCharCode(d >> 6 & 63 | 128), b += String.fromCharCode(63 & d | 128)) } return b } var o, p, q, r, s, t, u, v, w, x = [], y = 7, z = 12, A = 17, B = 22, C = 5, D = 9, E = 14, F = 20, G = 4, H = 11, I = 16, J = 23, K = 6, L = 10, M = 15, N = 21; for (a = n(a), x = l(a), t = 1732584193, u = 4023233417, v = 2562383102, w = 271733878, o = 0; o < x.length; o += 16)p = t, q = u, r = v, s = w, t = h(t, u, v, w, x[o + 0], y, 3614090360), w = h(w, t, u, v, x[o + 1], z, 3905402710), v = h(v, w, t, u, x[o + 2], A, 606105819), u = h(u, v, w, t, x[o + 3], B, 3250441966), t = h(t, u, v, w, x[o + 4], y, 4118548399), w = h(w, t, u, v, x[o + 5], z, 1200080426), v = h(v, w, t, u, x[o + 6], A, 2821735955), u = h(u, v, w, t, x[o + 7], B, 4249261313), t = h(t, u, v, w, x[o + 8], y, 1770035416), w = h(w, t, u, v, x[o + 9], z, 2336552879), v = h(v, w, t, u, x[o + 10], A, 4294925233), u = h(u, v, w, t, x[o + 11], B, 2304563134), t = h(t, u, v, w, x[o + 12], y, 1804603682), w = h(w, t, u, v, x[o + 13], z, 4254626195), v = h(v, w, t, u, x[o + 14], A, 2792965006), u = h(u, v, w, t, x[o + 15], B, 1236535329), t = i(t, u, v, w, x[o + 1], C, 4129170786), w = i(w, t, u, v, x[o + 6], D, 3225465664), v = i(v, w, t, u, x[o + 11], E, 643717713), u = i(u, v, w, t, x[o + 0], F, 3921069994), t = i(t, u, v, w, x[o + 5], C, 3593408605), w = i(w, t, u, v, x[o + 10], D, 38016083), v = i(v, w, t, u, x[o + 15], E, 3634488961), u = i(u, v, w, t, x[o + 4], F, 3889429448), t = i(t, u, v, w, x[o + 9], C, 568446438), w = i(w, t, u, v, x[o + 14], D, 3275163606), v = i(v, w, t, u, x[o + 3], E, 4107603335), u = i(u, v, w, t, x[o + 8], F, 1163531501), t = i(t, u, v, w, x[o + 13], C, 2850285829), w = i(w, t, u, v, x[o + 2], D, 4243563512), v = i(v, w, t, u, x[o + 7], E, 1735328473), u = i(u, v, w, t, x[o + 12], F, 2368359562), t = j(t, u, v, w, x[o + 5], G, 4294588738), w = j(w, t, u, v, x[o + 8], H, 2272392833), v = j(v, w, t, u, x[o + 11], I, 1839030562), u = j(u, v, w, t, x[o + 14], J, 4259657740), t = j(t, u, v, w, x[o + 1], G, 2763975236), w = j(w, t, u, v, x[o + 4], H, 1272893353), v = j(v, w, t, u, x[o + 7], I, 4139469664), u = j(u, v, w, t, x[o + 10], J, 3200236656), t = j(t, u, v, w, x[o + 13], G, 681279174), w = j(w, t, u, v, x[o + 0], H, 3936430074), v = j(v, w, t, u, x[o + 3], I, 3572445317), u = j(u, v, w, t, x[o + 6], J, 76029189), t = j(t, u, v, w, x[o + 9], G, 3654602809), w = j(w, t, u, v, x[o + 12], H, 3873151461), v = j(v, w, t, u, x[o + 15], I, 530742520), u = j(u, v, w, t, x[o + 2], J, 3299628645), t = k(t, u, v, w, x[o + 0], K, 4096336452), w = k(w, t, u, v, x[o + 7], L, 1126891415), v = k(v, w, t, u, x[o + 14], M, 2878612391), u = k(u, v, w, t, x[o + 5], N, 4237533241), t = k(t, u, v, w, x[o + 12], K, 1700485571), w = k(w, t, u, v, x[o + 3], L, 2399980690), v = k(v, w, t, u, x[o + 10], M, 4293915773), u = k(u, v, w, t, x[o + 1], N, 2240044497), t = k(t, u, v, w, x[o + 8], K, 1873313359), w = k(w, t, u, v, x[o + 15], L, 4264355552), v = k(v, w, t, u, x[o + 6], M, 2734768916), u = k(u, v, w, t, x[o + 13], N, 1309151649), t = k(t, u, v, w, x[o + 4], K, 4149444226), w = k(w, t, u, v, x[o + 11], L, 3174756917), v = k(v, w, t, u, x[o + 2], M, 718787259), u = k(u, v, w, t, x[o + 9], N, 3951481745), t = c(t, p), u = c(u, q), v = c(v, r), w = c(w, s); var O = m(t) + m(u) + m(v) + m(w); return O.toLowerCase() }



// 完整 Env
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }

      //#endregion
