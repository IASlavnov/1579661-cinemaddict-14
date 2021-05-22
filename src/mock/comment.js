import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {getRandomArrayElement} from '../util.js';
import {DESCRIPTION, PEOPLE, EMOTIONS} from './const.js';

export const generateComment = () => {
  return {
    id: nanoid(),
    author: getRandomArrayElement(PEOPLE),
    comment: getRandomArrayElement(DESCRIPTION),
    date: dayjs(),
    emotion: getRandomArrayElement(EMOTIONS),
  };
};
