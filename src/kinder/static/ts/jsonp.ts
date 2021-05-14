import { config } from "./config";

// 封装jsonp
export const getJSONP = (url) => {
  if (url && url.indexOf('http') === -1) {
    url = config.apiDomain + url
  }
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
          resolve(response);
        } else {
          reject(response.code[0])
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
