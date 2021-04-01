// 封装ajax
export const ajax = (options, callback) => {
	let xmlhttp;
	if (window.XMLHttpRequest) {
		//  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
		xmlhttp = new XMLHttpRequest();
	} else {
		// IE6, IE5 浏览器执行代码
		xmlhttp =new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange = () => {
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
      console.log(xmlhttp.responseText)
      var result = JSON.parse(xmlhttp.responseText)
      if (callback) {
        callback(result)
      }
		}
  }
  var url = options.url
  
  var pStr = ""
  if (options.data && Object.keys(options.data).length) {
    Object.keys(options.data).forEach(function(key, index) {
      pStr += key + "=" + options.data[key]
      if (index != Object.keys(options.data).length - 1) {
        pStr += "&"
      }
    })
  }
  if (options.type.toLowerCase() == "get") {
    url += pStr
    xmlhttp.open(options.type, url, true);
    xmlhttp.send()
  } else if (options.type.toLowerCase() == "post") {
    xmlhttp.open(options.type, url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xmlhttp.send(pStr);
  }
}