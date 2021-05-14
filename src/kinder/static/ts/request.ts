import { config } from "./config";
import { getJSONP } from "./jsonp";
import { randomString, getDeviceId, generateSign } from "./utils";

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
    device_id: '',
    user_id: '',
    verify: ''
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
  objStr = objStr.substring(0, objStr.length - 1)
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
