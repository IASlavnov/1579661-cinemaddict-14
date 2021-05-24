import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import AbstractView from './view/abstract.js';

const MINUTES_PER_HOUR = 60;
const DATE_FORMAT = 'DD MMMM YYYY';
const YEAR_FORMAT = 'YYYY';

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
  if (element === null) {
    return;
  }

  if (!(element instanceof AbstractView)) {
    throw new Error('Can remove only components');
  }

  element.getElement().remove();
  element.removeElement();
};

export const sortByDate = (a, b) => dayjs(b.filmInfo.release.date).diff(dayjs(a.filmInfo.release.date));

export const sortByRating = (a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating;

export const sortByComments = (a, b) => b.comments.length - a.comments.length;

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

export const getDuration = (duration) => {
  return Math.floor(duration / MINUTES_PER_HOUR) ?
    `${Math.floor(duration / MINUTES_PER_HOUR)}h ${duration % MINUTES_PER_HOUR}m` :
    `${duration % MINUTES_PER_HOUR}m`;
};

export const getCommentDate = (date) => {
  dayjs.extend(relativeTime);
  return dayjs(date).fromNow();
};

export const getFormatDate = (date) => dayjs(date).format(DATE_FORMAT);

export const getFormatYearDate = (date) => dayjs(date).format(YEAR_FORMAT);
