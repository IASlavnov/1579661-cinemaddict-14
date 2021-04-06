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

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const renderContent = () => {
  render(siteMainElement, createContentTemplate(), 'beforeend');

  const siteFilmListElements = document.querySelectorAll('.films-list');

  for (const section of siteFilmListElements) {
    render(section, createFilmsContainerTemplate(), 'beforeend');
  }

  const siteFilmsContainerElements = document.querySelectorAll('.films-list__container');

  for (let i = 0; i < FilmsCount.CARD_COUNT; i++) {
    render(siteFilmsContainerElements[0], createFilmCardTemplate(), 'beforeend');
  }

  for (let i = 0; i < FilmsCount.EXTRA_CARD_COUNT; i++) {
    render(siteFilmsContainerElements[1], createFilmCardTemplate(), 'beforeend');
  }

  for (let i = 0; i < FilmsCount.EXTRA_CARD_COUNT; i++) {
    render(siteFilmsContainerElements[2], createFilmCardTemplate(), 'beforeend');
  }

  render(siteFilmsContainerElements[0], createShowMoreTemplate(), 'beforeend');
};

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

render(siteHeaderElement, createUserRatingTemplate(), 'beforeend');
render(siteMainElement, createSiteMenuTemplate(), 'beforeend');
render(siteMainElement, createSortTemplate(), 'beforeend');
renderContent();

render(siteFooterElement, createSiteFooterTemplate(), 'beforeend');
