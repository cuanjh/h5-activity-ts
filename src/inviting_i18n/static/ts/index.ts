import { setupWebViewJavascriptBridge } from './bridge';
import { config } from './config';
import { request } from './request';

console.log(config);
const errorCodes = {
  '1001': 'The data cannot be empty',
  '200001': "The user has been invited already"
};

class Activity {
  deviceId: string;
  userId: string;
  verify: string;
  price: number;
  endYear: number;
  endMonth: number;
  endDay: number;
  eleTitleWrap: HTMLElement; elePrice: HTMLElement; eleDay: HTMLElement; eleHour: HTMLElement; eleMinute: HTMLElement; eleSecond: HTMLElement;
  eleIntroWrap: HTMLElement; eleBtnInviting:HTMLElement; eleModal: HTMLElement; eleTips: HTMLElement; eleTip: HTMLElement; eleHtml: HTMLElement;
  eleForm: HTMLElement; eleEmail: HTMLElement; eleSend: HTMLElement; eleSendSuccessful:HTMLElement; eleSuccessfulDesc: HTMLElement;
  eleOk: HTMLElement; eleTopbar: HTMLElement; eleBack: HTMLElement;
  constructor() {
    this.deviceId = config.deviceId ? config.deviceId : '3394eda119c4450fad3f569ca3fdc4fb'
    this.userId = config.userId ? config.userId : '5ed9a7d13f34183fb701a452'
    this.price = config.price ? parseInt(config.price) : 199.99;
    this.endYear = 2021;
    this.endMonth = 3;
    this.endDay = 25;
    this.eleHtml = document.querySelector('html');
    this.eleTitleWrap = document.querySelector('.title-wrap');
    this.elePrice = document.querySelector('.price');
    this.eleDay = document.querySelector('.day');
    this.eleHour = document.querySelector('.hour');
    this.eleMinute = document.querySelector('.minute');
    this.eleSecond = document.querySelector('.second');
    this.eleIntroWrap = document.querySelector('.intro-wrap');
    this.eleBtnInviting = document.querySelector('.btn-inviting');
    this.eleForm = document.querySelector('.form');
    this.eleEmail = document.querySelector('.email');
    this.eleSend = document.querySelector('.send');
    this.eleTopbar = document.querySelector('.top-bar');
    this.eleSendSuccessful = document.querySelector('.send-successful');
    this.eleSuccessfulDesc = document.querySelector('.successful-desc');
    this.eleOk = document.querySelector('.ok');
    this.eleModal = document.querySelector('.modal');
    this.eleTips = document.querySelector('.tips');
    this.eleTip = document.querySelector('.tip');
    this.eleBack = document.querySelector('.back');
    console.log('constructor');
  }
  init() {
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

    this.eleModal.addEventListener('click', (e) => {
      if (!(e.target['classList'].contains('form') || e.target['classList'].contains('send-successful') || e.target['parentNode']['classList'].contains('form') || e.target['parentNode']['classList'].contains('send-successful'))) {
        this.hideModal();
      }
    })
    // 立即邀请
    this.eleBtnInviting.addEventListener('click', (e) => {
      this.showModal();
    });

    // 邮箱键盘输入事件
    this.eleEmail.addEventListener('keyup', (e) => {
      let reg = /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/
      if (reg.test(e.target['value'])) {
        this.eleSend.classList.add('complete');
      } else {
        this.eleSend.classList.remove('complete');
      }
    });

    // 发送邮箱事件
    this.eleSend.addEventListener('click', (e) => {
      if (this.eleSend.classList.contains('complete')) {
        this.sendEmail(this.eleEmail['value']);
      }
    });

    // 点击知道了关闭模态窗
    this.eleOk.addEventListener('click', (e) => {
      this.hideModal();
    });

    // 点击返回图标
    this.eleBack.addEventListener('click', (e) => {
      this.close();
    });
  }

  // 领取会员
  sendEmail(email) {
    request({
      url: '/acv1/invite/register',
      type: 'jsonp',
      data: {
        device_id: this.deviceId,
        user_id: this.userId,
        verify: this.verify,
        email: email,
        assort: '',
        activity_name: '邀请有礼'
      }
    }).then(res => {
      this.eleForm.classList.remove('show');
      setTimeout(() => {
        this.eleSuccessfulDesc.innerHTML = `Remind your friend to check email and download Talkmate App. Enter activation key, each of you will get $${this.price} ${this.cardType(this.price)} VIP plus card.`
        this.eleSendSuccessful.classList.add('show');
      }, 100);
    }).catch(errCode => {
      this.showTips(errorCodes[errCode]);
    });
  }

  // 设置标题
  setTitle() {
    this.eleTitleWrap.innerHTML = `Invite to get $${this.price} ${this.cardType(this.price)} VIP card each.`;
  }

  // Plus Type
  cardType(price) {
    let ticketDesc = '';
    switch (price) {
      case 199.99:
        ticketDesc = 'one-year';
        break;
      default:
        ticketDesc = '';
        break;
    }
    return ticketDesc;
  }

  // 设置卡片价格
  setCardPrice() {
    let cls = 'p-199';
    switch (this.price) {
      case 199.99:
        cls = 'p-199'
        break;
      default:
        break;
    }
    this.elePrice.classList.add(cls);
  }

  formateMonth(month) {
    let desc = ''
    switch (month) {
      case 1:
        desc = 'January'
        break;
      case 2:
        desc = 'February'
        break;
      case 3:
        desc = 'March'
        break;
      case 4:
        desc = 'April'
        break;
      case 5:
        desc = 'May'
        break;
      case 6:
        desc = 'June'
        break;
      case 7:
        desc = 'July'
        break;
      case 8:
        desc = 'August'
        break;
      case 9:
        desc = 'September'
        break;
      case 10:
        desc = 'October'
        break;
      case 11:
        desc = 'November'
        break;
      default:
        desc = 'December'
        break;
    }
    return desc;
  }

  // 设置活动说明
  setIntro() {
    const intro = `
      <div class="list">
        <div class="item">
          <i></i>
          <span>Closing date: ${this.formateMonth(this.endMonth)} ${this.endDay}th, ${this.endYear}.</span>
        </div>
        <div class="item">
          <i></i>
          <span>If your friend accept the invatation to register Talkmate, each of you will get $${this.price} ${this.cardType(this.price)} VIP plus card.</span>
        </div>
        <div class="item">
          <i></i>
          <span>The same acount is limited to get the ${this.cardType(this.price)} card once.</span>
        </div>
      </div>
    `
    this.eleIntroWrap.innerHTML = intro;
  }

  // 倒计时
  countDown() {
    let endTime = new Date(this.endYear, this.endMonth - 1, this.endDay + 1).getTime()
    let diff = endTime - (new Date()).getTime()
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
    this.eleDay.innerHTML = days > 1 ? `${days} days` : `${days} day`;
    this.eleHour.innerHTML = hours > 9 ? hours.toString() : '0' + hours;
    this.eleMinute.innerHTML = minutes > 9 ? minutes.toString() : '0' + minutes;
    this.eleSecond.innerHTML = seconds > 9 ? seconds.toString() : '0' + seconds;
    setTimeout(() => {
      this.countDown();
    }, 1000);
  }

  // 显示提示窗
  showTips(desc:string) {
    this.eleTip.innerHTML = desc;
    this.eleTips.classList.add('show');
    setTimeout(() => {
      this.hiddenTips();
    }, 3000);
  }

  // 隐藏提示窗
  hiddenTips() {
    this.eleTips.classList.remove('show');
  }

  // 显示模态窗
  showModal() {
    this.eleEmail['value'] = '';
    this.eleForm.classList.add('show');
    this.eleSendSuccessful.classList.remove('show');
    const htmlStyle = this.eleHtml.getAttribute('style')
    this.eleHtml.setAttribute('style', `${htmlStyle}overflow-y:hidden;`);
    this.eleModal.classList.add('show')
  }

  // 隐藏模态窗
  hideModal() {
    this.eleModal.classList.remove('show')
    const htmlStyle = this.eleHtml.getAttribute('style')
    this.eleHtml.setAttribute('style', `${htmlStyle}overflow-y:scroll;`);
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
