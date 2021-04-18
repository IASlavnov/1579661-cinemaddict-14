import dayjs from 'dayjs';
import {getRandomArrayElement} from '../util.js';
import {DESCRIPTION, PEOPLE, EMOTIONS} from './const.js';

const DATE_FORMAT = 'YYYY/MM/DD HH:mm';

export const generateComment = () => {
  return {
    id: null,
    author: getRandomArrayElement(PEOPLE),
    comment: getRandomArrayElement(DESCRIPTION),
    date: dayjs().format(DATE_FORMAT),
    emotion: getRandomArrayElement(EMOTIONS),
  };
};
