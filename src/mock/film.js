import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {getRandomInteger, getRandomFloat, getRandomArrayElement, getRandomArray} from '../util.js';
import {generateComment} from './comment.js';
import {TITLES, POSTERS, PEOPLE, COUNTRIES, GENRES, DESCRIPTION, MAX_DESCRIPTION_LENGTH, FilmDuration} from './const.js';

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

export const generateFilm = () => {
  const indexForTitleAndPoster = getRandomInteger(0, TITLES.length - 1);
  const alreadyWatched = Boolean(getRandomInteger());

  return {
    id: nanoid(),
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
        date: dayjs(),
        releaseCountry: getRandomArrayElement(COUNTRIES),
      },
      runtime: getRandomInteger(FilmDuration.MIN_DURATION, FilmDuration.MAX_DURATION),
      genre: getRandomArray(GENRES),
      description: getRandomArray(DESCRIPTION).slice(FIRST_INDEX, MAX_DESCRIPTION_LENGTH).join(' '),
    },
    userDetails: {
      watchlist: Boolean(getRandomInteger()),
      alreadyWatched,
      watchingDate: alreadyWatched ? dayjs() : null,
      favorite: Boolean(getRandomInteger()),
    },
  };
};
