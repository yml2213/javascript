import { assertType } from '@xhmm/utils';
import * as IORedis from 'ioredis';
import * as debugMod from 'debug';
import { Message } from './CQHelper';
import { RequestIdentity } from './Command';

type SessionKey = string;

export type HistoryMessage = Record<string, Array<Message[]>>; // string是session name

export interface SessionData extends RequestIdentity {
  className: string; // 本次会话的session所属类
  sessionName: string; // 本次会话需要被执行的session函数
  historyMessage: HistoryMessage;
}

export class Session {
  private static readonly debug = debugMod(`lemon-bot[Session]`);
  private readonly redis: IORedis.Redis;
  constructor(port?: number, host?: string, options?: IORedis.RedisOptions);
  constructor(host?: string, options?: IORedis.RedisOptions);
  constructor(options?: IORedis.RedisOptions);
  constructor(...options: any) {
    this.redis = new IORedis(options);
  }

  private static genSessionKey(params: RequestIdentity): SessionKey {
    const clone: RequestIdentity = JSON.parse(JSON.stringify(params));
    if (typeof clone.fromUser === 'object') {
      if (clone.fromUser.flag) delete clone.fromUser.flag;
    }
    const key = Object.values(clone).join('-');
    return key;
  }

  async getSession(params: RequestIdentity): Promise<SessionData | null> {
    const key = Session.genSessionKey(params)
    const data = await this.redis.hgetall(key);
    if (Object.keys(data).length !== 0) {
      Object.keys(data).map(key => {
        try {
          data[key] = JSON.parse(data[key] + '');
        } catch (e) {
          //
        }
      });
      Session.debug(`获取到key为${key}的session记录`);
      // @ts-ignore
      return data;
    }
    return null;
  }

  async setSession(
    params: RequestIdentity,
    data: Omit<SessionData, 'sessionName' | keyof RequestIdentity>,
    sessionName: SessionData['sessionName'],
    expireSeconds = 300
  ): Promise<void> {
    const key = Session.genSessionKey(params);
    sessionName = sessionName.toString();
    assertType(sessionName, 'string');

    if (!sessionName.startsWith('session')) sessionName = 'session' + sessionName;

    const storedData: SessionData = {
      ...params,
      className: data.className,
      historyMessage: data.historyMessage,
      sessionName,
    };

    await this.redis.hmset(
      key,
      ...Object.entries(storedData).map(([key, val]) => [key, typeof val === 'undefined' ? '' : JSON.stringify(val)])
    );
    await this.redis.expire(key, expireSeconds);
    Session.debug(`Key is ${key}:  函数名为${sessionName}的session函数已建立，时长${expireSeconds}秒`);
  }

  async updateSession<T extends keyof SessionData>(
    params: RequestIdentity,
    hashKey: T,
    val: SessionData[T]
  ): Promise<void> {
    const key = Session.genSessionKey(params);
    await this.redis.hset(key, hashKey, JSON.stringify(val));
    Session.debug(`Key is ${key}:  该session的${hashKey}字段已被更新`);
  }

  async removeSession(params: RequestIdentity): Promise<void> {
    const key = Session.genSessionKey(params);
    await this.redis.del(key);
    Session.debug(`Key is ${key}:  该session会话已被清除`);
  }
}
