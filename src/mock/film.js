import dayjs from 'dayjs';
import {getRandomInteger, getRandomFloat, getRandomArrayElement, getRandomArray} from '../util.js';
import {generateComment} from './comment.js';
import {TITLES, POSTERS, PEOPLE, COUNTRIES, GENRES, DESCRIPTION, MAX_DESCRIPTION_LENGTH, FilmDuration} from './const.js';

const getDuration = () => {
  const duration = getRandomInteger(FilmDuration.MIN_DURATION, FilmDuration.MAX_DURATION);

  return Math.floor(duration / 60) ? `${Math.floor(duration / 60)}h ${duration % 60}m` : `${duration % 60}m`;
};

export const generateFilm = () => {
  const indexForTitleAndPoster = getRandomInteger(0, TITLES.length - 1);
  const alreadyWatched = Boolean(getRandomInteger());

  return {
    comments : new Array(getRandomInteger(0, 5)).fill().map(() => generateComment()),
    filmInfo: {
      title: TITLES[indexForTitleAndPoster],
      alternativeTitle: TITLES[indexForTitleAndPoster],
      totalRating: getRandomFloat(0, 10),
      poster: POSTERS[indexForTitleAndPoster],
      ageRating: `${getRandomInteger(0, 18)}+`,
      director: getRandomArrayElement(PEOPLE),
      writers: getRandomArray(PEOPLE),
      actors: getRandomArray(PEOPLE),
      release: {
        date: dayjs().format('DD MMMM YYYY'),
        releaseCountry: getRandomArrayElement(COUNTRIES),
      },
      runtime: getDuration(),
      genre: getRandomArray(GENRES),
      description: getRandomArray(DESCRIPTION).slice(0, MAX_DESCRIPTION_LENGTH).join(' '),
    },
    userDetails: {
      watchlist: Boolean(getRandomInteger()),
      alreadyWatched,
      watchingDate: alreadyWatched ? dayjs().format('DD MMMM YYYY') : null,
      favorite: Boolean(getRandomInteger()),
    },
  };
};
