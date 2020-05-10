// 修改页面title

function resetDocumentTitle(title) {
  document.title = title;
  if (/ip(hone|od|ad)/i.test(navigator.userAgent)) {
    let iframe = document.createElement('iframe');
    iframe.src = 'https://www.baidu.com/favicon.ico';
    iframe.style.visibility = 'hidden';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.onload = function() {
      setTimeout(function() {
        iframe.remove();
      }, 9)
    }
    document.body.appendChild(iframe);
  }
}

export default resetDocumentTitle;
