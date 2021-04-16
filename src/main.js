import {createUserRatingTemplate} from './view/user-rating.js';
import {createSiteMenuTemplate} from './view/site-menu.js';
import {createSortTemplate} from './view/sort.js';
import {createContentTemplate} from './view/content.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {createShowMoreTemplate} from './view/show-more.js';
import {createSiteFooterTemplate} from './view/site-footer.js';
import {generateFilm} from './mock/film.js';
import {generateFilter} from './mock/filter.js';
// Временно для отрисовки и проверки попапа с фильмом
// import { createPopupTemplate } from './view/popup.js';

const FIRST_INDEX = 0;

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const FilmsCount = {
  CARD_COUNT: 20,
  SHOW_CARD_COUNT: 5,
  EXTRA_CARD_COUNT: 2,
};

const getData = () => new Array(FilmsCount.CARD_COUNT).fill().map(generateFilm);

const films = getData();
const filters = generateFilter(films);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const renderFilms = (containter, films, place) => {
  films.forEach((film) => {
    const template = createFilmCardTemplate(film);
    containter.insertAdjacentHTML(place, template);
  });
};

const getRatedFilms = () => {
  return films
    .slice()
    .sort((a, b) => {
      return b.filmInfo.totalRating - a.filmInfo.totalRating;
    })
    .slice(FIRST_INDEX, FilmsCount.EXTRA_CARD_COUNT);
};

const getCommentedFilms = () => {
  return films
    .slice()
    .sort((a, b) => {
      return b.comments.length - a.comments.length;
    })
    .slice(FIRST_INDEX, FilmsCount.EXTRA_CARD_COUNT);
};

const getMoreFilms = (count) => {
  return films
    .slice(count, count + FilmsCount.SHOW_CARD_COUNT);
};

const renderContent = () => {
  render(mainElement, createContentTemplate(), 'beforeend');

  const filmsContainerAllMovies = document.querySelector('.films-list .films-list__container');
  const filmsContainerTopRated = document.querySelector('.films-list--top-rated .films-list__container');
  const filmsContainerMostCommented = document.querySelector('.films-list--most-commented .films-list__container');

  const ratedFilms = getRatedFilms();
  const commentedFilms = getCommentedFilms();

  renderFilms(filmsContainerAllMovies, films.slice(0, FilmsCount.SHOW_CARD_COUNT), 'beforeend');
  renderFilms(filmsContainerTopRated, ratedFilms, 'beforeend');
  renderFilms(filmsContainerMostCommented, commentedFilms, 'beforeend');

  if (films.length > FilmsCount.SHOW_CARD_COUNT) {
    let renderedFilmsCount = FilmsCount.SHOW_CARD_COUNT;
    render(filmsContainerAllMovies, createShowMoreTemplate(), 'afterend');

    const showMoreButton = mainElement.querySelector('.films-list__show-more');

    showMoreButton.addEventListener('click', (evt) => {
      evt.preventDefault();

      const moreFilms = getMoreFilms(renderedFilmsCount);
      renderFilms(filmsContainerAllMovies, moreFilms, 'beforeend');
      renderedFilmsCount += FilmsCount.SHOW_CARD_COUNT;

      if (renderedFilmsCount >= films.length) {
        showMoreButton.remove();
      }
    });
  }
};

render(headerElement, createUserRatingTemplate(), 'beforeend');
render(mainElement, createSiteMenuTemplate(filters), 'beforeend');
render(mainElement, createSortTemplate(), 'beforeend');
renderContent();
render(footerElement, createSiteFooterTemplate(films.length), 'beforeend');

// Временно для отрисовки и проверки попапа с фильмом
// render(mainElement, createPopupTemplate(films[0]), 'beforeend');
