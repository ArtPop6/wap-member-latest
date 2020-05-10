/* global IM */

import { im } from './url';

const url = im;

function creator(user) {
  const timestamp = Math.random().toString().replace(/^0\./, '');
  const session = `wx-${user}-${timestamp}`;

  const instance = new IM({
    url,
    session,
  });

  return instance;
}

export default creator;
