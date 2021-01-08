const dev = true
export const config = {
  isIPhone: /iPhone/i.test(navigator.userAgent) || /iPad/i.test(navigator.userAgent),
  isAndroid: /Android/i.test(navigator.userAgent),
  shareUrl: dev ? 'http://dev.api.talkmate.com:82/inviting_share/index.html' : ''
}