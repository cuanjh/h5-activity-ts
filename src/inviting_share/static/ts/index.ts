import { setupWebViewJavascriptBridge } from './bridge';
import { config } from './config';

console.log(config);

class Activity {
  nickname: string;
  price: number;
  endYear: number;
  endMonth: number;
  endDay: number;
  eleHtml; eleTitleWrap; elePrice; elePhone; eleDrawMember; eleIntroWrap;
  eleBtnInviting; eleTips; eleTip; eleModal; eleRewardPrice; eleBtnEntryTalkmate;
  eleClose;
  constructor() {
    this.nickname = 'Jack';
    this.price = 198;
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
          this.showModal();
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

  // 设置标题
  setTitle() {
    this.eleTitleWrap.innerHTML = `
      <p>${this.nickname}邀请你注册全球说</p>
      <p>各得<span>${this.price}</span>元会员PLUS</p>
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

  // 立即邀请分享
  share() {
    console.log('share');
    const shareConfig = {
      title: 'xx邀你一起领取198元全球说会员PLUS',
      digest: '邀请好友注册全球说，得会员大奖',
      thumbnail: '',
      url: '',
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
    // this.eleTicket.innerHTML = this.rewardDesc(this.drawReward);
    // if (this.drawReward.type === VoucherType.OverPay) {
    //   this.eleTicket.classList.add('manjian')
    // } else {
    //   this.eleTicket.classList.remove('manjian')
    // }
    // let type = this.typeDesc(this.drawReward.type)
    // this.eleTicketType.innerHTML = `${type}x1`
    this.eleRewardPrice.classList.add(this.priceCls());
    const htmlStyle = this.eleHtml.getAttribute('style')
    this.eleHtml.setAttribute('style', `${htmlStyle}overflow-y:hidden;`);
    this.eleModal.classList.add('show')
  }

  // 隐藏模态窗
  hideModal() {
    // this.isDraw = false
    // this.eleBtnDrawDisabled.classList.remove('show')
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
