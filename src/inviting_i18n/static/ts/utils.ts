import { config } from './config';

// device id
export const getDeviceId = () => {
  let time = Math.round(new Date().getTime() / 1000).toString()
  for (var i = 0; i < 6; i++) {
    time += Math.floor(Math.random() * 10)
  }
  return (<any>window).md5(time)
}

// 随机字符串
export const randomString = (len: number) => {
  let rdmString = ''
  for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2)) {}
  return rdmString.substr(0, len)
}

// 请求api生成sign验证
export const generateSign = (_params: any) => {
  let str = ''
  const keys = Object.keys(_params).sort()
  keys.forEach((key) => {
    var val = _params[key]
    str += key + val
  })
  return (<any>window).md5(config.appSecret + str).toUpperCase();
}

// 打乱数组顺序
export const shuffle = (data: any[]) => {
  let arr = [...data]
  return arr.sort(() => {
    return 0.5 - Math.random()
  })
}

// 获取 0 ~ num(不包含num) 随机数
export const getRandomNum = (num: number) => {
  return Math.floor(Math.random() * num)
}

// 解析页面路径参数
export const getUrlParam = (name: string) => {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]);
  return null;
}