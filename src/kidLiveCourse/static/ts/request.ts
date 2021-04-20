import { config } from "./config";

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
  // 公共参数
  let commonObj = {
    timeStamp: (new Date()).getTime()
  }

  let obj = { ...commonObj, ...data }
  let objStr = ''
  Object.keys(obj).forEach((key, index) => {
    objStr += `${key}=${obj[key]}`
    if (Object.keys(obj).length - 1 != index) {
      objStr += '&'
    }
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
