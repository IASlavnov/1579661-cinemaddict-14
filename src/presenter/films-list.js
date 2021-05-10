import SortView from '../view/sort.js';
import ContentView from '../view/content.js';
import ContentEmptyView from '../view/content-empty.js';
import ShowMoreView from '../view/show-more.js';
import FilmPresenter from './film.js';
import {render, remove, updateItem, sortByDate, sortByRating, sortByComments} from '../util.js';
import {SortType} from '../const.js';

const FIRST_INDEX = 0;
const TOP_RATED_INDEX = 1;
const MOST_COMMENTED_INDEX = 2;
const SHOW_CARD_COUNT = 5;
const EXTRA_CARD_COUNT = 2;

export default class FilmsListPresenter {
  constructor(container) {
    this._container = container;
    this._renderedFilmsCount = SHOW_CARD_COUNT;
    this._filmCardPresenters = [
      [], [], [],
    ];
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = new SortView();
    this._contentComponent = new ContentView();
    this._contentEmptyComponent = new ContentEmptyView();
    this._showMoreButtonComponent = new ShowMoreView();

    this._changeFilmCardHandler = this._changeFilmCardHandler.bind(this);
    this._changeModeHandler = this._changeModeHandler.bind(this);
    this._showMoreButtonHandler = this._showMoreButtonHandler.bind(this);
    this._changeSortTypeHandler = this._changeSortTypeHandler.bind(this);
  }

  init(films) {
    this._films = films.slice();
    this._sourcedFilms = films.slice();
    this._renderSort();
    this._films.length ?
      this._renderContent() :
      this._renderEmptyContent();
  }

  _renderSort() {
    render(this._container, this._sortComponent);
    this._sortComponent.setChangeSortTypeHandler(this._changeSortTypeHandler);
  }

  _renderContent() {
    render(this._container, this._contentComponent);

    this._renderFilmCards(
      this._films,
      this._contentComponent.getElement().querySelector('.films-list .films-list__container'),
      FIRST_INDEX, Math.min(this._films.length, SHOW_CARD_COUNT),
    );

    if (this._films.length > SHOW_CARD_COUNT) {
      this._renderShowMoreButton();
    }

    this._renderTopRatedFilms();
    this._renderMostCommentedFilms();
  }

  _renderEmptyContent() {
    render(this._container, this._contentEmptyComponent);
  }

  _renderMostCommentedFilms() {
    const commentedFilms = this._films.slice().sort(sortByComments);

    this._renderFilmCards(
      commentedFilms,
      this._contentComponent.getElement().querySelector('.films-list__container--most-commented'),
      FIRST_INDEX, Math.min(this._films.length, EXTRA_CARD_COUNT),
    );
  }

  _renderTopRatedFilms() {
    const ratedFilms = this._films.slice().sort(sortByRating);

    this._renderFilmCards(
      ratedFilms,
      this._contentComponent.getElement().querySelector('.films-list__container--top-rated'),
      FIRST_INDEX, Math.min(this._films.length, EXTRA_CARD_COUNT),
    );
  }

  _renderFilmCards(films, container, from, to) {
    films
      .slice(from, to)
      .forEach((film) => this._renderFilmCard(container, film));
  }

  _renderFilmCard(container, film) {
    const filmCardPresenter = new FilmPresenter(container, this._changeFilmCardHandler, this._changeModeHandler);
    filmCardPresenter.init(film);

    if (container.classList.contains('films-list__container--top-rated')) {
      this._filmCardPresenters[TOP_RATED_INDEX].push(filmCardPresenter);
    } else if (container.classList.contains('films-list__container--most-commented')) {
      this._filmCardPresenters[MOST_COMMENTED_INDEX].push(filmCardPresenter);
    } else {
      this._filmCardPresenters[FIRST_INDEX].push(filmCardPresenter);
    }
  }

  _clearFilmsList() {
    this._filmCardPresenters.forEach((filmCardPresenter) => {
      filmCardPresenter.forEach((presenter) => presenter.destroy());
    });
    this._filmCardPresenters = [
      [], [], [],
    ];
    this._renderedFilmsCount = SHOW_CARD_COUNT;
    remove(this._showMoreButtonComponent);
  }

  _changeFilmCardHandler(updatedFilmCard) {
    this._films = updateItem(this._films, updatedFilmCard);
    this._sourcedFilms = updateItem(this._sourcedFilms, updatedFilmCard);

    this._filmCardPresenters.forEach((filmCardPresenter) => {
      const filmCardForUpdate = filmCardPresenter.find((presenter) => presenter.getFilm().id === updatedFilmCard.id);
      if (filmCardForUpdate) {
        filmCardForUpdate.init(updatedFilmCard);
      }
    });
  }

  _changeModeHandler() {
    this._filmCardPresenters.forEach((filmCardPresenter) => {
      filmCardPresenter.forEach((presenter) => presenter.resetView());
    });
  }

  _showMoreButtonHandler() {
    this._renderFilmCards(
      this._films,
      this._contentComponent.getElement().querySelector('.films-list .films-list__container'),
      this._renderedFilmsCount, this._renderedFilmsCount + SHOW_CARD_COUNT,
    );

    this._renderedFilmsCount += SHOW_CARD_COUNT;

    if (this._renderedFilmsCount >= this._films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _changeSortTypeHandler(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearFilmsList();
    this._renderContent();
  }

  _sortFilms(sortType) {
    switch(sortType) {
      case SortType.DATE:
        this._films.sort(sortByDate);
        break;
      case SortType.RATING:
        this._films.sort(sortByRating);
        break;
      default:
        this._films = this._sourcedFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _renderShowMoreButton() {
    render(this._contentComponent.getElement().querySelector('.films-list'), this._showMoreButtonComponent);
    this._showMoreButtonComponent.setClickHandler(this._showMoreButtonHandler);
  }
}
