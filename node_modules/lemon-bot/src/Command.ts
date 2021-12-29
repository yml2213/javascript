/* eslint-disable @typescript-eslint/unbound-method */
import { assertType, getType } from '@xhmm/utils';
import { Message, CQMessageFromTypeHelper } from './CQHelper';
import { HttpPlugin } from './HttpPlugin';
import { HistoryMessage } from './Session';
import { warn } from './logger';

type OrPromise<T> = T | Promise<T>;

// 命令生效范围
export enum Scope {
  user = 'user', // 仅在和机器人私聊时刻触发该命令
  group = 'group', // 仅在群组内发消息时刻触发该命令
  both = 'both', // 私聊和群内都可触发该命令
}

// 群组内时命令触发方式
export enum TriggerType {
  at = 'at', // at表示需要艾特机器人并输入内容方可触发
  noAt = 'noAt', //noAt表示需要直接输入内容不能艾特
  both = 'both', // both表示两种皆可
}

// 群组内什么身份可触发
export enum TriggerScope {
  'all' = 0b111, // 所有人
  'owner' = 0b100, // 群主
  'admin' = 0b010, // 管理员
  'member' = 0b01, // 普通群员
}

export enum MessageFromType {
  'userFriend' = 'userFriend',
  'userGroup' = 'userGroup',
  'userOther' = 'userOther',

  'qqGroupNormal' = 'qqGroupNormal',
  'qqGroupAnonymous' = 'qqGroupAnonymous',

  'unknown' = 'unknown',
}

// 每个上报请求都可用下述字段来唯一标识
export interface RequestIdentity {
  robot: number;
  messageFromType: MessageFromType;
  fromUser: number | AnonymousUser;
  fromGroup: number | undefined;
}

export interface AnonymousUser {
  id: number;
  name: string;
  flag: string; // 这个字段每次发消息都是会变的，会使session key每次不一致，故在genSessionKey中要判断处理
}
export interface UserMessageInfo extends RequestIdentity {
  messageFromType:
    | MessageFromType.userFriend
    | MessageFromType.userGroup
    | MessageFromType.userOther;
  fromUser: number;
  fromGroup: undefined;
}
export interface QQGroupNormalMessageInfo extends RequestIdentity {
  messageFromType: MessageFromType.qqGroupNormal;
  fromUser: number;
  fromGroup: number;
}
export interface QQGroupAnonymousMessageInfo extends RequestIdentity {
  messageFromType: MessageFromType.qqGroupAnonymous;
  fromUser: AnonymousUser;
  fromGroup: number;
}

interface BaseParams {
  message: Message[];
  rawMessage: string;
  requestBody: any;
}
type SetNextFn = (sessionFunctionName: string, expireSeconds?: number) => Promise<void>; // 设置session name和过期时间
type SetEndFn = () => Promise<void>; // 删除session

// parse函数
export interface ParseParams extends BaseParams, RequestIdentity {}
export type ParseReturn = any;

interface HandlerBaseParams extends BaseParams {
  setNext: SetNextFn;
}
// user函数
export interface UserHandlerParams<D = unknown> extends HandlerBaseParams, UserMessageInfo {
  data: D;
}
// group函数
interface GroupHandlerBaseParams<D = unknown> extends HandlerBaseParams {
  isAt: boolean;
  data: D;
}
export type GroupHandlerParams<D = unknown> = GroupHandlerBaseParams<D> &
  (QQGroupAnonymousMessageInfo | QQGroupNormalMessageInfo);
// both函数
export interface BothHandlerParams<D = unknown> extends HandlerBaseParams, RequestIdentity {
  data: D;
}
// session函数
export interface SessionHandlerParams extends HandlerBaseParams {
  setEnd: SetEndFn;
  historyMessage: HistoryMessage;
}
// return
export type HandlerReturn =
  | {
      atSender: boolean;
      content: string;
    }
  | string[]
  | string
  | void;
export type UserHandlerReturn = HandlerReturn;
export type GroupHandlerReturn = HandlerReturn;
export type BothHandlerReturn = HandlerReturn;
export type SessionHandlerReturn = HandlerReturn;

export abstract class Command<C = unknown, D = unknown> {
  static blackList = [
    'scope',
    'directives',
    'context',
    'httpPlugin',
    'includeGroup',
    'excludeGroup',
    'includeUser',
    'excludeUser',
    'triggerType',
    'triggerScope',
  ];
  // 下述属性是在node启动后被注入给了实例对象，之后不会再改变
  scope: Scope; // // [在该类构造函数内被注入] 使用该属性来判断该命令的作用域
  directives: string[]; // [在create阶段使用该类Command.normalizeDirectives函数被注入]
  context: C; // [在create阶段被注入] 值为create时传入的内容，默认为null
  httpPlugin: HttpPlugin; // [在create阶段被注入] 值为create时传入的内容

  includeGroup?: number[]; // 给group函数使用@include注入
  excludeGroup?: number[]; // 给group函数使用@exclude注入
  includeUser?: number[]; // 给user函数使用@include注入
  excludeUser?: number[]; // 给user函数使用@exclude注入
  triggerType?: TriggerType; // 给group/both使用@trigger进行设置，默认按at处理。请勿对其赋值，会导致修饰器无效！！！
  triggerScope?: TriggerScope;

  constructor() {
    if (this.directive) assertType(this.directive, 'function');
    if (this.parse) assertType(this.parse, 'function');
    if (!this.directive && !this.parse) throw new Error('请为Command的继承类提供directive函数或parse函数');
    const hasUserHandler = getType(this.user) === 'function';
    const hasGroupHandler = getType(this.group) === 'function';
    const hasBothHandler = getType(this.both) === 'function';

    if (hasBothHandler) this.scope = Scope.both;
    else if (hasGroupHandler && hasUserHandler) this.scope = Scope.both;
    else {
      if (!hasUserHandler && !hasGroupHandler) throw new Error('为Command的继承类提供user函数或group函数或both函数');
      if (hasGroupHandler) this.scope = Scope.group;
      if (hasUserHandler) this.scope = Scope.user;
    }
  }

  public static validate(cmd: Command): void {
    if (!cmd.constructor) throw new Error('请继承Command类并传入实例对象');
    if (Object.getPrototypeOf(cmd.constructor) !== Command) throw new Error('请继承Command类并传入实例对象');

    if (cmd.parse) assertType(cmd.parse, 'function');
    if (cmd.group) assertType(cmd.group, 'function');
    if (cmd.user) assertType(cmd.user, 'function');
    if (cmd.both) assertType(cmd.both, 'function');

    if (!cmd.both && !cmd.group && !cmd.user) throw new Error('请至少实现一个处理函数：both、group、user');

    const defaultDirective = cmd.constructor.name + 'Default';
    if (typeof cmd.directive === 'function') {
      const directives = cmd.directive();
      if (getType(directives) === 'array' || directives.length !== 0) {
        cmd.directives = directives;
        return;
      } else cmd.directives = [defaultDirective];
    } else cmd.directives = [defaultDirective];
  }

  directive?(): string[];
  parse?(params: ParseParams): OrPromise<ParseReturn>;

  user?(params: UserHandlerParams<D>): OrPromise<HandlerReturn>;
  group?(params: GroupHandlerParams<D>): OrPromise<HandlerReturn>;
  both?(params: BothHandlerParams<D>): OrPromise<HandlerReturn>;
}

// ------------------------------------------------------------------------
// -------------------------------- 修饰器 ---------------------------------
// ------------------------------------------------------------------------
// 用于user和group。指定该选项时，只有这里面的qq/qq群可触发该命令
// TODO: 后期改为可接受(异步)函数
export function include(include: number[]) {
  return function(proto, name, descriptor) {
    if (name === 'group') {
      if ('excludeGroup' in proto) throw new Error('exclude and include decorators cannot used at the same time');
      proto.includeGroup = include;
    } else if (name === 'user') {
      if ('excludeUser' in proto) throw new Error('exclude and include decorators cannot used at the same time');
      proto.includeUser = include;
    } else warn('include decorator only works with user or group function');
  };
}
// 用于user和group。指定该选项时，这里面的qq/qq群不可触发该命令。
export function exclude(exclude: number[]) {
  return function(proto, name, descriptor) {
    if (name === 'group') {
      if ('includeGroup' in proto) throw new Error('exclude and include decorators cannot used at the same time');
      proto.excludeGroup = exclude;
    } else if (name === 'user') {
      if ('includeUser' in proto) throw new Error('exclude and include decorators cannot used at the same time');
      proto.excludeUser = exclude;
    } else console.warn('exclude decorator only works with user or group function');
  };
}
// 用于group和both。设置群组内命令触发方式
export function trigger(type: TriggerType) {
  return function(proto, name, descriptor) {
    if (name !== 'group' && name !== 'both') {
      warn('trigger decorator only works with group or both function.');
    } else proto.triggerType = type;
  };
}
// 用于group和both。设置群组内什么身份可触发命令
export function scope(role: TriggerScope) {
  return function(proto, name, descriptor) {
    if (name !== 'group' && name !== 'both') {
      warn('trigger decorator only works with group or both function.');
    } else proto.triggerScope = role;
  };
}
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------

// ------------------------------------------------------------------------
// ------------------------------ type guard-------------------------------
// ------------------------------------------------------------------------
type HandlerParams = UserHandlerParams | GroupHandlerParams | BothHandlerParams;
// 用户消息
export function fromUserMessage(p: HandlerParams): p is UserHandlerParams {
  return CQMessageFromTypeHelper.isUserMessage(p.messageFromType);
}
// q群所有消息
export function fromQQGroupMessage(
  p: HandlerParams
): p is GroupHandlerBaseParams & (QQGroupNormalMessageInfo | QQGroupAnonymousMessageInfo) {
  return CQMessageFromTypeHelper.isQQGroupMessage(p.messageFromType);
}
// q群普通消息
export function fromQQGroupNormalMessage(p: HandlerParams): p is GroupHandlerBaseParams & QQGroupNormalMessageInfo {
  return CQMessageFromTypeHelper.isQQGroupNormalMessage(p.messageFromType);
}
// q群匿名消息
export function fromQQGroupAnonymousMessage(
  p: HandlerParams
): p is GroupHandlerBaseParams & QQGroupAnonymousMessageInfo {
  return CQMessageFromTypeHelper.isQQGroupAnonymousMessage(p.messageFromType);
}
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------
