import { config } from "./config";
import { randomString, getDeviceId, generateSign } from "./utils";

// 封装jsonp
function getJSONP(url) {
  return new Promise((resolve, reject) => {
    var cbname = "_jsonp" + Math.random().toString(36).substr(2); 
    if (url.indexOf("?") === -1) {
      url += "?callback=" + cbname;
    } else {
      url += "&callback=" + cbname;
    }
    var script = document.createElement("script");
    // 为每个请求创建了一个全新的回调函数，作为window对象的一个属性储存。
    window[cbname] = (response) => {
      try {
        if (response.success) {
          resolve(response.data || response);
        } else {
          reject(response.code)
        }
      } finally {
        // 清理工作：删除回调函数
        delete window[cbname];// 移除script元素
        script.parentNode.removeChild(script);
      }
    };
    script.src = url;
    document.body.appendChild(script);
  })
}

export const request = (params) => {
  if (!params) console.log('params is null');
  let data = params.data
  let deviceId = data.deviceId;
  if (!deviceId) {
    deviceId = getDeviceId();
  }
  // 公共参数
  let commonObj = {
    appKey: 'talkmateVersion',
    HTTP_API_VERSION: '4.1',
    reqId: randomString(16),
    timeStamp: (new Date()).getTime(),
    device_id: deviceId
  }

  let userObj = {
    device_id: config.deviceId,
    user_id: config.userId,
    verify: config.verify
  }

  let sign = ''
  let obj
  if (userObj.device_id && userObj.user_id && userObj.verify) {
    obj = { ...commonObj, ...userObj, ...data }
    sign = generateSign(obj)
  } else {
    obj = { ...commonObj, ...data }
    sign = generateSign(obj)
  }
  obj = { ...obj, sign: sign }
  let objStr = ''
  Object.keys(obj).forEach(key => {
    objStr += `${key}=${obj[key]}&`
  })
  console.log(objStr);
  // 请求类型
  let type = params.type
  // 请求的接口
  console.log(params.url)
  let url = ''
  if (params.url.indexOf('?') > -1) {
    url = config.apiDomain + params.url + objStr;
  } else {
    url = `${config.apiDomain}${params.url}?${objStr}`;
  }
  console.log(url)
  
  if (type === 'jsonp') {
    return getJSONP(url)
  }
}
