import UserRatingView from './view/user-rating.js';
import SiteMenuView from './view/site-menu.js';
import SortView from './view/sort.js';
import ContentView from './view/content.js';
import FilmCardView from './view/film-card.js';
import ShowMoreView from './view/show-more.js';
import FooterStatisticsView from './view/footer-statistics.js';
import PopupView from './view/popup.js';
import {generateFilm} from './mock/film.js';
import {generateFilter} from './mock/filter.js';
import {renderElement} from './util.js';


const FIRST_INDEX = 0;

const bodyElement = document.querySelector('body');
const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

const FilmsCount = {
  CARD_COUNT: 20,
  SHOW_CARD_COUNT: 5,
  EXTRA_CARD_COUNT: 2,
};

const getData = () => new Array(FilmsCount.CARD_COUNT).fill().map(generateFilm);

const films = getData();
const filters = generateFilter(films);

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

const renderPopup = (film) => {
  const popup = new PopupView(film);

  const closePopup = () => {
    popup.getElement().remove();
    bodyElement.classList.remove('hide-overflow');
  };

  renderElement(mainElement, popup.getElement());
  bodyElement.classList.add('hide-overflow');
  popup.getElement().querySelector('.film-details__close-btn').addEventListener('click', () => {
    closePopup();
  });
};

const renderFilmCard = (container, film) => {
  const filmCard = new FilmCardView(film);

  filmCard.getElement().querySelector('.film-card__title').addEventListener('click', () => {
    renderElement(mainElement, renderPopup(film));
  });
  filmCard.getElement().querySelector('.film-card__poster').addEventListener('click', () => {
    renderElement(mainElement, renderPopup(film));
  });
  filmCard.getElement().querySelector('.film-card__comments').addEventListener('click', () => {
    renderElement(mainElement, renderPopup(film));
  });

  renderElement(container, filmCard.getElement());
};

const renderContent = () => {
  renderElement(mainElement, new ContentView().getElement());

  const filmsList = document.querySelector('.films-list');
  const filmsContainerAllMovies = document.querySelector('.films-list .films-list__container');
  const filmsContainerTopRated = document.querySelector('.films-list--top-rated .films-list__container');
  const filmsContainerMostCommented = document.querySelector('.films-list--most-commented .films-list__container');

  const ratedFilms = getRatedFilms();
  const commentedFilms = getCommentedFilms();

  films
    .slice(0, FilmsCount.SHOW_CARD_COUNT)
    .forEach((film) => renderFilmCard(filmsContainerAllMovies, film));
  ratedFilms.forEach((film) => renderFilmCard(filmsContainerTopRated, film));
  commentedFilms.forEach((film) => renderFilmCard(filmsContainerMostCommented, film));

  if (films.length > FilmsCount.SHOW_CARD_COUNT) {
    let renderedFilmsCount = FilmsCount.SHOW_CARD_COUNT;
    renderElement(filmsList, new ShowMoreView().getElement());

    const showMoreButton = mainElement.querySelector('.films-list__show-more');

    showMoreButton.addEventListener('click', (evt) => {
      evt.preventDefault();

      const moreFilms = getMoreFilms(renderedFilmsCount);
      moreFilms.forEach((film) => renderFilmCard(filmsContainerAllMovies, film));
      renderedFilmsCount += FilmsCount.SHOW_CARD_COUNT;

      if (renderedFilmsCount >= films.length) {
        showMoreButton.remove();
      }
    });
  }
};

renderElement(headerElement, new UserRatingView().getElement());
renderElement(mainElement, new SiteMenuView(filters).getElement());
renderElement(mainElement, new SortView().getElement());
renderContent();
renderElement(footerStatisticsElement, new FooterStatisticsView(films.length).getElement());
