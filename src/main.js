import UserRatingView from './view/user-rating.js';
import SiteMenuView from './view/site-menu.js';
import FooterStatisticsView from './view/footer-statistics.js';
import FilmsListPresenter from './presenter/films-list.js';
import {generateFilm} from './mock/film.js';
import {generateFilter} from './mock/filter.js';
import {render} from './util.js';

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

const CARD_COUNT = 20;

const getData = () => new Array(CARD_COUNT).fill().map(generateFilm);

const films = getData();
const filters = generateFilter(films);

render(headerElement, new UserRatingView());
render(mainElement, new SiteMenuView(filters));
const filmsListPresenter = new FilmsListPresenter(mainElement);
filmsListPresenter.init(films);
render(footerStatisticsElement, new FooterStatisticsView(films.length));
