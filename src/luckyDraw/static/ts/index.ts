import { config } from './config';
import { setupWebViewJavascriptBridge } from './bridge';
import { request } from './request';
import { shuffle, getRandomNum } from './utils';

// 优惠券分类
const enum VoucherType {
  OverPay = 'overPay',
  Discount = 'discount',
  Cash = 'cash'
}

class Activity {
  deviceId: string;
  userId: string;
  verify: string;
  maxDrawNum: number;
  // 抽奖次数
  drawNum: number;
  // 是否正在抽奖
  isDraw: boolean;
  // 优惠券
  coupons;
  // 抽到的奖项
  drawReward;
  // 页面元素
  eleHtml; eleTracks; eleClose; eleTips; eleTip; eleTicket; eleTicketType;
  eleBtnDrawDisabled; eleBtnDraw; eleDrawNum; eleModal; eleAwardInfos;

  constructor() {
    this.deviceId = config.deviceId ? config.deviceId : '3394eda119c4450fad3f569ca3fdc4fb'
    this.userId = config.userId ? config.userId : '5ed9a7d13f34183fb701a4521'
    this.verify = config.verify ? config.verify :'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJUYWxrbWF0ZSIsImV4cCI6MTYyMzMxMTY4MiwianRpIjoiNWVkOWE3ZDEzZjM0MTgzZmI3MDFhNDUyIn0._Mra9WMQ0sRO7-9mVuSuna3dPjWFrB621rgP3o1ULfU'
    this.maxDrawNum = 3;
    this.drawNum = this.maxDrawNum;
    this.isDraw = false;
    this.eleHtml = document.querySelector('html');
    this.eleTracks = document.querySelector('.tracks');
    this.eleClose = document.querySelector('.icon-close');
    this.eleTips = document.querySelector('.tips');
    this.eleTip = document.querySelector('.tip');
    this.eleTicket = document.querySelector('#ticket');
    this.eleTicketType = document.querySelector('#ticketType');
    this.eleBtnDrawDisabled = document.querySelector('#btnDrawDisabled');
    this.eleBtnDraw = document.querySelector('#btnDraw');
    this.eleDrawNum = document.querySelector('#drawNum');
    this.eleModal = document.querySelector('.modal');
    this.eleAwardInfos = document.querySelector('.award-infos')
    console.log('construct')
  }

  // 初始化
  async init() {
    console.log('init')
    // 初始化按钮事件
    this.initEvent();
    // 轮播获奖信息
    this.cycleInterval();
    // 优惠券列表
    const res1 = await this.couponList();
    this.coupons = res1['vouchers'];
    console.log('coupons', this.coupons);
    // 重置轮盘轨道数据
    this.resetTrack();
    // 初始化抽奖次数
    this.initDrawNum();
  }

  // 关闭页面
  close() {
    if (config.isIPhone) {
      setupWebViewJavascriptBridge((bridge) => {
        bridge.callHandler('iosCanJumpOut', {canJumpOut:'YES'});
      })
    }
    if (config.isAndroid) {
      (<any>window).androidObj.finishActivity();
    }
  }

  // 设置抽奖次数
  setDrawNum() {
    this.eleDrawNum.innerText = this.drawNum.toString()
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
    this.eleTicket.innerHTML = this.rewardDesc(this.drawReward);
    if (this.drawReward.type === VoucherType.OverPay) {
      this.eleTicket.classList.add('manjian')
    } else {
      this.eleTicket.classList.remove('manjian')
    }
    let type = this.typeDesc(this.drawReward.type)
    this.eleTicketType.innerHTML = `${type}x1`
    const htmlStyle = this.eleHtml.getAttribute('style')
    this.eleHtml.setAttribute('style', `${htmlStyle}overflow-y:hidden;`);
    this.eleModal.classList.add('show')
    setTimeout(() => {
      this.hideModal();
    }, 3000);
  }

  // 隐藏模态窗
  hideModal() {
    this.isDraw = false
    this.eleBtnDrawDisabled.classList.remove('show')
    this.eleModal.classList.remove('show')
    const htmlStyle = this.eleHtml.getAttribute('style')
    this.eleHtml.setAttribute('style', `${htmlStyle}overflow-y:scroll;`);
  }

  // 初始化抽奖次数
  initDrawNum() {
    request({
      url: '/payv1/voucher/count',
      type: 'jsonp',
      data: {
        device_id: this.deviceId,
        user_id: this.userId,
        verify: this.verify
      }
    }).then(res => {
      console.log(res)
      this.drawNum = this.maxDrawNum - res['recordsCount']
      this.setDrawNum();
    });
  }

  // 初始化事件
  initEvent() {
    // 点击马上抽奖按钮事件
    this.eleBtnDraw.addEventListener('click', (e) => {
      if (this.isDraw) return
      if (this.drawNum > 0) {
        this.isDraw = true
        this.eleBtnDrawDisabled.classList.add('show');
        this.getRewardResult();
      } else {
        this.showTips('本周抽奖机会已用完');
      }
    })

    // 点击关闭事件
    this.eleClose.addEventListener('click', () => {
      console.log('close');
      this.close();
    });

    // 点击model隐藏
    this.eleModal.addEventListener('click', () => {
      this.hideModal();
    });
  }

  // 优惠券列表
  couponList() {
    return request({
      url: '/payv1/voucher/list',
      type: 'jsonp',
      data: {
        device_id: this.deviceId,
        user_id: this.userId,
        verify: this.verify
      }
    });
  }

  // 优惠券类型描述
  typeDesc(type:string) {
    let desc = '';
    switch (type) {
      case VoucherType.Discount:
        desc = '折扣券';
        break;
      case VoucherType.Cash:
        desc = '现金券';
        break;
      default:
        desc = '满减券';
        break;
    }
    return desc
  }

  // 奖项描述
  rewardDesc(iterator) {
    let desc = '';
    switch (iterator.type) {
      case VoucherType.Discount:
        desc = `${iterator['money']}折`
        break;
      case VoucherType.Cash:
        desc = `￥${iterator['money']}`
        break;
      default:
        desc = iterator['title']
        desc = desc.replace('￥', '￥<br/>')
        break;
    }
    return desc;
  }

  // 删除轨道内容
  removeTrack() {
    const tracks = this.eleTracks.children;
    if (tracks[tracks.length - 1]) {
      tracks[tracks.length - 1].remove()
    }
    while (tracks.length) {
      this.removeTrack()
    }
  }

  // 初始化轨道奖项内容
  initTracks(num, reset?: string) {
    const tracks = this.eleTracks;
    let track = '';
    let index = 0;
    let list = shuffle(this.coupons);
    if (reset === 'reset') {
      list = [...this.coupons, ...this.coupons]
    }
    for (const iterator of list) {
      let type = this.typeDesc(iterator.type)
      let desc = this.rewardDesc(iterator)
      track += `
        <div class="track-item" data-index="${index}">
          <div class="ticket">
            <div class="desc ${iterator.type === VoucherType.OverPay ? 'manjian' : ''}">${desc}</div>
          </div>
          <div class="ticket-type">${type}</div>
        </div>
      `
      index++;
    }
    let nodeTrack = document.createElement('div')
    nodeTrack.className = 'track'
    nodeTrack.innerHTML = track
    tracks.append(nodeTrack);
  }

  // 重置轨道数据
  resetTrack(reset?: string) {
    // 删除轨道内容
    this.removeTrack();
    // 初始化三条轮到
    [0, 1, 2].forEach(item => {
      this.initTracks(item, reset);
    })
  }

  getRewardList() {
    return request({
      url: '/payv1/voucher/records',
      type: 'jsonp',
      data: {
        device_id: this.deviceId,
        user_id: this.userId,
        verify: this.verify
      }
    }) 
  }

  // 初始化获奖信息列表
  async initRewardInfo() {
    let res = await this.getRewardList();
    console.log(res);
    if (!res['recordsList']) return
    let pTag = '';
    for (const iterator of res['recordsList']) {
      pTag += `
      <p>
        <span>恭喜 用户：${iterator.talkmateId} 获得</span>
        <span>${iterator.title}</span>
      </p>`;
    }
    this.eleAwardInfos.innerHTML = pTag;
  }

  // 循环设置时间间隔器
  cycleInterval() {
    this.initRewardInfo();
    let counter = 0
    const interval = setInterval(() => {
      counter += 0.031111;
      const children2 = this.eleAwardInfos.children
      for (let index = 0; index < children2.length; index++) {
        const element = children2[index];
        element.setAttribute('style', `transform:translateY(-${counter}rem)`);
      }
      if (counter > .586667 * (children2.length + 3)) {
        clearInterval(interval);
        this.cycleInterval();
      }
    }, 100)
  }

  // 从服务器端获取抽奖结果
  getRewardResult() {
    request({
      url: '/payv1/voucher/draw',
      type: 'jsonp',
      data: {
        device_id: this.deviceId,
        user_id: this.userId,
        verify: this.verify
      }
    }).then(res => {
      console.log(res)
      this.drawNum = this.maxDrawNum - res['recordsCount'];
      this.drawReward = res['vouchers'];
      // 设置抽奖次数
      this.setDrawNum();
      this.resetTrack('reset');
      setTimeout(() => {
        this.startDraw().then(() => {
          this.showModal();
        })
      }, 100);
    });
  }

  // 开始抽奖
  startDraw() {
    return new Promise((resolve, reject) => {
      // let num = getRandomNum(12);
      let num = this.coupons.findIndex(item => {
        return item.voucher_id === this.drawReward.voucherId
      })
      // this.drawReward = this.coupons[num];
      console.log('drawReward', this.drawReward)
      let tracks = this.eleTracks.children;
      [0, 1, 2].forEach(ele => {
        setTimeout(() => {
          let counter = (num + 12) * 3.413333
          tracks[ele].setAttribute('style', `transform:translateY(-${counter}rem)`)
        }, ele * 300);
      });
      setTimeout(() => {
        resolve(0)
      }, 6000);
    })
  }
}

const activity = new Activity();
activity.init();
