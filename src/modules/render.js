const renderChild = (elem, child) => {
  if (typeof child === 'string') {
    elem.innerHTML += child;
    return;
  }
  elem.appendChild(child);
};

const createElement = (type, attrList = {}, children = []) => {
  const elem = document.createElement(type);
  const keys = Object.keys(attrList);
  keys.map((k) => elem.setAttribute(k, attrList[k]));

  children.map((child) => renderChild(elem, child));
  return elem;
};

const render = (elem, DOMelem) => {
  DOMelem.appendChild(elem);
};

export { createElement, render };
