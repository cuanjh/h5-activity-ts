import { config } from "./config"
import { getJSONP } from "./jsonp"
import { randomString } from "./utils"

const timestamp = (new Date()).getTime()
const noncestr = randomString(16)
const appId = 'wx32c126b96bed2cbc'
const domain = "https://content.talkmate.com"
const wx = (<any>window).wx

// 获取微信的access_token
export const getWXToken = (shareInfo) => {
  getJSONP(domain + '/live/wxtoken').then(token => {
    let obj = {
      noncestr: noncestr,
      jsapi_ticket: token,
      timestamp: timestamp,
      url: window.location.href
    }
    // console.log(params)
    const signature = generateSign(obj)
    
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: appId, // 必填，公众号的唯一标识
      timestamp: timestamp, // 必填，生成签名的时间戳
      nonceStr: noncestr, // 必填，生成签名的随机串
      signature: signature,// 必填，签名
      jsApiList: [
        'updateAppMessageShareData',
        'updateTimelineShareData',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'onMenuShareQZone'
      ] // 必填，需要使用的JS接口列表
    });

    wx.ready(() => {
      let params = {
        title: shareInfo.title,
        desc: shareInfo.desc,
        link: window.location.href,
        imgUrl: config.talkmateLogo,
        success: function() {},
        cancel: function() {}
      }

      wx.updateTimelineShareData(params);
      wx.updateAppMessageShareData(params);
      wx.onMenuShareTimeline(params)
      wx.onMenuShareAppMessage(params)
    })
  });
}

// 生成微信签名
function generateSign (_params) {
  var str = ''
  var keys = Object.keys(_params).sort()
  keys.forEach(function(key, index) {
    var val = _params[key]
    str += key + '=' + val
    if (keys.length - 1 != index) {
      str += '&'
    }
  })
  return (<any>window).md5(str)
}