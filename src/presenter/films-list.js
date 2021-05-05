import SortView from '../view/sort.js';
import ContentView from '../view/content.js';
import ContentEmptyView from '../view/content-empty.js';
import ShowMoreView from '../view/show-more.js';
import FilmPresenter from './film.js';
import {render, remove, updateItem} from '../util.js';

const FIRST_INDEX = 0;
const SHOW_CARD_COUNT = 5;
const EXTRA_CARD_COUNT = 2;

export default class FilmsList {
  constructor(container) {
    this._container = container;
    this._renderedFilmsCount = SHOW_CARD_COUNT;
    this._filmCardPresenter = {};

    this._sortComponent = new SortView();
    this._contentComponent = new ContentView();
    this._contentEmptyComponent = new ContentEmptyView();
    this._showMoreButtonComponent = new ShowMoreView();

    this._handleFilmCardChange = this._handleFilmCardChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
  }

  init(films) {
    this._films = films.slice();
    // this._commentedFilms = null;
    // this._ratedFilms = null;
    this._renderSort();
    this._films.length ?
      this._renderContent() :
      this._renderEmptyContent();
  }

  _renderSort() {
    render(this._container, this._sortComponent);
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
    const commentedFilms = this._films.slice().sort((a, b) => b.comments.length - a.comments.length);
    // this._commentedFilms = this._films.slice().sort((a, b) => b.comments.length - a.comments.length);

    this._renderFilmCards(
      commentedFilms,
      this._contentComponent.getElement().querySelector('.films-list--most-commented .films-list__container'),
      FIRST_INDEX, Math.min(this._films.length, EXTRA_CARD_COUNT),
    );
  }

  _renderTopRatedFilms() {
    const ratedFilms = this._films.slice().sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
    // this._ratedFilms = this._films.slice().sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);

    this._renderFilmCards(
      ratedFilms,
      this._contentComponent.getElement().querySelector('.films-list--top-rated .films-list__container'),
      FIRST_INDEX, Math.min(this._films.length, EXTRA_CARD_COUNT),
    );
  }

  _renderFilmCards(films, container, from, to) {
    films
      .slice(from, to)
      .forEach((film) => this._renderFilmCard(container, film));
  }

  _renderFilmCard(container, film) {
    const filmCardPresenter = new FilmPresenter(container, this._handleFilmCardChange, this._handleModeChange);
    filmCardPresenter.init(film);
    this._filmCardPresenter[film.id] = filmCardPresenter;
  }

  _clearFilmsList() {
    Object
      .values(this._filmCardPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmCardPresenter = {};
    this._renderedFilmsCount = SHOW_CARD_COUNT;
    remove(this._showMoreButtonComponent);
  }

  _handleFilmCardChange(updatedFilmCard) {
    this._films = updateItem(this._films, updatedFilmCard);
    this._filmCardPresenter[updatedFilmCard.id].init(updatedFilmCard);
  }

  _handleModeChange() {
    Object
      .values(this._filmCardPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleShowMoreButtonClick() {
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

  _renderShowMoreButton() {
    render(this._contentComponent.getElement().querySelector('.films-list'), this._showMoreButtonComponent);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }
}
