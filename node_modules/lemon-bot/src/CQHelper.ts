import { MessageFromType } from './Command';

type MessageBase<T extends string, D> = {
  type: T;
  data: D;
};

type TextMessage = MessageBase<'text', { text: string }>;
type AtMessage = MessageBase<'at', { qq: string }>; // at，若是手动复制的@xx是属于文本消息
type EmojiMessage = MessageBase<'emoji', { id: string }>;
type SmallFaceMessage = MessageBase<'sface', { id: string }>; // 小表情
type FaceMessage = MessageBase<'face', { id: string }>; // 小表情

type ImageMessage = MessageBase<'image', { file: string; url: string }>; // 图片
type RecordMessage = MessageBase<'record', { file: string }>; // 语音
type BigFaceMessage = MessageBase<'bface', { id: string; p: string }>; // 大表情
type RichMessage = MessageBase<'rich', { content: string }>; // 分享、王者组队等
type DiceMessage = MessageBase<'dice', { type: string }>; // 投骰子
type RPSMessage = MessageBase<'rps', { type: string }>; // 剪刀石头布
// 发送mp4 mp3及其他文件内容 是undefined，应该是需要pro版本
// 拍照界面的短视频 是text: '[视频]你的QQ暂不支持查看视频短片，请升级到最新版本后查看。'
// 红包 是text: '[QQ红包]请使用新版手机QQ查收红包。'

export type Message =
  | TextMessage
  | AtMessage
  | RichMessage
  | FaceMessage
  | EmojiMessage
  | ImageMessage
  | RecordMessage
  | BigFaceMessage
  | SmallFaceMessage
  | DiceMessage
  | RPSMessage;

export class CQMessageHelper {
  // 由于配置文件的post_message_format (https://cqhttp.cc/docs/4.11/#/Configuration?id=%E9%85%8D%E7%BD%AE%E9%A1%B9) 可能为两种形式，所以需要做兼容处理，统一转换为数组类型
  static normalizeMessage(message: Message[] | string): Message[] {
    if (typeof message === 'string') {
      // TODO: 当配置是string时直接抛出，后续看情况考虑是否提供自定义解析(源码参考位置 src/cqsdk/message.cpp)
      throw new Error('请设置HTTP插件的配置文件的post_message_format为array');
    } else return message;
  }

  static removeAt(message: Message[]): Message[] {
    return message.filter(msg => msg.type !== 'at');
  }
  static isAt(robotQQ: number, messages: Message[]): boolean {
    return messages.some(msg => msg.type === 'at' && +msg.data.qq === robotQQ);
  }

  // 数组形式转为字符串形式
  static toRawMessage(messages: Message[], removeAt = false): string {
    const textTypes = ['text', 'emoji', 'sface', 'face'];
    if (!removeAt) textTypes.push('at');
    const text = messages
      .filter(msg => textTypes.includes(msg.type))
      .map(msg => {
        if (msg.type === 'text') return CQMessageHelper.escapeTextMessage(msg).data.text;
        if (msg.type === 'at') return `[CQ:at,qq=${msg.data.qq}]`;
        if (msg.type === 'emoji') return `[CQ:emoji,id=${msg.data.id}]`;
        if (msg.type === 'sface') return `[CQ:bface,id=${msg.data.id}]`;
        if (msg.type === 'face') return `[CQ:face,id=${msg.data.id}]`;
      })
      .join('')
      .trim();
    return text;
  }

  // 当用户发送的文本信息是比如 [CQ:emoji,id=128562]，若不转义则会被当做emoji表情而不是一个普通文本
  static escapeTextMessage(message: TextMessage): TextMessage {
    const map = {
      '&': '&amp;',
      '[': '&#91;',
      ']': '&#93;',
    };
    const escapedText = message.data.text
      .split('')
      .map(char => {
        if (char in map) return map[char];
        return char;
      })
      .join('');
    return {
      type: 'text',
      data: {
        text: escapedText,
      },
    };
  }
}

export class CQRawMessageHelper {
  static removeAt(str: string): string {
    const reg = /\[CQ:at,qq=\d+]/;
    return str.replace(reg, '').trim();
  }

  static isFileMessage(
    str: string
  ): {
    result: boolean;
    file?: string;
    path?: string;
  } {
    const reg = /\[CQ:image,file=(.+),url=(.+)]/;
    const res = reg.exec(str);
    if (res === null)
      return {
        result: false,
      };
    return {
      result: true,
      file: res[1],
      path: res[2],
    };
  }

  // https://d.cqp.me/Pro/CQ%E7%A0%81
  static parseCQ(
    cqStr
  ): {
    func: string;
    params: Record<string, any>;
  } | null {
    try {
      const sIndex = cqStr.indexOf(':');
      const eIndex = cqStr.indexOf(',');
      const func = cqStr.slice(sIndex + 1, eIndex);

      const contentStr = cqStr.slice(eIndex + 1, -1);
      const params = {};
      contentStr.split(',').map(item => {
        // eslint-disable-next-line prefer-const
        let [k, v] = item.split('=');
        v = v
          .replace(/&amp;/g, '&')
          .replace(/&#91;/g, '[')
          .replace(/&#93;/g, ']')
          .replace(/&#44;/g, ',');
        try {
          v = JSON.parse(v);
        } catch (e) {
          //
        }
        params[k] = v;
      });
      return {
        func,
        params,
      };
    } catch (e) {
      return null;
    }
  }
}

export class CQMessageFromTypeHelper {
  static getMessageFromType({ message_type, sub_type }): MessageFromType {
    if (message_type === 'group' && sub_type === 'normal') return MessageFromType.qqGroupNormal;
    if (message_type === 'group' && sub_type === 'anonymous') return MessageFromType.qqGroupAnonymous;
    if (message_type === 'private' && sub_type === 'friend') return MessageFromType.userFriend;
    if (message_type === 'private' && sub_type === 'group') return MessageFromType.userGroup;
    if (message_type === 'private' && sub_type === 'other') return MessageFromType.userOther;
    // TODO: 文档没写讨论组的匿名信息，需要自测下！
    return MessageFromType.unknown;
  }

  // 是 用户消息
  static isUserMessage(messageFromType: MessageFromType): boolean {
    return (
      messageFromType === MessageFromType.userFriend ||
      messageFromType === MessageFromType.userGroup ||
      messageFromType === MessageFromType.userOther
    );
  }

  // 是 Q群消息
  static isQQGroupMessage(messageFromType: MessageFromType): boolean {
    return (
      CQMessageFromTypeHelper.isQQGroupNormalMessage(messageFromType) ||
      CQMessageFromTypeHelper.isQQGroupAnonymousMessage(messageFromType)
    );
  }
  // 是 Q群普通消息
  static isQQGroupNormalMessage(messageFromType: MessageFromType): boolean {
    return messageFromType === MessageFromType.qqGroupNormal;
  }
  // 是 Q群匿名消息
  static isQQGroupAnonymousMessage(messageFromType: MessageFromType): boolean {
    return messageFromType === MessageFromType.qqGroupAnonymous;
  }
}
