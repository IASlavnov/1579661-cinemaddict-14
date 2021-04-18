import dayjs from 'dayjs';
import {getRandomInteger, getRandomFloat, getRandomArrayElement, getRandomArray} from '../util.js';
import {generateComment} from './comment.js';
import {TITLES, POSTERS, PEOPLE, COUNTRIES, GENRES, DESCRIPTION, MAX_DESCRIPTION_LENGTH, FilmDuration} from './const.js';

const MINUTES_PER_HOUR = 60;
const DATE_FORMAT = 'DD MMMM YYYY';
const FIRST_INDEX = 0;

const AmountComments = {
  MIN_COMMENTS: 0,
  MAX_COMMENTS: 5,
};

const TotalRating = {
  MIN_RATING: 0,
  MAX_RATING: 10,
};

const AgeRating = {
  MIN_AGE: 0,
  MAX_AGE: 18,
};

const getDuration = () => {
  const duration = getRandomInteger(FilmDuration.MIN_DURATION, FilmDuration.MAX_DURATION);

  return Math.floor(duration / MINUTES_PER_HOUR) ?
    `${Math.floor(duration / MINUTES_PER_HOUR)}h ${duration % MINUTES_PER_HOUR}m` :
    `${duration % MINUTES_PER_HOUR}m`;
};

export const generateFilm = () => {
  const indexForTitleAndPoster = getRandomInteger(0, TITLES.length - 1);
  const alreadyWatched = Boolean(getRandomInteger());

  return {
    comments : new Array(getRandomInteger(AmountComments.MIN_COMMENTS, AmountComments.MAX_COMMENTS))
      .fill()
      .map(() => generateComment()),
    filmInfo: {
      title: TITLES[indexForTitleAndPoster],
      alternativeTitle: TITLES[indexForTitleAndPoster],
      totalRating: getRandomFloat(TotalRating.MIN_RATING, TotalRating.MAX_RATING),
      poster: POSTERS[indexForTitleAndPoster],
      ageRating: `${getRandomInteger(AgeRating.MIN_AGE, AgeRating.MAX_AGE)}+`,
      director: getRandomArrayElement(PEOPLE),
      writers: getRandomArray(PEOPLE),
      actors: getRandomArray(PEOPLE),
      release: {
        date: dayjs().format(DATE_FORMAT),
        releaseCountry: getRandomArrayElement(COUNTRIES),
      },
      runtime: getDuration(),
      genre: getRandomArray(GENRES),
      description: getRandomArray(DESCRIPTION).slice(FIRST_INDEX, MAX_DESCRIPTION_LENGTH).join(' '),
    },
    userDetails: {
      watchlist: Boolean(getRandomInteger()),
      alreadyWatched,
      watchingDate: alreadyWatched ? dayjs().format(DATE_FORMAT) : null,
      favorite: Boolean(getRandomInteger()),
    },
  };
};
