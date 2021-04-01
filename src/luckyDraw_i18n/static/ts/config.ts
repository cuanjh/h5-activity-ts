import { env } from "./env";
import { getUrlParam } from "./utils";

let isDev = env == "dev";
export const config = {
  isIPhone: /iPhone/i.test(navigator.userAgent) || /iPad/i.test(navigator.userAgent),
  isAndroid: /Android/i.test(navigator.userAgent),
  deviceId: getUrlParam('device_id'),
  userId: getUrlParam('user_id'),
  verify: getUrlParam('verify'),
  appSecret: isDev ? 'E6DAC3DC3514681FC922ECE1B0CF06EB' : '5EAE76C6323C85D2E35D4817020D84C9',
  apiDomain: isDev ? 'http://dev.api.talkmate.com' : 'https://eu-api.talkmate.com/'
}