/*
广汽传祺 app             cron 22 8,12 * * *  gqcq.js

4-13     	完成签到 抽奖 分享 发帖 评论 任务   有bug及时反馈
4-14     	修复已知bug  恢复正常使用
5-21     	更新通知,优化代码
6-10		更新模板,修改部分逻辑!
9-12        修复抽奖，增加签到宝箱开启
9-21        增加用户信息输出
9-22		修复开宝箱错误
9-28		修复删除帖子错误
9-29		增加了快递信息查询,不用来回看了
10-10		感谢 banxiaya 大佬修复
12.14       查询增加手机号
23/1/3      更换模版

-------------------  青龙-配置文件-复制区域  -------------------
# 广汽传祺
export gqcq=" token @ token "  

抓 gsp.gacmotor.com 的 token

多账号用 换行 或 @ 分割  
tg频道: https://t.me/yml2213_tg  
*/
const $ = Env('广汽传祺')
const { MD5 } = require('crypto-js')
const notify = require('./sendNotify')

const envSplitor = ['\n', '&', '@']     //支持多种分割，但要保证变量里不存在这个字符
const ckNames = ['gqcq']                //支持多变量
const appVersion = '4.3.8'
//====================================================================================================
let DEFAULT_RETRY = 2           // 默认重试次数
//====================================================================================================


async function userTasks() {

    $.log('用户信息', { sp: true, console: false })  // 带分割的打印
    list = []
    for (let user of $.userList) {
        list.push(user.userInfo())
    } await Promise.all(list)

    $.log('任务列表', { sp: true, console: false })
    list = []
    // console.log(user.ckFlog)
    for (let user of $.userList) {
        if (user.ckFlog) {
            list.push(user.taskList())
            list.push(user.boxList())
        }
    } await Promise.all(list)

    $.log('积分查询', { sp: true, console: false })
    list = []
    for (let user of $.userList) {
        if (user.ckFlog) {
            list.push(user.points())
        }
    } await Promise.all(list)


}



class UserClass {
    constructor(ck) {
        this.idx = `账号[${++$.userIdx}]`
        this.ckFlog = true
        this.token = ck
        this.ts = $.ts(13)
        this.reqNonc = $.randomInt(100000, 999999)

        this.cq_headers = {
            'token': this.token,
            'reqTs': this.ts,
            'reqSign': this.getSign(this.ts, this.reqNonc),
            'reqNonc': this.reqNonc,
            'channel': 'unknown',
            'platformNo': 'Android',
            'osVersion': '10',
            'version': appVersion,
            'imei': 'a4dad7a1b1f865bc',
            'imsi': 'unknown',
            'deviceModel': 'MI 8',
            'deviceType': 'Android',
            'registrationID': '100d855909bb3584777',
            'verification': 'signature',
            'Host': 'gsp.gacmotor.com',
            'User-Agent': 'okhttp/3.10.0',
        }
        this.cq_headers2 = {
            "token": this.token,
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



    async userInfo() {
        let options = {
            fn: 'userInfo',
            method: 'get',
            url: 'https://gsp.gacmotor.com/gateway/webapi/account/getUserInfoV2',
            headers: this.cq_headers,
        }
        // console.log(options)
        let resp = await $.request(options)
        // console.log(resp)
        if (resp.errorCode == 200) {
            $.log(`${this.idx}: 欢迎用户: ${resp.data.nickname}, 手机号：${$.phoneNum(resp.data.mobile)}`)
            this.nickname = resp.data.nickname
            this.ckFlog = true
        } else if (resp.errorCode == 40100) {
            $.log(`${this.idx}: ${resp.errorMessage}`, { notify: true })
            this.ckFlog = false
        } else console.log(`${options.fn}: 失败, ${resp}`), this.ckFlog = false

    }

    async taskList() {
        let options = {
            fn: 'taskList',
            method: 'post',
            url: 'https://gsp.gacmotor.com/gw/app/community/api/mission/getlistv1?place=1',
            headers: this.cq_headers,
            json: 'https://gsp.gacmotor.com/gw/app/community/api/mission/getlistv1?place=1'

        }
        // console.log(options)
        let resp = await $.request(options)
        // console.log(resp)
        if (resp.errorCode == 20000) {
            let tasks = resp.data
            for (let index = 0; index < tasks.length; index++) {
                const element = tasks[index]

                let itemType = element.itemType
                switch (itemType) {
                    case 0:
                        if (element.finishedNum == 0) {
                            $.log(`${this.idx}: ${this.nickname}, 未签到，去执行签到 ,顺便抽个奖`)
                            await this.signIn()
                            await this.doLottery()
                        } else if (element.finishedNum == 1) {
                            $.log(`${this.idx}: ${this.nickname}, 今天已经签到过了鸭，明天再来吧！`)
                        }
                        break

                    case 1:
                        if (element.finishedNum < element.total) {
                            let num = element.total - element.finishedNum
                            for (let index = 0; index < num; index++) {
                                await this.postTopic()
                            }
                        } else if (element.finishedNum == 2) {
                            $.log(`${this.idx}: ${this.nickname}, 今天已经发帖了，明天再来吧!`)
                        }
                        break

                    case 3:
                        if (element.finishedNum < element.total) {
                            let num = element.total - element.finishedNum
                            for (let index = 0; index < num; index++) {
                                await this.share()
                            }
                        } else if (element.finishedNum == 2) {
                            $.log(`${this.idx}: ${this.nickname}, 今天已经分享过了鸭，明天再来吧!`)
                        }
                        break


                    default:
                        break
                }
            }

        } else console.log(`${options.fn}: 失败, ${resp}`)

    }

    // 签到
    async signIn() {
        let options = {
            fn: 'signIn',
            method: 'get',
            url: 'https://gsp.gacmotor.com/gateway/app-api/sign/submit',
            headers: this.cq_headers,
        }
        // console.log(options)
        let resp = await $.request(options)
        // console.log(resp)
        if (resp.errorCode == 200) {
            $.log(`${this.idx}: ${this.nickname}, ${resp.errorMessage} ,你已经连续签到 ${resp.data.dayCount} 天 ,签到获得G豆 ${resp.data.operationValue} 个`)
        } else if (resp.errorCode == 200015) {
            $.log(`${this.idx}: ${this.nickname}, ${resp.errorMessage}`)
        } else console.log(`${options.fn}: 失败, ${resp}`)
    }

    // 积分查询
    async points() {
        let options = {
            fn: 'points',
            method: 'get',
            url: 'https://gsp.gacmotor.com/gateway/app-api/my/statsV3',
            headers: this.cq_headers,
        }
        // console.log(options)
        let resp = await $.request(options)
        // console.log(resp)
        if (resp.errorCode == 200) {
            $.log(`${this.idx}: ${this.nickname}, 积分查询:您当前有 ${resp.data.pointCount} 积分`, { notify: true })
        } else console.log(`${options.fn}: 失败, ${resp}`)
    }


    // 签到宝箱列表
    async boxList() {
        let options = {
            fn: 'boxList',
            method: 'post',
            url: 'https://gsp.gacmotor.com/gw/app/activity/api/winrecord/unopenlist',
            headers: this.cq_headers2,
            form: { 'activityCode': 'SIGN-BOX' }
        }
        // console.log(options)
        let resp = await $.request(options)
        // console.log(resp)
        if (resp.errorCode == 20000) {
            this.box = resp.data
            $.log(`${this.idx}: ${this.nickname}, 共有宝箱:${this.box.length}个!`)

            if (this.box.length > 0) {
                for (let i = 0; i < this.box.length; i++) {
                    this.boxid = this.box[i].recordId
                    await this.openBox()
                    await $.wait(2)
                }
            }
        } else console.log(`${options.fn}: 失败, ${resp}`)
    }


    async openBox() {
        let options = {
            fn: 'openBox',
            method: 'post',
            url: 'https://gsp.gacmotor.com/gw/app/activity/api/medal/openbox',
            headers: this.cq_headers2,
            form: {
                'activityCode': 'OPEN-BOX',
                'recordId': this.boxid,
            }
        }
        // console.log(options)
        let resp = await $.request(options)
        // console.(resp)
        if (resp.errorCode == 20000) {
            $.log(`${this.idx}: ${this.nickname}, 开宝箱:${resp.errorMessage} ,恭喜你获得 ${resp.data.medalName} 奖品为 ${resp.data.medalDescription}`)
        } else console.log(`${options.fn}: 失败, ${resp}`)

    }

    async doLottery() {
        let options = {
            fn: 'doLottery',
            method: 'post',
            url: 'https://gsp.gacmotor.com/gw/app/activity/shopDraw/luckyDraw',
            headers: this.cq_headers2,
            form: {
                'activityCode': 'shop-draw'
            }
        }
        // console.log(options)
        let resp = await $.request(options)
        // console.(resp)
        if (resp.errorCode == 20000) {
            $.log(`${this.idx}: ${this.nickname}, 抽奖:${resp.errorMessage} ,恭喜你获得 ${resp.data.medalName} 奖品为 ${resp.data.medalDescription}`)
        } else console.log(`${options.fn}: 失败, ${resp}`)

    }

    // 发布帖子
    async postTopic() {
        let options = {
            fn: 'postTopic',
            method: 'post',
            url: 'https://gsp.gacmotor.com/gw/app/community/api/topic/appsavepost',
            headers: this.cq_headers,
            form: {
                'postId': '',
                'postType': '2',
                'channelInfoId': '116',
                'columnId': '',
                'postContent': `[{"text":"${this.getText()}"}]`,
                'coverImg': 'https://pic-gsp.gacmotor.com/app/712e2529-7b85-4d70-8c71-22b994b445b5.jpg',
                'publishedTime': '',
                'contentWords': `${this.getText()}`,
                'contentImgNums': '1',
                'lng': '',
                'lat': '',
                'address': '',
                'cityId': ''
            }
        }
        // console.log(options)
        let resp = await $.request(options)
        // console.(resp)
        if (resp.errorCode == 20000) {
            $.log(`${this.idx}: ${this.nickname},发布帖子:${resp.errorMessage} ,帖子ID: ${resp.data.postId}`)
            this.topic_id = resp.data.postId
            await $.wait(10)
            await this.addComment()
        } else console.log(`${options.fn}: 失败, ${resp}`)

    }

    // 评论帖子
    async addComment() {
        let options = {
            fn: 'addComment',
            method: 'post',
            url: 'https://gsp.gacmotor.com/gw/app/community/api/comment/add',
            headers: this.cq_headers,
            form: {
                'commentType': '0',
                'postId': `${this.topic_id}`,
                'commentContent': `${this.getCommentText()}`,
                'commentId': '0',
                'commentatorId': 'NDc3ODY1MA==',
                'isReplyComment': '1'
            }
        }
        // console.log(options)
        let resp = await $.request(options)
        // console.(resp)
        if (resp.errorCode == 20000) {
            $.log(`${this.idx}: ${this.nickname}, 评论帖子: 评论 ${this.topic_id} 帖子 ${resp.errorMessage}`)
            await $.wait(2)
            await this.deleteTopic('删除帖子')
        } else console.log(`${options.fn}: 失败, ${resp}`)

    }

    // 删除帖子
    async deleteTopic() {
        let options = {
            fn: 'deleteTopic',
            method: 'post',
            url: `https://gsp.gacmotor.com/gw/app/community/api/post/delete?postId=${this.topic_id}`,
            headers: this.cq_headers,
            form: {
                'postId': `${this.topic_id}`,
            }
        }
        // console.log(options)
        let resp = await $.request(options)
        // console.(resp)
        if (resp.errorCode == 20000) {
            $.log(`${this.idx}: ${this.nickname},  删除帖子: 帖子ID: ${this.topic_id} , 执行删除 ${resp.errorMessage}`)
            await $.wait(2)
        } else console.log(`${options.fn}: 失败, ${resp}`)

    }

    // 分享文章
    async share() {
        this.postId = ''
        await this.ArticleList()
        let options = {
            fn: 'deleteTopic',
            method: 'post',
            url: `https://gsp.gacmotor.com/gw/app/community/api/post/forward`,
            headers: this.cq_headers,
            form: {
                'postId': this.postId,
                'userId': ''
            }
        }
        // console.log(options)
        let resp = await $.request(options)
        // console.(resp)
        if (resp.errorCode == 20000) {
            $.log(`${this.idx}: ${this.nickname}, 分享文章:${resp.errorMessage}`)
            await $.wait(2)
        } else console.log(`${options.fn}: 失败, ${resp}`)

    }

    // 文章列表
    async ArticleList() {
        let options = {
            fn: 'ArticleList',
            method: 'get',
            url: `https://gsp.gacmotor.com/gw/app/community/api/post/channelPostList?current=1&size=20&channelId=&sortType=1`,
            headers: this.cq_headers,

        }
        // console.log(options)
        let resp = await $.request(options)
        // console.(resp)
        if (resp.errorCode == 20000) {
            let num = $.randomInt(1, 19)

            $.log(`${this.idx}: ${this.nickname},  分享的文章: ${resp.data.records[num].topicNames}  文章ID:${resp.data.records[num].postId}`)
            this.postId = resp.data.records[num].postId

        } else console.log(`${options.fn}: 失败, ${resp}`)

    }

    getSign(ts, reqNonc) {
        let salt = '17aaf8118ffb270b766c6d6774317a13' + appVersion
        let sign = MD5(`signature${reqNonc}${ts}${salt}`).toString()
        return sign
    }

    getText() {
        let textarr = ['最简单的提高观赏性的办法就是把地球故事的部分剪辑掉半小时， emo的部分剪辑掉半小时。这样剩下的90分钟我们就看看外星人，看看月球，看看灾难片大场面就不错。', '顶着叛国罪的风险无比坚信前妻，这种还会离婚？', '你以为它是灾难片，其实它是科幻片；你以为它是科幻片，其实它是恐怖片；你以为它是恐怖片，其实它是科教片', '我的天，剧情真的好阴谋论，但是还算是能自圆其说', '大杂烩啊……我能理解这电影为什么在海外卖的不好了，因为核心创意真的已经太老套了', '一开始我以为这就是外国人看《流浪地球》时的感受啊，后来发现这不是我当初看《胜利号》的感受么']
        let ranNum = $.randomInt(1, textarr.length)
        let text = textarr[ranNum]
        return text
    }
    getCommentText() {
        let add_comment_text_arr = ['感谢推荐的电影呢', '有时间一定看看这个电影怎么样', '晚上就去看', '66666666666', '这部电影我看过，非常好看']
        let ranNum = $.randomInt(1, add_comment_text_arr.length)
        let text = add_comment_text_arr[ranNum]
        return text
    }


}


!(async () => {
    console.log(await $.yiyan())
    $.read_env(UserClass)

    await userTasks()

})()
    .catch((e) => $.log(e))
    .finally(() => $.exitNow())



//===============================================================     
function Env(name) {
    return new class {
        constructor(name) {
            this.name = name
            this.startTime = Date.now()
            this.log(`[${this.name}]开始运行`, { time: true })

            this.notifyStr = []
            this.notifyFlag = true

            this.userIdx = 0
            this.userList = []
            this.userCount = 0
        }
        async request(opt) {
            const got = require('got')
            let DEFAULT_TIMEOUT = 8000      // 默认超时时间
            let resp = null, count = 0
            let fn = opt.fn || opt.url
            let resp_opt = opt.resp_opt || 'body'
            opt.timeout = opt.timeout || DEFAULT_TIMEOUT
            opt.retry = opt.retry || { limit: 0 }
            opt.method = opt?.method?.toUpperCase() || 'GET'
            while (count++ < DEFAULT_RETRY) {
                try {
                    resp = await got(opt)
                    break
                } catch (e) {
                    if (e.name == 'TimeoutError') {
                        this.log(`[${fn}]请求超时，重试第${count}次`)
                    } else {
                        this.log(`[${fn}]请求错误(${e.message})，重试第${count}次`)
                    }
                }
            }
            if (resp == null) return Promise.resolve({ statusCode: 'timeout', headers: null, body: null })
            let { statusCode, headers, body } = resp
            if (body) try { body = JSON.parse(body) } catch { }
            if (resp_opt == 'body') {
                return Promise.resolve(body)
            } else if (resp_opt == 'hd') {
                return Promise.resolve(headers)
            } else if (resp_opt == 'statusCode') {
                return Promise.resolve(statusCode)
            }

        }

        log(msg, options = {}) {
            let opt = { console: true }
            Object.assign(opt, options)

            if (opt.time) {
                let fmt = opt.fmt || 'hh:mm:ss'
                msg = `[${this.time(fmt)}]` + msg
            }
            if (opt.notify) {
                this.notifyStr.push(msg)
            }
            if (opt.console) {
                console.log(msg)
            }
            if (opt.sp) {
                console.log(`\n-------------- ${msg} --------------`)
            }
        }
        read_env(Class) {
            let envStrList = ckNames.map(x => process.env[x])
            for (let env_str of envStrList.filter(x => !!x)) {
                let sp = envSplitor.filter(x => env_str.includes(x))
                let splitor = sp.length > 0 ? sp[0] : envSplitor[0]
                for (let ck of env_str.split(splitor).filter(x => !!x)) {
                    this.userList.push(new Class(ck))
                }
            }
            this.userCount = this.userList.length
            if (!this.userCount) {
                this.log(`未找到变量，请检查变量${ckNames.map(x => '[' + x + ']').join('或')}`, { notify: true })
                return false
            }
            this.log(`共找到${this.userCount}个账号`)
            return true
        }
        async taskThread(taskName, conf, opt = {}) {
            while (conf.idx < $.userList.length) {
                let user = $.userList[conf.idx++]
                await user[taskName](opt)
            }
        }
        async threadManager(taskName, thread) {
            let taskAll = []
            let taskConf = { idx: 0 }
            while (thread--) {
                taskAll.push(this.taskThread(taskName, taskConf))
            }
            await Promise.all(taskAll)
        }
        time(t, x = null) {
            let xt = x ? new Date(x) : new Date
            let e = {
                "M+": xt.getMonth() + 1,
                "d+": xt.getDate(),
                "h+": xt.getHours(),
                "m+": xt.getMinutes(),
                "s+": xt.getSeconds(),
                "q+": Math.floor((xt.getMonth() + 3) / 3),
                S: this.padStr(xt.getMilliseconds(), 3)
            };
            /(y+)/.test(t) && (t = t.replace(RegExp.$1, (xt.getFullYear() + "").substr(4 - RegExp.$1.length)))
            for (let s in e)
                new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length)))
            return t
        }
        async showmsg() {
            if (!this.notifyFlag) return
            if (!this.notifyStr) return
            let notify = require('./sendNotify')
            this.log('\n============== 推送 ==============')
            await notify.sendNotify(this.name, this.notifyStr.join('\n'))
        }
        padStr(num, length, opt = {}) {
            let padding = opt.padding || '0'
            let mode = opt.mode || 'l'
            let numStr = String(num)
            let numPad = (length > numStr.length) ? (length - numStr.length) : 0
            let pads = ''
            for (let i = 0; i < numPad; i++) {
                pads += padding
            }
            if (mode == 'r') {
                numStr = numStr + pads
            } else {
                numStr = pads + numStr
            }
            return numStr
        }
        json2str(obj, c, encode = false) {
            let ret = []
            for (let keys of Object.keys(obj).sort()) {
                let v = obj[keys]
                if (v && encode) v = encodeURIComponent(v)
                ret.push(keys + '=' + v)
            }
            return ret.join(c)
        }
        str2json(str, decode = false) {
            let ret = {}
            for (let item of str.split('&')) {
                if (!item) continue
                let idx = item.indexOf('=')
                if (idx == -1) continue
                let k = item.substr(0, idx)
                let v = item.substr(idx + 1)
                if (decode) v = decodeURIComponent(v)
                ret[k] = v
            }
            return ret
        }
        phoneNum(phone_num) {
            if (phone_num.length == 11) {
                let data = phone_num.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
                return data
            } else {
                return phone_num
            }
        }
        randomInt(min, max) {
            return Math.round(Math.random() * (max - min) + min)
        }
        async yiyan() {
            const got = require('got')
            return new Promise((resolve) => {
                (async () => {
                    try {
                        const response = await got('https://v1.hitokoto.cn')
                        // console.log(response.body)
                        let data = JSON.parse(response.body)
                        let data_ = `[一言]: ${data.hitokoto}  by--${data.from}`
                        // console.log(data_)
                        resolve(data_)
                    } catch (error) {
                        console.log(error.response.body)
                    }
                })()
            })
        }
        ts(type = false, _data = "") {
            let myDate = new Date()
            let a = ""
            switch (type) {
                case 10:
                    a = Math.round(new Date().getTime() / 1000).toString()
                    break
                case 13:
                    a = Math.round(new Date().getTime()).toString()
                    break
                case "h":
                    a = myDate.getHours()
                    break
                case "m":
                    a = myDate.getMinutes()
                    break
                case "y":
                    a = myDate.getFullYear()
                    break
                case "h":
                    a = myDate.getHours()
                    break
                case "mo":
                    a = myDate.getMonth()
                    break
                case "d":
                    a = myDate.getDate()
                    break
                case "ts2Data":
                    if (_data != "") {
                        time = _data
                        if (time.toString().length == 13) {
                            let date = new Date(time + 8 * 3600 * 1000)
                            a = date.toJSON().substr(0, 19).replace("T", " ")
                        } else if (time.toString().length == 10) {
                            time = time * 1000
                            let date = new Date(time + 8 * 3600 * 1000)
                            a = date.toJSON().substr(0, 19).replace("T", " ")
                        }
                    }
                    break
                default:
                    a = "未知错误,请检查"
                    break
            }
            return a
        }
        randomPattern(pattern, charset = 'abcdef0123456789') {
            let str = ''
            for (let chars of pattern) {
                if (chars == 'x') {
                    str += charset.charAt(Math.floor(Math.random() * charset.length))
                } else if (chars == 'X') {
                    str += charset.charAt(Math.floor(Math.random() * charset.length)).toUpperCase()
                } else {
                    str += chars
                }
            }
            return str
        }
        randomString(len, charset = 'abcdef0123456789') {
            let str = ''
            for (let i = 0; i < len; i++) {
                str += charset.charAt(Math.floor(Math.random() * charset.length))
            }
            return str
        }
        randomList(a) {
            let idx = Math.floor(Math.random() * a.length)
            return a[idx]
        }
        wait(t) {
            return new Promise(e => setTimeout(e, t * 1000))
        }
        async exitNow() {
            await this.showmsg()
            let e = Date.now()
            let s = (e - this.startTime) / 1000
            this.log(`[${this.name}]运行结束，共运行了${s}秒`)
            process.exit(0)
        }
    }(name)
}
