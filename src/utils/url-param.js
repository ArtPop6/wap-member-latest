let store = null;

function serialize(url) {
  if (url === '') return {};
  const dict = url.replace(/^\?/, '').split(/[&|]/ig);
  const params = {};
  dict.forEach((item) => {
    const [key, val] = item.split('=');
    params[key] = val;
  });
  return params;
}

function getURLParam(name) {
  if (!store) {
    const query = window.decodeURIComponent(window.location.search);
    store = serialize(query);
  }
  return store[name];
}

export default getURLParam;
