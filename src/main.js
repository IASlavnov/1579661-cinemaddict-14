import UserRatingView from './view/user-rating.js';
import SiteMenuView from './view/site-menu.js';
import SortView from './view/sort.js';
import ContentView from './view/content.js';
import ContentEmptyView from './view/content-empty.js';
import FilmCardView from './view/film-card.js';
import ShowMoreView from './view/show-more.js';
import FooterStatisticsView from './view/footer-statistics.js';
import PopupView from './view/popup.js';
import {generateFilm} from './mock/film.js';
import {generateFilter} from './mock/filter.js';
import {renderElement, remove} from './util.js';

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
    document.removeEventListener('keydown', onPopupEscKeydown);
  };

  const onPopupEscKeydown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      closePopup();
    }
  };

  renderElement(mainElement, popup);
  bodyElement.classList.add('hide-overflow');

  popup.setClosePopupHandler(closePopup);

  document.addEventListener('keydown', onPopupEscKeydown);
};

const renderFilmCard = (container, film) => {
  const filmCard = new FilmCardView(film);

  filmCard.setShowPopupHandler(() => {
    renderElement(mainElement, renderPopup(film));
  });

  renderElement(container, filmCard);
};

const renderContent = () => {
  films.length ?
    renderElement(mainElement, new ContentView()) :
    renderElement(mainElement, new ContentEmptyView());

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
    const showMoreButton = new ShowMoreView();
    renderElement(filmsList, showMoreButton);

    showMoreButton.setClickHandler(() => {
      const moreFilms = getMoreFilms(renderedFilmsCount);
      moreFilms.forEach((film) => renderFilmCard(filmsContainerAllMovies, film));
      renderedFilmsCount += FilmsCount.SHOW_CARD_COUNT;

      if (renderedFilmsCount >= films.length) {
        remove(showMoreButton);
      }
    });
  }
};

renderElement(headerElement, new UserRatingView());
renderElement(mainElement, new SiteMenuView(filters));
renderElement(mainElement, new SortView());
renderContent();
renderElement(footerStatisticsElement, new FooterStatisticsView(films.length));
