export const setupWebViewJavascriptBridge = (callback) => {
  if ((<any>window).WebViewJavascriptBridge) {
    return callback((<any>window).WebViewJavascriptBridge);
  }
  if ((<any>window).WVJBCallbacks) {
    return (<any>window).WVJBCallbacks.push(callback);
  }
  (<any>window).WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(() => {
    document.documentElement.removeChild(WVJBIframe)
  }, 0)
}
