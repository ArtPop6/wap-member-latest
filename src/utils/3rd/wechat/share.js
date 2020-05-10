/* globals wx */

function set(options) {
  const {
    title,
    desc,
    cover: imgUrl,
    link,
    type,
  } = options;

  // 分享给朋友
  wx.onMenuShareAppMessage({
    title,
    desc,
    link,
    imgUrl,
    type, // 分享类型,music、video或link，不填默认为link
    // dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
    success: () => {},
    // cancel: () => {},
  });
  // 分享到朋友圈
  wx.onMenuShareTimeline({
    title,
    link,
    imgUrl,
    success: () => {},
    // cancel: () => {},
  });
  // 分享到QQ
  // wx.onMenuShareQQ({
  //   title,
  //   desc,
  //   link,
  //   imgUrl,
  //   success: () => {},
  //   // cancel: () => {},
  // });
  // 分享到微博
  // wx.onMenuShareWeibo({
  //   title,
  //   desc,
  //   link,
  //   imgUrl,
  //   success: () => {},
  //   // cancel: () => {},
  // });
  // open share
  wx.showMenuItems({
    menuList: [
      'menuItem:share:appMessage',
      'menuItem:share:timeline',
    ],
  });
}

function toTimeline(options) {
  const {
    title,
    cover: imgUrl,
    link,
  } = options;

  // 分享到朋友圈
  wx.onMenuShareTimeline({
    title,
    link,
    imgUrl,
    success: () => {},
    // cancel: () => {},
  });

  // open share
  wx.showMenuItems({
    menuList: [
      'menuItem:share:timeline',
    ],
  });
}
function toMessage(options) {
  const {
    title,
    desc,
    cover: imgUrl,
    link,
    type,
  } = options;

  // 分享给朋友
  wx.onMenuShareAppMessage({
    title,
    desc,
    link,
    imgUrl,
    type, // 分享类型,music、video或link，不填默认为link
    // dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
    success: () => {},
    // cancel: () => {},
  });
  // open share
  wx.showMenuItems({
    menuList: [
      'menuItem:share:appMessage',
    ],
  });
}

export default set;
export {
  toMessage,
  toTimeline,
};
