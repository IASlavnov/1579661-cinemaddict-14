import UserRatingView from './view/user-rating.js';
import FooterStatisticsView from './view/footer-statistics.js';
import FilmsListPresenter from './presenter/films-list.js';
import FilterPresenter from './presenter/filter.js';
import {generateFilm} from './mock/film.js';
import {render} from './util.js';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

const CARD_COUNT = 20;

const getData = () => new Array(CARD_COUNT).fill().map(generateFilm);
const films = getData();

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);
const filterModel = new FilterModel();

render(headerElement, new UserRatingView());
const filmsListPresenter = new FilmsListPresenter(mainElement, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(mainElement, filterModel, filmsModel);
filterPresenter.init();
filmsListPresenter.init();
render(footerStatisticsElement, new FooterStatisticsView(films.length));
