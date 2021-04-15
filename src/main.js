import {createUserRatingTemplate} from './view/user-rating.js';
import {createSiteMenuTemplate} from './view/site-menu.js';
import {createSortTemplate} from './view/sort.js';
import {createContentTemplate} from './view/content.js';
import {createFilmsContainerTemplate} from './view/films-container.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {createShowMoreTemplate} from './view/show-more.js';
import {createSiteFooterTemplate} from './view/site-footer.js';
import {generateFilm} from './mock/film.js';
import {generateFilter} from './mock/filter.js';
// import { createPopupTemplate } from './view/popup.js';

const FilmsCount = {
  CARD_COUNT: 20,
  SHOW_CARD_COUNT: 5,
  EXTRA_CARD_COUNT: 2,
};

const films = new Array(FilmsCount.CARD_COUNT).fill().map(generateFilm);
const filters = generateFilter(films);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const renderFilms = (container, films, place, amount) => {
  for (let i = 0; i < amount; i++) {
    const template = createFilmCardTemplate(films[i]);
    container.insertAdjacentHTML(place, template);
  }
};

const renderContent = () => {
  render(mainElement, createContentTemplate(), 'beforeend');

  const filmsListElements = document.querySelectorAll('.films-list');
  filmsListElements.forEach((element) => render(element, createFilmsContainerTemplate(), 'beforeend'));

  const filmsContainerAllMovies = document.querySelector('.films-list .films-list__container');
  const filmsContainerTopRated = document.querySelector('.films-list--top-rated .films-list__container');
  const filmsContainerMostCommented = document.querySelector('.films-list--most-commented .films-list__container');

  renderFilms(filmsContainerAllMovies, films, 'beforeend', FilmsCount.SHOW_CARD_COUNT);

  const ratedFilms = films.slice().sort((a, b) => {
    return b.filmInfo.totalRating - a.filmInfo.totalRating;
  });
  renderFilms(filmsContainerTopRated, ratedFilms, 'beforeend', FilmsCount.EXTRA_CARD_COUNT);

  const commentedFilms = films.slice().sort((a, b) => {
    return b.comments.length - a.comments.length;
  });
  renderFilms(filmsContainerMostCommented, commentedFilms, 'beforeend', FilmsCount.EXTRA_CARD_COUNT);

  if (films.length > FilmsCount.SHOW_CARD_COUNT) {
    let renderedFilmsCount = FilmsCount.SHOW_CARD_COUNT;
    render(filmsContainerAllMovies, createShowMoreTemplate(), 'afterend');

    const showMoreButton = filmsListElements[0].querySelector('.films-list__show-more');

    showMoreButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      const moreFilms = films.slice(renderedFilmsCount, renderedFilmsCount + FilmsCount.SHOW_CARD_COUNT);
      renderFilms(filmsContainerAllMovies, moreFilms, 'beforeend', FilmsCount.SHOW_CARD_COUNT);

      renderedFilmsCount += FilmsCount.SHOW_CARD_COUNT;

      if (renderedFilmsCount >= films.length) {
        showMoreButton.remove();
      }
    });
  }
};

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

render(headerElement, createUserRatingTemplate(), 'beforeend');
render(mainElement, createSiteMenuTemplate(filters), 'beforeend');
render(mainElement, createSortTemplate(), 'beforeend');
renderContent();
render(footerElement, createSiteFooterTemplate(films.length), 'beforeend');
// render(mainElement, createPopupTemplate(films[0]), 'beforeend');
