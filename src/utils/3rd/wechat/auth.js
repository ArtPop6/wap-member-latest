
import Cookies from 'js-cookie';
import { url } from '../../url';


const noSupportAppid = ['wx1b3e8866a981aaaf', 'wx6b7b355efee45552', 'wxb05fb3f320d99f0b'];

const APPID = Cookies.get('app_id');
const is3rd = Boolean(APPID);

const path = `${url.api}/wechat`;
const authUrl = {
  pay: '/mp/pay/authorize',
  auth: '/mp/authorize/userinfo',
  silent: '/mp/authorize',
  auth3rd: '/thirdparty/oauth2/authorize/userinfo',
  silent3rd: '/thirdparty/oauth2/authorize',
};

function fullUrl(path, encode) {
  let result;

  if (/(https?:)?\/\//.test(path)) result = path;
  else if (/^\//.test(path)) result = `${url.site}${path}`;
  else result = `${url.site}/${path}`;

  return encode ? encodeURIComponent(result) : result;
}

const pay = (to, force) => {
  if (is3rd || force) return `${path}${authUrl.pay}?state=${fullUrl(to, true)}`;
  return to;
};

const auth = (to, options) => {
  const { silent, appid } = options || {};
  const authID = appid || APPID;
  const encodeURL = fullUrl(to, true);

  if (authID && !silent) return `${path}${authUrl.auth3rd}/${authID}?state=${encodeURL}`;
  // if (authID && !silent) return `${path}${authUrl.auth3rd}?state=${encodeURL}&appid=${authID}`;
  else if (authID && silent) return `${path}${authUrl.silent3rd}?state=${encodeURL}&appid=${authID}`;
  else if (!authID && !silent) return `${path}${authUrl.auth}?state=${encodeURL}`;
  return `${path}${authUrl.silent}?state=${encodeURL}`;
};

const noSupport = is3rd; // noSupportAppid.indexOf(APPID) === -1;

export default {
  pay,
  auth,
  appid: APPID,
  noSupport,
};
