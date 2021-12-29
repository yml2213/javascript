import { objectToQS } from './index';

describe('utils function test', () => {
  it('convert object containing primitive value to querystring', () => {
    const obj = {
      id: '1',
      number: 12,
      message: '你好'
    }
    expect(objectToQS(obj)).toBe('id=1&number=12&message=%E4%BD%A0%E5%A5%BD')
  });
  it('convert object containing no-primitive value to querystring', () => {
    const obj = { userNumber: 1326099664, groupNumber: undefined }
    expect(objectToQS(obj)).toBe('userNumber=1326099664')
  });
})