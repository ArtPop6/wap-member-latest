
import hack from './hack';
import wechat from './3rd/wechat';
import wxAuth from './3rd/wechat/auth';

const { noSupport } = wxAuth;

const defaultOptions = {
  autoRemoveLoading: true,
};

function removeLoading() {
  const domOfLoading = document.querySelector('body>.loading');
  if (domOfLoading) domOfLoading.remove();
}

function ready(...args) {
  // no promise for this function
  let callback = null;
  let options = Object.assign({}, defaultOptions);

  if (args) {
    const count = args.length;
    const lastArg = args[count - 1];
    if (typeof lastArg === 'function') callback = lastArg;
    const firstArg = args[0];
    if (typeof firstArg === 'object') options = Object.assign(options, firstArg);
  }
  // 1. hack browser function
  // 2. rewirte common function
  // 3. ready
  hack(() => {
    wechat.ready(() => {
      if (callback) callback();
      // if has loading dom and config not changed, remove it.
      if (options.autoRemoveLoading) removeLoading();
    });
  });
}

export default ready;
export {
  removeLoading,
  noSupport,
};
