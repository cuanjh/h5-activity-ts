import { config } from "./config";
import { getJSONP, request } from "./request";
class Activity {
  uuid:string
  constructor() {
    console.log('constructor');
    this.uuid = config.uuid ? config.uuid : 'eaf2bec6-1e09-47ea-936e-6bfb93917ab8'
  }
  async init() {
    // 1、地理位置信息
    // const res1 = await getJSONP('https://api.map.baidu.com/location/ip?v=2.0&ak=8oTo926ag3Q4L76hGg3QIYeFieYphvOC')
    // 2、请求服务端接口数据
    const res2 = await request({
      type: 'jsonp',
      url: 'editor/qr_code/details',
      data: {
        uuid: this.uuid,
        userAgent: navigator.userAgent,
        // addressContent: JSON.stringify(res1['content'])
        addressContent: ''
      }
    })
    // 3、判断跳转路径
    this.redirect(res2)
  }

  redirect(data) {
    const iosURL = 'https://itunes.apple.com/cn/app/id959231176?mt=8'
    const androidURL = 'https://sj.qq.com/myapp/detail.htm?apkName=com.kuyu'
    var info = data.info && JSON.parse(data.info)
    if (info && info.website) {
      window.location.href = info.website
    } else {
      if (config.isIPhone) {
        window.location.href = iosURL
      } else if (config.isAndroid) {
        window.location.href = androidURL
      } 
    }
  }
}

const activity = new Activity();
activity.init();
