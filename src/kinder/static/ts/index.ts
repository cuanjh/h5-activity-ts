import { config } from './config';
import { setupWebViewJavascriptBridge } from './bridge';
import { getJSONP } from './jsonp';

class Activity {
  player: any;
  list: Array<any>;
  list1: Array<any>;
  list2: Array<any>;
  list3: Array<any>;
  list4: Array<any>;
  curUUID: string;
  // 优惠券
  coupons;
  // 抽到的奖项
  drawReward;
  // 页面元素
  eleHtml; eleBtnRecord; eleTips; eleTip; eleModal;

  constructor() {
    this.list = [];
    this.list1 = [];
    this.list2 = [];
    this.list3 = [];
    this.list4 = [];
    this.curUUID = ''
    this.eleHtml = document.querySelector('html');
    this.eleBtnRecord = document.querySelector('.btn-record');
    this.eleTips = document.querySelector('.tips');
    this.eleTip = document.querySelector('.tip');
    this.eleModal = document.querySelector('.modal');
    console.log('construct')
  }

  // 初始化
  async init() {
    console.log('init')
    this.player = window['videojs']('my-video', {
      controls: true,
      html5: {
        vhs: {
          overrideNative: !window['videojs'].browser.IS_SAFARI
        },
        nativeVideoTracks: false,
        nativeAudioTracks: false,
        nativeTextTracks: false
      }
    });
    this.player.removeChild('BigPlayButton');
    // this.player.disablePictureInPicture(true);
    this.player.on('loadeddata', () => {
      let vHeight = this.player.videoHeight();
      let vWidth = this.player.videoWidth();
      let height = 550
      let width = vWidth * height / vHeight
      document.querySelector('.video-js').setAttribute('style', `width:${width}px; height: ${height}px` )
      this.player.play()
    })
    console.log(this.player)
    // 初始化按钮事件
    this.initEvent();
    // 初始化数据
    this.initData();
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
    this.eleModal.classList.add('show');
  }

  // 隐藏模态窗
  hideModal() {
    this.player.pause()
    this.eleModal.classList.remove('show')
    const htmlStyle = this.eleHtml.getAttribute('style')
    this.eleHtml.setAttribute('style', `${htmlStyle}overflow-y:scroll;`);
  }

  // 初始化抽奖次数
  initData() {
    getJSONP('/acv1/kindresources/find').then(res => {
      console.log(res)
      this.list = res['kind_resources'] || [];
      for (const item of this.list) {
        switch (item.category) {
          case '1':
            this.list1.push(item)
            break;
          case '2':
            this.list2.push(item)
            break;
          case '3':
            this.list3.push(item)
            break;
          case '4':
            this.list4.push(item)
            break;
        }
      }
      console.log(this.list1, this.list2, this.list3, this.list4)
      // 看得见的进步
      let h1 = ''
      this.list1
        .sort((a, b) => {
          return a.list_order - b.list_order
        })
        .forEach(item => {
          h1 += `
            <div class="item">
              <img loading="lazy" src="${config.assetsDomain + item.image_url}"/>
              <div class="shade">
                <div class="icon" data-uuid="${item.uuid}">
                  <i class="triangle triangle-right"></i>
                </div>
              </div>
              <p class="title">${item.title['zh-CN']}</p>
            </div>
          `
        })
      document.querySelector('.list[data-index="1"]').innerHTML = h1
      // 园长讲话
      let h2 = ''
      this.list2
        .sort((a, b) => {
          return a.list_order - b.list_order
        })
        .forEach(item => {
          h2 += `
            <div class="item">
              <img loading="lazy" src="${config.assetsDomain + item.image_url}"/>
              <div class="shade">
                <div class="icon" data-uuid="${item.uuid}">
                  <i class="triangle triangle-right"></i>
                </div>
              </div>
              <p class="title">${item.title['zh-CN']}</p>
            </div>
          `
        })
      document.querySelector('.list[data-index="2"]').innerHTML = h2
      // 课堂融合
      let h3 = ''
      let row1 = ''
      let row2 = ''
      this.list3
        .sort((a, b) => {
          return a.list_order - b.list_order
        })
        .forEach((item, index) => {
          if (index === 0) {
            row1 += `
              <div class="row">
                <div class="item">
                  <img loading="lazy" src="${config.assetsDomain + item.image_url}"/>
                  <div class="shade">
                    <div class="icon" data-uuid="${item.uuid}">
                      <i class="triangle triangle-right"></i>
                    </div>
                  </div>
                  <p class="title">${item.title['zh-CN']}</p>
                </div>
              </div>
            `
          } else {
            row2 += `
              <div class="item">
                <img loading="lazy" src="${config.assetsDomain + item.image_url}"/>
                <div class="shade">
                  <div class="icon" data-uuid="${item.uuid}">
                    <i class="triangle triangle-right"></i>
                  </div>
                </div>
                <p class="title">${item.title['zh-CN']}</p>
              </div>
            `
          }
        })
      h3 += row1 + `<div class="row">${row2}</div>`
      document.querySelector('.list[data-index="3"]').innerHTML = h3
      // 园所挂牌
      let h4 = ''
      this.list4
        .sort((a, b) => {
          return a.list_order - b.list_order
        })
        .forEach(item => {
          h4 += `
            <div class="item">
              <img loading="lazy" src="${config.assetsDomain + item.image_url}"/>
              <p class="title">${item.title['zh-CN']}</p>
            </div>
          `
        })
      document.querySelector('.list[data-index="4"]').innerHTML = h4
      document.querySelectorAll('.icon').forEach(ele => {
        ele.addEventListener('click', e => {
          let { uuid } = e.currentTarget['dataset'];
          let item = this.list.find(i => {
            return i.uuid === uuid
          })
          console.log(item)
          this.setPlayer(item)
          this.showModal();
        })
      })
    })
  }

  // 初始化事件
  initEvent() {
    // 学生档案按钮点击事件
    this.eleBtnRecord.addEventListener('click', () => {
      window.open('https://teachers.talkmate.com/kinder/index', '_blank');
    });

    // 点击model隐藏
    this.eleModal.addEventListener('click', (e) => {
      let s = new Set(e.target.classList)
      if (s.has('modal-wrap')) {
        this.hideModal()
      }
    });
  }

  // 播放视频
  setPlayer (item) {
    if (this.curUUID === item.uuid) {
      this.player.play()
    } else {
      this.curUUID = item.uuid
      this.player.src(config.assetsDomain + item.video_url.m3u8)
    }
  }
}

const activity = new Activity();
activity.init();
