import {RatingScore, RatingType} from '../const.js';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

export const getUserRank = (films) => {
  const watchedFilmsCount = films.filter((film) => film.userDetails.alreadyWatched).length;

  if (!watchedFilmsCount) {
    return false;
  }

  if (watchedFilmsCount >= RatingScore.NOVICE.MIN && watchedFilmsCount <= RatingScore.NOVICE.MAX) {
    return RatingType.NOVICE;
  }

  if (watchedFilmsCount >= RatingScore.FAN.MIN && watchedFilmsCount <= RatingScore.FAN.MAX) {
    return RatingType.FAN;
  }

  if (watchedFilmsCount > RatingScore.FAN.MAX) {
    return RatingType.MOVIE_BUFF;
  }
};

export const getTotalDuration = (films) => {
  const totalDuration = films.reduce((duration, film) => {
    return duration + film.filmInfo.runtime;
  }, 0);
  return {
    HOURS: Math.floor(totalDuration / 60),
    MINUTES: totalDuration % 60,
  };
};

export const getGenresStatistics = (films) => {
  const genresStatistics = {};

  films
    .reduce((acc, film) => acc.concat(film.filmInfo.genre), [])
    .forEach((genre) => {
      if (genresStatistics[genre]) {
        genresStatistics[genre]++;
        return;
      }
      genresStatistics[genre] = 1;
    });

  return genresStatistics;
};

export const getTopGenre = (films) => {
  if (films.length === 0) {
    return '';
  }

  const genresStatistics = getGenresStatistics(films);
  const topGenreStatistics = Object.entries(genresStatistics).sort((a, b) => b[1] - a[1])[0];
  const topGenreName = topGenreStatistics[0];
  return topGenreName;
};

export const filterByDate = (films, filterType) => {
  return films.filter((film) => {
    const startDate = filterType === 'day' ? dayjs().startOf('day') : dayjs().startOf('day').subtract(1, filterType);
    return dayjs(film.userDetails.watchingDate).isBetween(startDate, dayjs());
  });
};
