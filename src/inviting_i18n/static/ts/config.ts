export const config = {
  isIPhone: /iPhone/i.test(navigator.userAgent) || /iPad/i.test(navigator.userAgent),
  isAndroid: /Android/i.test(navigator.userAgent),
}