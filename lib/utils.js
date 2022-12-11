const randomHash = () => Math.random().toString(36).slice(2, 10);
const isFunction = (item) => item instanceof Function;

function getShadow(html) {
  const $tmp = document.createElement("div");
  $tmp.innerHTML = html;
  return $tmp;
}

const nextTick = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 0);
  });

const isElement = ($el) => $el.nodeType === Node.ELEMENT_NODE;

export { nextTick, isElement, randomHash, isFunction, getShadow };
