/**
 * 广汽传祺  app 
 *
 * cron 10 7 * * *  gqcq.js
 *
 * 4-13     	完成签到 抽奖 分享 发帖 评论 任务   有bug及时反馈
 * 4-14     	修复已知bug  恢复正常使用
 * 5-21     	更新通知,优化代码
 * 6-10		    更新模板,修改部分逻辑!
 * 9-12         修复抽奖，增加签到宝箱开启
 * 9-21         增加用户信息输出
 * 9-22			修复开宝箱错误
 * 9-28			修复删除帖子错误
 * 9-29			增加了快递信息查询,不用来回看了
 * 10-10		感谢 banxiaya 大佬修复
 * 12.14        查询增加手机号
 *
 * ========= 青龙--配置文件--贴心复制区域 =========
 
# 广汽传祺
export gqcq='token @ token'

 * 
 * 多账号用 换行 或 @ 分割
 * 抓包 gsp.gacmotor.com , 找到 token 即可
 * ====================================
 * tg频道: https://t.me/yml2213_tg  
 */



const utils = require("yml2213-utils")
const $ = new Env("广汽传祺")
const ckName = "gqcq"
//check_utils("utils.js");
//-------------------- 一般不动变量区域 -------------------------------------
const notify = $.isNode() ? require("./sendNotify") : ""
const Notify = 1		 //0为关闭通知,1为打开通知,默认为1
let envSplitor = ["@", "\n", "&"]
let ck = msg = ''
let host, hostname
let userCookie = process.env[ckName]
let userList = []
let userIdx = 0
let userCount = 0
//---------------------- 自定义变量区域 -----------------------------------
let app_id = 14
let text = sign = ''
//---------------------------------------------------------

async function start() {


    console.log('\n================== 用户信息 ==================\n')
    taskall = []
    for (let user of userList) {
        taskall.push(user.user_info('用户信息'))
    }
    await Promise.all(taskall)

    console.log('\n================== 任务列表 ==================\n')
    taskall = []
    for (let user of userList) {
        taskall.push(user.task_list('任务列表'))
        taskall.push(user.unopenlist('宝箱查询'))
    }
    await Promise.all(taskall)

    console.log('\n================== 积分查询 ==================\n')
    taskall = []
    for (let user of userList) {
        taskall.push(user.Points_Enquiry('积分查询'))
    }
    await Promise.all(taskall)


}


class UserInfo {
    constructor(str) {
        this.index = ++userIdx
        this.ck = str.split('&')[0]

        this.host = "gsp.gacmotor.com"
        this.hostname = "https://" + this.host
        this.salt = '17aaf8118ffb270b766c6d6774317a133.8.0'
        this.reqNonc = randomInt(100000, 999999)
        this.ts = utils.ts13()
        this.reqSign = MD5_Encrypt(`signature${this.reqNonc}${this.ts}${this.salt}`)
        this.textarr = ['最简单的提高观赏性的办法就是把地球故事的部分剪辑掉半小时， emo的部分剪辑掉半小时。这样剩下的90分钟我们就看看外星人，看看月球，看看灾难片大场面就不错。', '顶着叛国罪的风险无比坚信前妻，这种还会离婚？', '你以为它是灾难片，其实它是科幻片；你以为它是科幻片，其实它是恐怖片；你以为它是恐怖片，其实它是科教片', '我的天，剧情真的好阴谋论，但是还算是能自圆其说', '大杂烩啊……我能理解这电影为什么在海外卖的不好了，因为核心创意真的已经太老套了', '一开始我以为这就是外国人看《流浪地球》时的感受啊，后来发现这不是我当初看《胜利号》的感受么']
        this.add_comment_text_arr = ['感谢推荐的电影呢', '有时间一定看看这个电影怎么样', '晚上就去看', '66666666666', '这部电影我看过，非常好看']
        this.ram_num = randomInt(1, 5)
        this.text = this.textarr[this.ram_num]
        this.add_comment_text = this.add_comment_text_arr[this.ram_num]

        this.cq_headers = {
            'token': this.ck,
            'reqTs': this.ts,
            'reqSign': this.reqSign,
            'reqNonc': this.reqNonc,
            'channel': 'unknown',
            'platformNo': 'Android',
            'osVersion': '10',
            'version': '3.8.0',
            'imei': 'a4dad7a1b1f865bc',
            'imsi': 'unknown',
            'deviceModel': 'MI 8',
            'deviceType': 'Android',
            'registrationID': '100d855909bb3584777',
            'verification': 'signature',
            'Host': 'gsp.gacmotor.com',
            'User-Agent': 'okhttp/3.10.0',
        },
            this.cq_headers2 = {
                "token": this.ck,
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
            }

    }

    async user_info(name) { // 用户信息
        try {
            let options = {
                method: "Get",
                url: `${this.hostname}/gateway/webapi/account/getUserInfoV2`,
                headers: this.cq_headers,
            }
            //console.log(options);
            let result = await httpRequest(name, options)
            //console.log(result);
            if (result.errorCode == 200) {
                DoubleLog(`账号[${this.index}]  欢迎用户: ${result.data.nickname}   手机号：${result.data.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}`)
                this.nickname = result.data.nickname
            } else {
                DoubleLog(`账号[${this.index}]  用户查询:失败 ❌ 了呢,原因未知！`)
                console.log(result)
            }
        } catch (error) {
            console.log(error)
        }
    }


    async Points_Enquiry(name) { //积分查询
        try {
            let options = {
                method: "Get",
                url: `${this.hostname}/gateway/app-api/my/statsV3`,
                headers: this.cq_headers,
            }
            // console.log(options);
            let result = await httpRequest(name, options)
            // console.log(result);
            if (result.errorCode == 200) {
                DoubleLog(`账号[${this.index}]  ${this.nickname} 积分查询:您当前有 ${result.data.pointCount} 积分`)
            } else {
                DoubleLog(`账号[${this.index}]  积分查询:失败 ❌ 了呢,原因未知！`)
                console.log(result)
            }
        } catch (error) {
            console.log(error)
        }
    }

    // 任务列表   
    async task_list(name) {
        try {
            let options = {
                method: "Post",
                url: `${this.hostname}/gw/app/community/api/mission/getlistv1?place=1`,
                headers: this.cq_headers,
                body: 'https://gsp.gacmotor.com/gw/app/community/api/mission/getlistv1?place=1'
            }
            // console.log(options);
            let result = await httpRequest(name, options)
            // console.log(result);
            if (result.errorCode == 20000) {
                if (result.data[0].finishedNum == 0) {
                    DoubleLog(`账号[${this.index}]  签到状态： 未签到，去执行签到 ,顺便抽个奖`)
                    await this.signin('签到')
                    await this.dolottery('抽奖')
                } else if (result.data[0].finishedNum == 1) {
                    DoubleLog(`账号[${this.index}]  签到状态：今天已经签到过了鸭，明天再来吧！`)
                } else {
                    DoubleLog(`账号[${this.index}]  获取签到状态:  失败 ❌ 了呢,原因未知！`)
                }
                if (result.data[1].finishedNum < 2) {
                    DoubleLog(`账号[${this.index}]  发帖：${result.data[1].finishedNum} / ${result.data[1].total}`)
                    DoubleLog(`账号[${this.index}]  发帖：执行第一次发帖,评论，删除评论`)
                    await this.post_topic('发帖')
                    DoubleLog(`账号[${this.index}]  发帖：执行第二次发帖,评论，删除评论`)
                    await this.post_topic('发帖')
                } else if (result.data[1].finishedNum == 2) {
                    DoubleLog(`账号[${this.index}]  今天已经发帖了，明天再来吧!`)
                } else {
                    DoubleLog(`账号[${this.index}]  获取发帖状态:  失败 ❌ 了呢,原因未知!`)
                }
                if (result.data[3].finishedNum < 2) {
                    DoubleLog(`账号[${this.index}]  分享状态：${result.data[3].finishedNum} / ${result.data[3].total}`)
                    await this.share('分享文章')
                    await this.share('分享文章')
                } else if (result.data[3].finishedNum == 2) {
                    DoubleLog(`账号[${this.index}]  今天已经分享过了鸭，明天再来吧!`)
                } else {
                    DoubleLog(`账号[${this.index}]  获取分享状态:  失败 ❌ 了呢,原因未知!`)
                }

            } else {
                DoubleLog(`账号[${this.index}]  任务列表: 失败 ❌ 了呢,原因未知!`)
                console.log(result)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async signin(name) {   //签到  get
        try {
            let options = {
                method: "Get",
                url: `${this.hostname}/gateway/app-api/sign/submit`,
                headers: this.cq_headers,
            }
            // console.log(options);
            let result = await httpRequest(name, options)
            // console.log(result);
            if (result.errorCode == 200) {
                DoubleLog(`账号[${this.index}]  签到:${result.errorMessage} ,你已经连续签到 ${result.data.dayCount} 天 ,签到获得G豆 ${result.data.operationValue} 个`)
            } else if (result.errorCode == "200015") {
                DoubleLog(`账号[${this.index}]  签到: ${result.errorMessage}`)
            } else {
                DoubleLog(`账号[${this.index}]  签到: 失败 ❌ 了呢,原因未知!`)
                console.log(result)
            }
        } catch (error) {
            console.log(error)
        }
    }


    async unopenlist(name) {// 签到宝箱列表   httpPost
        try {
            let options = {
                method: "Post",
                url: `${this.hostname}/gw/app/activity/api/winrecord/unopenlist`,
                headers: this.cq_headers2,
                form: {
                    'activityCode': 'SIGN-BOX'
                }
            }
            // console.log(options);
            let result = await httpRequest(name, options)
            // console.log(result);
            if (result.errorCode == 20000) {
                this.box = result.data
                //console.log(box.length);
                DoubleLog(`账号[${this.index}]  共有宝箱:${this.box.length}个!`)
                //console.log(boxid.length);
                if (this.box.length > 0) {
                    for (let i = 0; i < this.box.length; i++) {
                        this.boxid = this.box[i].recordId
                        await this.openbox()
                        await wait(2)
                    }
                }
            } else {
                DoubleLog(`账号[${this.index}]  宝箱列表获取: 失败❌了呢,原因:${result.errorMessage}!`)
                console.log(result)
            }
        } catch (error) {
            console.log(error)
        }
    }


    async openbox(name) {// 开宝箱   httpPost
        try {
            let options = {
                method: "Post",
                url: `${this.hostname}/gw/app/activity/api/medal/openbox`,
                headers: this.cq_headers2,
                form: {
                    'activityCode': 'OPEN-BOX',
                    'recordId': this.boxid,
                }
            }
            // console.log(options);
            let result = await httpRequest(name, options)
            // console.log(result);
            if (result.errorCode == 20000) {
                DoubleLog(`账号[${this.index}]  开宝箱:${result.errorMessage} ,恭喜你获得 ${result.data.medalName} 奖品为 ${result.data.medalDescription}`)
            } else {
                DoubleLog(`账号[${this.index}]  开宝箱: 失败❌了呢,原因:${result.errorMessage}!`)
                console.log(result)
            }
        } catch (error) {
            console.log(error)
        }
    }


    async dolottery(name) { //抽奖   httpPost
        try {
            let options = {
                method: "Post",
                url: `${this.hostname}/gw/app/activity/shopDraw/luckyDraw`,
                headers: this.cq_headers2,
                form: {
                    'activityCode': 'shop-draw'
                }
            }
            // console.log(options);
            let result = await httpRequest(name, options)
            // console.log(result);
            if (result.errorCode == 20000) {
                DoubleLog(`账号[${this.index}]  抽奖:${result.errorMessage} ,恭喜你获得 ${result.data.medalName} 奖品为 ${result.data.medalDescription}`)
            } else {
                DoubleLog(`账号[${this.index}]  抽奖: 失败❌了呢,原因:${result.errorMessage}!`)
                console.log(result)
            }
        } catch (error) {
            console.log(error)
        }
    }


    async post_topic(name) {// 发布帖子   httpPost
        try {
            let options = {
                method: "Post",
                url: `${this.hostname}/gw/app/community/api/topic/appsavepost`,
                headers: this.cq_headers,
                form: {
                    'postId': '',
                    'postType': '2',
                    'channelInfoId': '116',
                    'columnId': '',
                    'postContent': `[{"text":"${this.text}"}]`,
                    'coverImg': 'https://pic-gsp.gacmotor.com/app/712e2529-7b85-4d70-8c71-22b994b445b5.jpg',
                    'publishedTime': '',
                    'contentWords': `${this.text}`,
                    'contentImgNums': '1',
                    'lng': '',
                    'lat': '',
                    'address': '',
                    'cityId': ''
                }
            }
            // console.log(options);
            let result = await httpRequest(name, options)
            // console.log(result);
            if (result.errorCode == 20000) {
                DoubleLog(`账号[${this.index}]  发布帖子:${result.errorMessage} ,帖子ID: ${result.data.postId}`)
                this.topic_id = result.data.postId
                await wait(30)
                await this.add_comment('评论帖子')
            } else {
                DoubleLog(`账号[${this.index}]  发布帖子: 失败 ❌ 了呢,原因未知!`)
                console.log(result)
            }
        } catch (error) {
            console.log(error)
        }
    }


    async add_comment(name) {// 评论帖子   httpPost
        try {
            let options = {
                method: "Post",
                url: `${this.hostname}/gw/app/community/api/comment/add`,
                headers: this.cq_headers,
                form: {
                    'commentType': '0',
                    'postId': `${this.topic_id}`,
                    'commentContent': `${this.add_comment_text}`,
                    'commentId': '0',
                    'commentatorId': 'NDc3ODY1MA==',
                    'isReplyComment': '1'
                }
            }

            // console.log(options);
            let result = await httpRequest(name, options)
            // console.log(result);
            if (result.errorCode == 20000) {
                DoubleLog(`账号[${this.index}]  评论帖子: 评论 ${this.topic_id} 帖子 ${result.errorMessage}`)
                await wait(2)
                await this.delete_topic('删除帖子')
            } else {
                DoubleLog(`账号[${this.index}]  评论帖子: 失败 ❌ 了呢,原因未知!`)
                console.log(result)
            }
        } catch (error) {
            console.log(error)
        }
    }



    async delete_topic(name) {// 删除帖子   httpPost
        try {
            let options = {
                method: "Post",
                url: `${this.hostname}/gw/app/community/api/post/delete?postId=${this.topic_id}`,
                headers: this.cq_headers,
                form: {
                    'postId': `'${this.topic_id}'`
                },
            }
            // console.log(options);
            let result = await httpRequest(name, options)
            // console.log(result);
            if (result.errorCode == 20000) {
                DoubleLog(`账号[${this.index}]  删除帖子: 帖子ID: ${this.topic_id} , 执行删除 ${result.errorMessage}`)
                await wait(2)
            } else {
                DoubleLog(`账号[${this.index}]  删除帖子: 失败 ❌ 了呢,原因未知!`)
                console.log(result)
            }
        } catch (error) {
            console.log(error)
        }
    }


    async share(name) {// 分享文章   每天两次   httpPost
        try {
            this.postId = ''
            await this.Article_list('获取文章id')
            let options = {
                method: "Post",
                url: `${this.hostname}/gw/app/community/api/post/forward`,
                headers: this.cq_headers,
                form: {
                    'postId': `${this.postId}`,
                    'userId': ''
                },
            }
            //console.log(options);
            let result = await httpRequest(name, options)
            //console.log(result);
            if (result.errorCode == 20000) {
                DoubleLog(`账号[${this.index}]  分享文章:${result.errorMessage}`)
                await wait(2)
            } else {
                DoubleLog(`账号[${this.index}]  分享文章: 失败 ❌ 了呢,原因未知!`)
                console.log(result)
            }
        } catch (error) {
            console.log(error)
        }
    }


    async Article_list(name) {  // 文章列表  httpGet
        try {
            let options = {
                method: "Get",
                url: `${this.hostname}/gw/app/community/api/post/channelPostList?current=1&size=20&channelId=&sortType=1`,
                headers: this.cq_headers,
            }
            // console.log(options);
            let result = await httpRequest(name, options)
            // console.log(result);
            if (result.errorCode === "20000") {
                let num = randomInt(1, 19)
                DoubleLog(`账号[${this.index}]  分享的文章: ${result.data.records[num].topicNames}  文章ID:${result.data.records[num].postId}`)
                this.postId = result.data.records[num].postId
                //console.log(this.postId);
                return this.postId
            } else {
                DoubleLog(`账号[${this.index}] 获取分享文章: 失败 ❌ 了呢,原因未知!`)
                console.log(result)
            }
        } catch (error) {
            console.log(error)
        }
    }



}

!(async () => {
    if (!(await checkEnv())) return
    if (userList.length > 0) {
        await start()
    }
    await SendMsg(msg)
})()
    .catch((e) => console.log(e))
    .finally(() => $.done())


// #region ********************************************************  固定代码  ********************************************************


// 变量检查与处理
async function checkEnv() {
    if (userCookie) {
        // console.log(userCookie);
        let e = envSplitor[0]
        for (let o of envSplitor)
            if (userCookie.indexOf(o) > -1) {
                e = o
                break
            }
        for (let n of userCookie.split(e)) n && userList.push(new UserInfo(n))
        userCount = userList.length
    } else {
        console.log("未找到CK")
        return
    }
    return console.log(`共找到${userCount}个账号`), !0
}



// =========================================== 不懂不要动 =========================================================
function Env(name, e) { class s { constructor(name) { this.env = name } } return new (class { constructor(name) { (this.name = name), (this.logs = []), (this.startTime = new Date().getTime()), this.log(`\n🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } log(...name) { name.length > 0 && (this.logs = [...this.logs, ...name]), console.log(name.join(this.logSeparator)) } done() { const e = new Date().getTime(), s = (e - this.startTime) / 1e3; this.log(`\n🔔${this.name}, 结束! 🕛 ${s} 秒`) } })(name, e) } async function httpRequest(name, options) { if (!name) { name = /function\s*(\w*)/i.exec(arguments.callee.toString())[1] } try { let result = await utils.httpRequest(name, options); if (result) { return result } { DoubleLog(`未知错误(1)`) } } catch (error) { console.log(error) } } async function SendMsg(message) { if (!message) return; if (Notify > 0) { if ($.isNode()) { var notify = require("./sendNotify"); await notify.sendNotify($.name, message) } else { console.log($.name, "", message) } } else { console.log(message) } } function wait(n) { return new Promise(function (resolve) { setTimeout(resolve, n * 1000) }) } function DoubleLog(data) { console.log(`    ${data}`); msg += `\n    ${data}` }

/**
 * 随机 数字 + 小写字母 生成
 */
function randomszxx(e) {
    e = e || 32
    var t = "qwertyuioplkjhgfdsazxcvbnm1234567890",
        a = t.length,
        n = ""

    for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a))
    return n
}

/**
 * 随机整数生成
 */
function randomInt(min, max) {
    return Math.round(Math.random() * (max - min) + min)
}

/**
 * md5 加密
 */
function MD5_Encrypt(a) { function b(a, b) { return (a << b) | (a >>> (32 - b)) } function c(a, b) { var c, d, e, f, g; return ((e = 2147483648 & a), (f = 2147483648 & b), (c = 1073741824 & a), (d = 1073741824 & b), (g = (1073741823 & a) + (1073741823 & b)), c & d ? 2147483648 ^ g ^ e ^ f : c | d ? 1073741824 & g ? 3221225472 ^ g ^ e ^ f : 1073741824 ^ g ^ e ^ f : g ^ e ^ f) } function d(a, b, c) { return (a & b) | (~a & c) } function e(a, b, c) { return (a & c) | (b & ~c) } function f(a, b, c) { return a ^ b ^ c } function g(a, b, c) { return b ^ (a | ~c) } function h(a, e, f, g, h, i, j) { return (a = c(a, c(c(d(e, f, g), h), j))), c(b(a, i), e) } function i(a, d, f, g, h, i, j) { return (a = c(a, c(c(e(d, f, g), h), j))), c(b(a, i), d) } function j(a, d, e, g, h, i, j) { return (a = c(a, c(c(f(d, e, g), h), j))), c(b(a, i), d) } function k(a, d, e, f, h, i, j) { return (a = c(a, c(c(g(d, e, f), h), j))), c(b(a, i), d) } function l(a) { for (var b, c = a.length, d = c + 8, e = (d - (d % 64)) / 64, f = 16 * (e + 1), g = new Array(f - 1), h = 0, i = 0; c > i;) (b = (i - (i % 4)) / 4), (h = (i % 4) * 8), (g[b] = g[b] | (a.charCodeAt(i) << h)), i++; return ((b = (i - (i % 4)) / 4), (h = (i % 4) * 8), (g[b] = g[b] | (128 << h)), (g[f - 2] = c << 3), (g[f - 1] = c >>> 29), g) } function m(a) { var b, c, d = "", e = ""; for (c = 0; 3 >= c; c++) (b = (a >>> (8 * c)) & 255), (e = "0" + b.toString(16)), (d += e.substr(e.length - 2, 2)); return d } function n(a) { a = a.replace(/\r\n/g, "\n"); for (var b = "", c = 0; c < a.length; c++) { var d = a.charCodeAt(c); 128 > d ? (b += String.fromCharCode(d)) : d > 127 && 2048 > d ? ((b += String.fromCharCode((d >> 6) | 192)), (b += String.fromCharCode((63 & d) | 128))) : ((b += String.fromCharCode((d >> 12) | 224)), (b += String.fromCharCode(((d >> 6) & 63) | 128)), (b += String.fromCharCode((63 & d) | 128))) } return b } var o, p, q, r, s, t, u, v, w, x = [], y = 7, z = 12, A = 17, B = 22, C = 5, D = 9, E = 14, F = 20, G = 4, H = 11, I = 16, J = 23, K = 6, L = 10, M = 15, N = 21; for (a = n(a), x = l(a), t = 1732584193, u = 4023233417, v = 2562383102, w = 271733878, o = 0; o < x.length; o += 16) (p = t), (q = u), (r = v), (s = w), (t = h(t, u, v, w, x[o + 0], y, 3614090360)), (w = h(w, t, u, v, x[o + 1], z, 3905402710)), (v = h(v, w, t, u, x[o + 2], A, 606105819)), (u = h(u, v, w, t, x[o + 3], B, 3250441966)), (t = h(t, u, v, w, x[o + 4], y, 4118548399)), (w = h(w, t, u, v, x[o + 5], z, 1200080426)), (v = h(v, w, t, u, x[o + 6], A, 2821735955)), (u = h(u, v, w, t, x[o + 7], B, 4249261313)), (t = h(t, u, v, w, x[o + 8], y, 1770035416)), (w = h(w, t, u, v, x[o + 9], z, 2336552879)), (v = h(v, w, t, u, x[o + 10], A, 4294925233)), (u = h(u, v, w, t, x[o + 11], B, 2304563134)), (t = h(t, u, v, w, x[o + 12], y, 1804603682)), (w = h(w, t, u, v, x[o + 13], z, 4254626195)), (v = h(v, w, t, u, x[o + 14], A, 2792965006)), (u = h(u, v, w, t, x[o + 15], B, 1236535329)), (t = i(t, u, v, w, x[o + 1], C, 4129170786)), (w = i(w, t, u, v, x[o + 6], D, 3225465664)), (v = i(v, w, t, u, x[o + 11], E, 643717713)), (u = i(u, v, w, t, x[o + 0], F, 3921069994)), (t = i(t, u, v, w, x[o + 5], C, 3593408605)), (w = i(w, t, u, v, x[o + 10], D, 38016083)), (v = i(v, w, t, u, x[o + 15], E, 3634488961)), (u = i(u, v, w, t, x[o + 4], F, 3889429448)), (t = i(t, u, v, w, x[o + 9], C, 568446438)), (w = i(w, t, u, v, x[o + 14], D, 3275163606)), (v = i(v, w, t, u, x[o + 3], E, 4107603335)), (u = i(u, v, w, t, x[o + 8], F, 1163531501)), (t = i(t, u, v, w, x[o + 13], C, 2850285829)), (w = i(w, t, u, v, x[o + 2], D, 4243563512)), (v = i(v, w, t, u, x[o + 7], E, 1735328473)), (u = i(u, v, w, t, x[o + 12], F, 2368359562)), (t = j(t, u, v, w, x[o + 5], G, 4294588738)), (w = j(w, t, u, v, x[o + 8], H, 2272392833)), (v = j(v, w, t, u, x[o + 11], I, 1839030562)), (u = j(u, v, w, t, x[o + 14], J, 4259657740)), (t = j(t, u, v, w, x[o + 1], G, 2763975236)), (w = j(w, t, u, v, x[o + 4], H, 1272893353)), (v = j(v, w, t, u, x[o + 7], I, 4139469664)), (u = j(u, v, w, t, x[o + 10], J, 3200236656)), (t = j(t, u, v, w, x[o + 13], G, 681279174)), (w = j(w, t, u, v, x[o + 0], H, 3936430074)), (v = j(v, w, t, u, x[o + 3], I, 3572445317)), (u = j(u, v, w, t, x[o + 6], J, 76029189)), (t = j(t, u, v, w, x[o + 9], G, 3654602809)), (w = j(w, t, u, v, x[o + 12], H, 3873151461)), (v = j(v, w, t, u, x[o + 15], I, 530742520)), (u = j(u, v, w, t, x[o + 2], J, 3299628645)), (t = k(t, u, v, w, x[o + 0], K, 4096336452)), (w = k(w, t, u, v, x[o + 7], L, 1126891415)), (v = k(v, w, t, u, x[o + 14], M, 2878612391)), (u = k(u, v, w, t, x[o + 5], N, 4237533241)), (t = k(t, u, v, w, x[o + 12], K, 1700485571)), (w = k(w, t, u, v, x[o + 3], L, 2399980690)), (v = k(v, w, t, u, x[o + 10], M, 4293915773)), (u = k(u, v, w, t, x[o + 1], N, 2240044497)), (t = k(t, u, v, w, x[o + 8], K, 1873313359)), (w = k(w, t, u, v, x[o + 15], L, 4264355552)), (v = k(v, w, t, u, x[o + 6], M, 2734768916)), (u = k(u, v, w, t, x[o + 13], N, 1309151649)), (t = k(t, u, v, w, x[o + 4], K, 4149444226)), (w = k(w, t, u, v, x[o + 11], L, 3174756917)), (v = k(v, w, t, u, x[o + 2], M, 718787259)), (u = k(u, v, w, t, x[o + 9], N, 3951481745)), (t = c(t, p)), (u = c(u, q)), (v = c(v, r)), (w = c(w, s)); var O = m(t) + m(u) + m(v) + m(w); return O.toLowerCase() }

//async function check_utils(file_name) { await check(file_name); try { utils = require("./utils"); return utils; } catch (error) { console.log(error); } async function check(file_name) { const fs = require("fs"); const path = require("path"); dirPath = path.resolve(__dirname); let files = fs.readdirSync(dirPath); if (files.indexOf(file_name) > -1) { console.log(`当前目录 [${dirPath}] 依赖 ${file_name} 文件状态正常!`); utils = require("./utils"); return utils; } else { console.log(`当前目录 [${dirPath}] 未找到 ${file_name} , 将下载到该目录!`); write_utils(file_name); } function write_utils(file_name) { var request = require("request"); var options = { method: "GET", url: "https://raw.gh.fakev.cn/yml2213/javascript/master/utils.js", headers: {}, }; request(options, function (error, response) { if (error) throw new Error(error); text = response.body; fs.writeFile(`${dirPath}/${file_name}`, text, `utf-8`, (err) => { if (err) { console.log(`目录 [${dirPath}]  ${file_name} 文件 写入失败`); } console.log(`\n目录 [${dirPath}]  ${file_name} 文件写入成功\n请再次运行脚本!\n请再次运行脚本!\n请再次运行脚本!`); }); }); } } }