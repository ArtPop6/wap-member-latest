/* global wx */

import script from 'scriptjs';
import http from '../../http';

const sdkUrl = '//res.wx.qq.com/open/js/jweixin-1.2.0.js'; // http and https
const jsApiList = [
  'checkJsApi',
  'onMenuShareTimeline',
  'onMenuShareAppMessage',
  'onMenuShareQQ',
  'onMenuShareWeibo',
  'onMenuShareQZone',
  'hideMenuItems',
  'showMenuItems',
  'hideAllNonBaseMenuItem',
  'showAllNonBaseMenuItem',
  'translateVoice',
  'startRecord',
  'stopRecord',
  'onVoiceRecordEnd',
  'playVoice',
  'onVoicePlayEnd',
  'pauseVoice',
  'stopVoice',
  'uploadVoice',
  'downloadVoice',
  'chooseImage',
  'previewImage',
  'uploadImage',
  'downloadImage',
  'getNetworkType',
  'openLocation',
  'getLocation',
  'hideOptionMenu',
  'showOptionMenu',
  'closeWindow',
  'scanQRCode',
  'chooseWXPay',
  'openProductSpecificView',
  'addCard',
  'chooseCard',
  'openCard',
];
// md5 of 'wxSignConfKey'
const wxSignConfKey = '9ecab63018230ce83f801cc6aebeb208';
const nextCallback = [];
let signReady = false;
let sdkReady = false;
let wxReady = false;

const runCallback = () => {
  if (wxReady && nextCallback.length) {
    const cb = nextCallback.shift();
    cb();
    runCallback();
  }
};

const signWX = (data) => {
  // data.time = Date.now();
  // localStorage.setItem(wxSignConfKey, encodeURIComponent(JSON.stringify(data)));

  const {
    appId,
    timestamp,
    noncestr,
    signature,
  } = data;
  // set wechat sdk config
  wx.config({
    debug: process.env.NODE_ENV === 'development',
    // debug: false,
    appId,
    timestamp,
    nonceStr: noncestr,
    signature,
    jsApiList,
  });
  // set ready event
  wx.ready(() => {
    // 默认关闭
    wx.hideOptionMenu();
    // 检测接口
    wx.checkJsApi({
      jsApiList,
      success: (res) => {
        if (res.checkResult.getLocation === false) {
          console.error('你的微信版本太低，不支持微信JS接口，请升级到最新的微信版本！');
        }
      },
    });
    // set ready
    wxReady = true;
    runCallback();
  });
  // error
  wx.error((...args) => {
    const res = args[0];
    switch (res.errMsg) {
      case 'config:invalid signature':
        console.error(`可能URL匹配错误, 原因: ${window.location.href.split('#')[0]}`);
        break;
      default:
        console.error('其它错误, 全部参数:', args);
        break;
    }
  });
  // end
};

// load wechat js sdk with promise
const loadSDK = () => new Promise((resolve, reject) => {
  if (wx) {
    sdkReady = true;
    resolve();
  } else {
    script(sdkUrl, (...args) => {
      sdkReady = true;
      resolve(...args);
    });
  }
});

// load wechat js sdk signature
const loadSignature = () => {
  const url = `/basic-api/wechat/mp/signature?callback=signWX&url=${encodeURIComponent(window.location.href)}`;
  script(url, () => {});
  return false;
};

// ready for init
function ready(callback) {
  if (callback && typeof callback === 'function') nextCallback.push(callback);
  if (wxReady) {
    runCallback();
  } else {
    // loadSDK().then(() => {
    //   // loadSignature();
    // });
  }
}

window.signWX = signWX;
ready();

export default {
  ready,
  loadSDK,
  loadSignature,
};
