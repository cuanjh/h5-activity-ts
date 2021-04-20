import { request } from './request';
import { config } from './config';

console.log(config);

class Activity {
  courseCodes: Array<string>;
  level: string;
  courses: any;
  curId: string;
  curCourse: any;
  player: any;
  eleNavItems: any
  eleTabPanels: any
  eleCourseItems: any
  eleContainer: HTMLElement
  constructor() {
    this.level = config.level ? config.level : '1'
    this.courses = {
      en: [],
      fr: []
    }
    this.courseCodes = ['KEN-Basic', 'KFR-Basic'];
    this.eleContainer = document.querySelector('.container')
    this.eleNavItems = document.querySelectorAll('.tabs-nav-item');
    this.eleTabPanels = document.querySelectorAll('.tab-panel');
    console.log('constructor');
  }
  init() {
    this.player = window['videojs']('my-video', {
      controls: true,
      autoplay: true,
      muted: true,
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
      this.player.play()
    })
    this.player.on('ended', () => {
      const arr = this.curId.split('-')
      const lang = arr[0]
      const index = parseInt(arr[1], 10)
      if (index < this.courses[lang].length - 1) {
        document.querySelector('.course-item.is-active').nextElementSibling.dispatchEvent(new Event('click'))
      }
    })
    console.log(this.player)
    this.rotate();
    window.onresize =  () => {
      this.rotate();
    }
    this.getLiveCourseInfo();
    // 初始化事件
    this.initEvent();
  }

  rotate () {
    if (document.documentElement.clientWidth > document.documentElement.clientHeight) {
      this.player.enterFullWindow()
    } else {
      this.player.exitFullWindow()
    }
  }

  // 初始化按钮点击事件
  initEvent() {
    this.eleNavItems.forEach(ele => {
      ele.addEventListener('click', (e:any) => {
        this.eleNavItems.forEach(ele2 => {
          ele2.classList.remove('is-active');
        })
        e.currentTarget.classList.add('is-active');
        this.eleTabPanels.forEach(ele2 => {
          ele2.setAttribute('style', 'display:none')
        })
        const { lang }= e.currentTarget.dataset
        if (lang === 'en') {
          this.eleTabPanels[0].setAttribute('style', '')
        } else {
          this.eleTabPanels[1].setAttribute('style', '')
        }
      })
    })
  }

  // 获取直播课程信息
  getLiveCourseInfo() {
    let contentLevel = 'L1,L2';
    switch (this.level) {
      case '2':
        contentLevel = 'L3,L4';
        break;
      case '3':
        contentLevel = 'L5,L6';
        break;
      default:
        contentLevel = 'L1,L2';
        break;
    }
    request({
      url: '/baiban/course_module/find_all',
      type: 'jsonp',
      data: {
        course_code: this.courseCodes.join(','),
        content_level: contentLevel
      }
    }).then((res:Array<any> = []) => {
      this.courses['en'] = this.formatCourse(res, 'en')
      this.courses['fr'] = this.formatCourse(res, 'fr')
      console.log(this.courses)

      // 默认播放英语第一个视频
      this.curCourse = this.courses['en'][0];
      this.curId = 'en-0'
      this.setPlayer();
      
      this.eleTabPanels[0].innerHTML = this.generateHtml(this.courses['en'], 'en');
      this.eleTabPanels[1].innerHTML = this.generateHtml(this.courses['fr'], 'fr');
      this.eleTabPanels[1].setAttribute('style', 'display:none')
      this.eleTabPanels[0].querySelectorAll('.course-item')[0].classList.add('is-active')


      this.eleCourseItems = document.querySelectorAll('.course-item')
      for (const item of this.eleCourseItems) {
        item.addEventListener('click', (e:any) => {
          this.eleCourseItems.forEach(ele => {
            ele.classList.remove('is-active')
          })
          e.currentTarget.classList.add('is-active')
          console.log(e.currentTarget.dataset)
          let { id } = e.currentTarget.dataset
          this.curId = id;
          const lang = id.split('-')[0]
          const index = parseInt(id.split('-')[1], 10);
          const list = this.courses[lang]
          this.curCourse = list[index]
          this.setPlayer()
        })
      }
    });
  }

  setPlayer () {
    this.player.poster(this.curCourse.videoCover)
    this.player.src(this.curCourse.videoUrl)
  }

  formatCourse (data:Array<any>, lang:string) {
    let courseCode = 'KEN-Basic'
    if (lang === 'fr') {
      courseCode = 'KFR-Basic'
    }
    const courses = data.filter(d => {
      return d.liveInfo.basic_course_code === courseCode
    }).sort((a, b) => {
      if (a.liveInfo.basic_content_level > b.liveInfo.basic_content_level) {
        return 1
      } else if (a.liveInfo.basic_content_level < b.liveInfo.basic_content_level) {
        return -1
      } else {
        return 0
      }
    })
    let formatArr = []
    courses.forEach(c => {
      const liveCourse = c['live_course']
      liveCourse.sort((a, b) => {
        return a.listOrder - b.listOrder
      }).map(m => {
        let obj = {
          uuid: m.uuid,
          level: this.level,
          courseLevel: c.liveInfo.basic_content_level,
          listOrder: m.listOrder,
          title: m.title.split('·')[1],
          cover: c.cover_v2,
          videoUrl: m.videoUrl,
          videoCover: m.videoCover
        }
        formatArr.push(obj)
      })
    })
    return formatArr
  }

  generateHtml (list:Array<any>, lang:string = 'en') {
    let itemHtml = '';
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      let cover = `https://uploadfile1.talkmate.com/${item.cover}`;
      if (item.videoCover) {
        cover = item.videoCover
      }
      itemHtml += `
        <div class="course-item" data-id="${lang}-${i}">
          <img src=${cover} />
          <div class="content">
            <div class="level">
              <div class="desc">启蒙 ${item.level} 级·Book${i + 1}</div>
              <div class="line">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div class="title">
              ${item.title}
            </div>
          </div>
        </div>
      `
    }
    return `
      <div class="course-list">
        ${itemHtml}
      </div>
    `
  }
}

const activity = new Activity();
activity.init();
