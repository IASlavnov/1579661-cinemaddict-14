import {createUserRatingTemplate} from './view/user-rating.js';
import {createSiteMenuTemplate} from './view/site-menu.js';
import {createSortTemplate} from './view/sort.js';
import {createContentTemplate} from './view/content.js';
import {createFilmsContainerTemplate} from './view/films-container.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {createShowMoreTemplate} from './view/show-more.js';
import {createSiteFooterTemplate} from './view/site-footer.js';

const FilmsCount = {
  CARD_COUNT: 5,
  EXTRA_CARD_COUNT: 2,
};

const render = (container, template, place, amount = 1) => {
  for (let i = 0; i < amount; i++) {
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

  render(filmsContainerAllMovies, createFilmCardTemplate(), 'beforeend', FilmsCount.CARD_COUNT);
  render(filmsContainerTopRated, createFilmCardTemplate(), 'beforeend', FilmsCount.EXTRA_CARD_COUNT);
  render(filmsContainerMostCommented, createFilmCardTemplate(), 'beforeend', FilmsCount.EXTRA_CARD_COUNT);

  render(filmsContainerAllMovies, createShowMoreTemplate(), 'beforeend');
};

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

render(headerElement, createUserRatingTemplate(), 'beforeend');
render(mainElement, createSiteMenuTemplate(), 'beforeend');
render(mainElement, createSortTemplate(), 'beforeend');
renderContent();
render(footerElement, createSiteFooterTemplate(), 'beforeend');
