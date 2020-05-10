
import wxAuth from './3rd/wechat/auth';

function to(path, options) {
  let result = path;
  if (options) {
    if (options.pay) result = wxAuth.pay(result, options.pay === 'force');
    if (options.auth) {
      result = wxAuth.auth(result, {
        silent: options.auth === 'silent',
        appid: options.appid || null
      });
    }
  }
  return result;
}

function go(...args) {
  window.location = to(...args);
}

export default go;
export { go, to };
