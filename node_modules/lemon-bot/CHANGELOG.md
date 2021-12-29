# Change Log

## 0.6.0 (2019年12月23日)
### Breaking changes:
- removed need to manually pass redis client when using `Session`, checkout `README` to view updated doc. 
### Enhancements:
- removed `signale`, now use `debug` for logging, checkout `README` about how to open/close debug mode. 


## 0.5.1 (2019年11月18日)
### Enhancements:
- 添加了已登录酷Q机器人和create传入的机器人不一致时的检测
 
## 0.5.0 (2019年11月9日)
### Fix bugs:
- `HttpPlguin`未设置`method`为`POST`导致api调用报错 

## 0.4.4 (2019年10月23日)
### Breaking changes:
- `HttpPlugin`类的`sendMsg`接口参数名修改，移除了`Number`冗余单词
- `HttpPluginError`类的实例属性`apiName`改为`APIName`
- `AnonymousUser`重新加回了`flag`属性以便其他api调用时使用

## 0.4.3 (2019年10月22日)
### Fix bugs:
- dependency @xhmm/util bug fix

## 0.4.1 (2019年10月20日)
### Features:
- 现支持所有消息类型的处理(不同情况下的私聊、群内匿名和非匿名)。并提供了完整的type guard来帮助ts代码的正确类型提示(文档暂未提供使用示例)
### Breaking changes:
- `historyMessage`字段的key值不再省略'session'单词，value值现是一个二维数组，里面保存了当前session函数接收的所有消息


## 0.4.0 (2019年10月20日)
### Breaking changes:
- `parse`函数的返回值不再是赋给`this.data`，而是需要在`user`/`group`/`both`函数参数中使用`data`属性来获取。  
   迁移方式：若是使用`typescript`，则使用`tsc`编译会触发`Property data doesn't exist ...`，然后进行相关文件的改写。若是使用`javascript`，则使用`ctrl+f`搜索含有`this.data`语句的文件，然后进行改写。
### Fix bugs:
- async session函数未被await

## 0.3.1 (2019年10月20日)
### Fix bugs:
- 使用指令数组判断含艾特的消息时空格信息导致不成功

## 0.3.0 (2019年10月19日)
### Fix bugs:
- 修复了使用多机器人时仅首次被创建的机器人会生效

## 0.2.0 (2019年10月19日)
### Features:
- 新增了`both`函数
- 新增了`Logger`类用于日志输出控制
- 新增了`scope`修饰器
- 解析函数和处理函数的参数属性新增了`requestBody`

### Breaking changes:
- 群组命令的触发模式默认从`TriggerType.at`改为了`TriggerType.both`
- 解析函数和处理函数的参数属性的`messages`更名为了`message`
- 解析函数和处理函数的参数属性的`stringMessages`更名为了`rawMessage`
- `include`和`exclude`修饰器不可同时

### Enhancements:
- 修饰器添加了warning语句以帮助正确使用
- 日志信息更为全面
- 当命令类使用`setNext`设置了不存在的session函数时，不再抛错而是重置会话并打印警告信息