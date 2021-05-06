import AbstractView from './view/abstract.js';

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export const render = (container, element) => {
  if (container instanceof AbstractView) {
    container = container.getElement();
  }

  if (element instanceof AbstractView) {
    element = element.getElement();
  }

  container.append(element);
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const replace = (newChild, oldChild) => {
  if (newChild instanceof AbstractView) {
    newChild = newChild.getElement();
  }

  if (oldChild instanceof AbstractView) {
    oldChild = oldChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  parent.replaceChild(newChild, oldChild);
};

export const remove = (element) => {
  if (!(element instanceof AbstractView)) {
    throw new Error('Can remove only components');
  }

  element.getElement().remove();
  element.removeElement();
};

export const getRandomFloat = (a = 0, b = 1, dec = 1) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);

  return Number((lower + Math.random() * (upper - lower)).toFixed(dec));
};

export const getRandomInteger = (a = 0, b = 1) => {
  return getRandomFloat(a, b, 0);
};

export const getRandomArrayElement = (data) => data[getRandomInteger(0, data.length - 1)];

export const getRandomArray = (data) => {
  const newData = data.filter(() => Math.random() > 0.5);
  newData.length ? newData : newData.push(data[getRandomInteger(0, data.length - 1)]);
  return newData;
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};
