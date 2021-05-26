import UserRatingPresenter from './presenter/user-rating.js';
import FooterStatisticsView from './view/footer-statistics.js';
import FilmsListPresenter from './presenter/films-list.js';
import FilterPresenter from './presenter/filter.js';
import {generateFilm} from './mock/film.js';
import {remove, render} from './util.js';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import {MenuItem} from './const.js';
import StatisticsView from './view/statistics.js';

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

const CARD_COUNT = 20;

const getData = () => new Array(CARD_COUNT).fill().map(generateFilm);
const films = getData();

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);
const filterModel = new FilterModel();

let statisticsComponent = null;

const changeMenuSection = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILMS:
      remove(statisticsComponent);
      filmsListPresenter.destroy();
      filmsListPresenter.init();
      break;
    case MenuItem.STATS:
      filmsListPresenter.destroy();
      statisticsComponent = new StatisticsView(filmsModel.getFilms());
      render(mainElement, statisticsComponent);
      break;
  }
};

const userRatingPresenter = new UserRatingPresenter(headerElement, filmsModel);
const filmsListPresenter = new FilmsListPresenter(mainElement, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(mainElement, filterModel, filmsModel, changeMenuSection);
userRatingPresenter.init();
filterPresenter.init();
filmsListPresenter.init();
render(footerStatisticsElement, new FooterStatisticsView(films.length));
