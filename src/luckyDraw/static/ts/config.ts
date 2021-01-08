let isDev = true
export const config = {
  isIPhone: /iPhone/i.test(navigator.userAgent) || /iPad/i.test(navigator.userAgent),
  isAndroid: /Android/i.test(navigator.userAgent),
  deviceId: '',
  userId: '',
  verify: '',
  appSecret: isDev ? 'E6DAC3DC3514681FC922ECE1B0CF06EB' : '5EAE76C6323C85D2E35D4817020D84C9',
  apiDomain: isDev ? 'http://dev.api.talkmate.com' : 'https://api.talkmate.com'
}