// 本文件是为了弥补浏览器能力不足，所做的hack

import promisePolyfill from 'promise-polyfill';

const checklist = [
  // promise
  function promise(done) {
    if (!window.Promise || !window.Promise.all) {
      window.Promise = promisePolyfill;
    } else { done(); }
  },
  // i18n locale
  // .etc
];

const hackCallback = [];
const numberOfCheck = checklist.length;
let unCheckNumber = numberOfCheck;

function checkCallback() {
  unCheckNumber -= 1;
  if (unCheckNumber === 0 && hackCallback.length) {
    do {
      hackCallback.shift()();
    } while (hackCallback.length);
  }
}

for (let i = 0; i < numberOfCheck; i += 1) {
  checklist[i](checkCallback);
}

function hack(done) {
  if (typeof done === 'function') {
    if (unCheckNumber === 0) done();
    else hackCallback.push(done);
  }
}

export default hack;
