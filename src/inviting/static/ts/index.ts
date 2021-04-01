import { request } from './request';
import { setupWebViewJavascriptBridge } from './bridge';
import { config } from './config';

console.log(config);

class Activity {
  deviceId: string;
  userId: string;
  verify: string;
  price: number;
  endYear: number;
  endMonth: number;
  endDay: number;
  userInfo:object;
  eleTitleWrap; elePrice; eleDay; eleHour; eleMinute; eleSecond; eleIntroWrap; eleBtnInviting;
  eleTopbar: HTMLElement; eleBack: HTMLElement;
  constructor() {
    this.deviceId = config.deviceId ? config.deviceId : '3394eda119c4450fad3f569ca3fdc4fb'
    this.userId = config.userId ? config.userId : '5ed9a7d13f34183fb701a452'
    this.verify = config.verify ? config.verify :'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJUYWxrbWF0ZSIsImV4cCI6MTYyMzMxMTY4MiwianRpIjoiNWVkOWE3ZDEzZjM0MTgzZmI3MDFhNDUyIn0._Mra9WMQ0sRO7-9mVuSuna3dPjWFrB621rgP3o1ULfU'
    this.userInfo = {};
    this.price = config.price ? parseInt(config.price) : 198;
    this.endYear = 2021;
    this.endMonth = 3;
    this.endDay = 25;
    this.eleTitleWrap = document.querySelector('.title-wrap');
    this.elePrice = document.querySelector('.price');
    this.eleDay = document.querySelector('.day');
    this.eleHour = document.querySelector('.hour');
    this.eleMinute = document.querySelector('.minute');
    this.eleSecond = document.querySelector('.second');
    this.eleIntroWrap = document.querySelector('.intro-wrap');
    this.eleBtnInviting = document.querySelector('.btn-inviting');
    this.eleTopbar = document.querySelector('.top-bar');
    this.eleBack = document.querySelector('.back');
    console.log('constructor');
  }
  init() {
    this.getUserInfo();
    // 初始化事件
    this.initEvent();
    // 倒计时
    this.countDown();
    // 设置标题
    this.setTitle();
    // 设置卡片价格
    this.setCardPrice();
    // 设置活动说明
    this.setIntro();
  }

  // 初始化按钮点击事件
  initEvent() {
    // 页面滚动事件
    // document.addEventListener('scroll', (e) => {
    //   let top = e.target['scrollingElement']['scrollTop']
    //   if (0.01 * top > 0.9) {
    //     this.eleTopbar.classList.add('scroll');
    //   } else {
    //     this.eleTopbar.classList.remove('scroll');
    //   }
    //   this.eleTopbar.setAttribute('style', `background: rgba(255, 255, 255, ${0.01 * top > 1 ? 1 : 0.01 * top})`);
    //   console.log(e.target['scrollingElement']['scrollTop']);
    // });

    // 点击立即邀请事件
    this.eleBtnInviting.addEventListener('click', (e) => {
      this.share();
    });

    // 点击返回图标
    this.eleBack.addEventListener('click', (e) => {
      this.close();
    });
  }

  // 获取用户信息
  getUserInfo() {
    request({
      url: '/umv1/user/info',
      type: 'jsonp',
      data: {
        device_id: this.deviceId,
        user_id: this.userId,
        verify: this.verify
      }
    }).then(res => {
      if (res['success']) {
        this.userInfo = res['info'];
      }
    });
  }

  // 设置标题
  setTitle() {
    this.eleTitleWrap.innerHTML = `邀请好友，各得${this.price}元${this.cardType(this.price)}`;
  }

  // Plus Type
  cardType(price) {
    let ticketDesc = '';
    switch (price) {
      case 198:
        ticketDesc = '月卡';
        break;
      default:
        ticketDesc = '年卡';
        break;
    }
    return ticketDesc;
  }

  // 设置卡片价格
  setCardPrice() {
    let cls = 'p-198';
    switch (this.price) {
      case 198:
        cls = 'p-198'
        break;
      default:
        break;
    }
    this.elePrice.classList.add(cls);
  }

  // 设置活动说明
  setIntro() {
    const intro = `
      <div class="list">
        <div class="item">
          <i></i>
          <span>活动截止日期：${this.endYear}年${this.endMonth}月${this.endDay}日</span>
        </div>
        <div class="item">
          <i></i>
          <span>好友接受你的邀请注册全球说，你和好友各得${this.price}元会员PLUS${this.cardType(this.price)}。</span>
        </div>
        <div class="item">
          <i></i>
          <span>每个账户限领 1 次全球说${this.cardType(this.price)}会员PLUS</span>
        </div>
      </div>
    `
    this.eleIntroWrap.innerHTML = intro;
  }

  // 倒计时
  countDown() {
    let endTime = new Date(this.endYear, this.endMonth - 1, this.endDay + 1).getTime()
    let diff = endTime - (new Date()).getTime()
    if (diff > 0) {
      // 天数
      let days = Math.floor(diff / (24 * 3600 * 1000))
      // 小时
      let leave1 = diff % (24 * 3600 * 1000)
      let hours = Math.floor(leave1/(3600 * 1000));
      // 分钟
      let leave2 = leave1 % (3600 * 1000)
      let minutes = Math.floor(leave2/(60 * 1000));
      // 秒
      let leave3 = leave2 % (60 * 1000)
      let seconds = Math.floor(leave3/1000);
      this.eleDay.innerHTML = `${days}天`
      this.eleHour.innerHTML = hours > 9 ? hours : '0' + hours
      this.eleMinute.innerHTML = minutes > 9 ? minutes : '0' + minutes
      this.eleSecond.innerHTML = seconds > 9 ? seconds : '0' + seconds
      setTimeout(() => {
        this.countDown();
      }, 1000);
    } else {
      this.eleDay.innerHTML = `0天`
      this.eleHour.innerHTML = '00'
      this.eleMinute.innerHTML = '00'
      this.eleSecond.innerHTML = '00'
    }
  }

  // 立即邀请分享
  share() {
    console.log('share');
    const shareConfig = {
      title: `${this.userInfo['nickname']}邀你一起领取${this.price}元全球说会员PLUS`,
      digest: '邀请好友注册全球说，得会员大礼',
      thumbnail: config.talkmateLogo,
      url: `${config.shareUrl}?device_id=${this.deviceId}&user_id=${this.userId}&nickname=${encodeURIComponent(this.userInfo['nickname'])}&price=${this.price}&timestamp=${(new Date()).getTime()}`,
      isLogin: 1
    }
    if (config.isIPhone) {
      setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler('callbackShare', shareConfig);
        bridge.registerHandler('iosIsSharesuccess', function (userInfo, responseCallback) {
        })
      })
    }
    if (config.isAndroid) {
      (<any>window).androidObj.callbackShare(shareConfig.title, shareConfig.digest, shareConfig.thumbnail, shareConfig.url);
    }
  }

  // 关闭页面
  close() {
    console.log('close')
    if (config.isIPhone) {
      setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler('iosCanJumpOut', {canJumpOut:'YES'});
      })
    }
    if (config.isAndroid) {
      (<any>window).androidObj.finishActivity();
    }
  }
}

const activity = new Activity();
activity.init();
