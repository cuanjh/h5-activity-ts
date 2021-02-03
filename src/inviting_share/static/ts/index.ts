import { request } from './request';
import { setupWebViewJavascriptBridge } from './bridge';
import { config } from './config';
import { getWXToken } from './wxShare';

console.log(config);
const errorCodes = {
  '1001': '数据不能为空',
  '200001': '已经被邀请过了'
};

class Activity {
  deviceId: string;
  userId: string;
  nickname: string;
  price: number;
  endYear: number;
  endMonth: number;
  endDay: number;
  eleHtml; eleTitleWrap; elePrice; elePhone; eleDrawMember; eleIntroWrap;
  eleBtnInviting; eleTips; eleTip; eleModal; eleRewardPrice; eleBtnEntryTalkmate;
  eleClose;
  constructor() {
    this.deviceId = config.deviceId ? config.deviceId : '3394eda119c4450fad3f569ca3fdc4fb'
    this.userId = config.userId ? config.userId : '5ed9a7d13f34183fb701a452'
    this.price = config.price ? parseInt(config.price) : 198;
    this.nickname = config.nickname ? config.nickname : '';
    this.endYear = 2021;
    this.endMonth = 3;
    this.endDay = 25;
    this.eleTitleWrap = document.querySelector('.title-wrap');
    this.elePrice = document.querySelector('.price');
    this.elePhone = document.querySelector('.phone')
    this.eleDrawMember = document.querySelector('.draw-member');
    this.eleIntroWrap = document.querySelector('.intro-wrap');
    this.eleBtnInviting = document.querySelector('.btn-inviting');
    this.eleTips = document.querySelector('.tips');
    this.eleTip = document.querySelector('.tip');
    this.eleHtml = document.querySelector('html')
    this.eleModal = document.querySelector('.modal');
    this.eleRewardPrice = document.querySelector('.reward-price');
    this.eleBtnEntryTalkmate = document.querySelector('.btn-entry-talkmate');
    this.eleClose = document.querySelector('#btnClose');
    console.log('constructor');
  }
  init() {
    // 二次分享处理，由于测试环境域名含有端口号，测试无效
    getWXToken({
      title: `${this.nickname}邀你一起领取${this.price}元全球说会员PLUS`,
      desc: '邀请好友注册全球说，得会员大奖'
    })
    // 初始化事件
    this.initEvent();
    // 设置标题
    this.setTitle();
    // 设置卡片价格
    this.setCardPrice();
    // 设置活动说明
    this.setIntro();
  }

  // 初始化按钮点击事件
  initEvent() {
    this.elePhone.addEventListener('keyup', (e) => {
      console.log(this.elePhone.value);
      if (this.elePhone.value.length === 11) {
        this.eleDrawMember.classList.add('completed')
      } else {
        this.eleDrawMember.classList.remove('completed')
      }
    });
    this.eleDrawMember.addEventListener('click', (e) => {
      console.log(this.eleDrawMember.classList)
      if (this.eleDrawMember.classList.contains('completed')) {
        let phone = this.elePhone.value;
        let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
        if (!reg.test(phone)) {
          this.showTips('手机号格式不正确');
        } else {
          this.invitedRegister(phone);
        }
      }
    });
    this.eleBtnEntryTalkmate.addEventListener('click', (e) => {
      this.entryTalkmate();
    });

    this.eleClose.addEventListener('click', (e) => {
      this.hideModal();
    })
  }

  // 领取会员
  invitedRegister(phone) {
    request({
      url: '/acv1/invite/register',
      type: 'jsonp',
      data: {
        device_id: this.deviceId,
        user_id: this.userId,
        verify: '',
        phonenumber: phone,
        assort: 'cn',
        activity_name: '邀请有礼'
      }
    }).then(res => {
      this.showModal();
    }).catch(errCode => {
      this.showTips(errorCodes[errCode])
    });
  }

  // 设置标题
  setTitle() {
    this.eleTitleWrap.innerHTML = `
      <p><span class="spanNickname">${this.nickname}</span>邀请你注册全球说</p>
      <p>各得<span class="spanPrice">${this.price}</span>元会员PLUS</p>
    `;
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

  priceCls() {
    let cls = 'p-198';
    switch (this.price) {
      case 198:
        cls = 'p-198'
        break;
      default:
        break;
    }
    return cls
  }

  // 设置卡片价格
  setCardPrice() {
    this.elePrice.classList.add(this.priceCls());
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
    this.eleRewardPrice.classList.add(this.priceCls());
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

  // 进入全球说
  entryTalkmate() {
    const iosURL = 'https://itunes.apple.com/cn/app/id959231176?mt=8';
    const androidURL = 'https://sj.qq.com/myapp/detail.htm?apkName=com.kuyu';
    if (config.isIPhone) {
      window.location.href = iosURL;
    } else if (config.isAndroid) {
      window.location.href = androidURL;
    }
  }
}

const activity = new Activity();
activity.init();
