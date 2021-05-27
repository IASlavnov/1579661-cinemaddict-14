import SortView from '../view/sort.js';
import ContentView from '../view/content.js';
import ContentEmptyView from '../view/content-empty.js';
import ShowMoreView from '../view/show-more.js';
import FilmPresenter from './film.js';
import {render, remove, sortByDate, sortByRating, sortByComments} from '../util.js';
import {filter} from '../utils/filter.js';
import {SortType, UpdateType} from '../const.js';

const FIRST_INDEX = 0;
const TOP_RATED_INDEX = 1;
const MOST_COMMENTED_INDEX = 2;
const SHOW_CARD_COUNT = 5;
const EXTRA_CARD_COUNT = 2;

export default class FilmsListPresenter {
  constructor(container, filmsModel, filterModel) {
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._container = container;
    this._renderedFilmsCount = SHOW_CARD_COUNT;
    this._filmCardPresenters = [
      [], [], [],
    ];
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = null;
    this._showMoreButtonComponent = null;

    this._contentComponent = new ContentView();
    this._contentEmptyComponent = new ContentEmptyView();

    this._actionViewHandler = this._actionViewHandler.bind(this);
    this._eventModelHandler = this._eventModelHandler.bind(this);
    this._changeModeHandler = this._changeModeHandler.bind(this);
    this._showMoreButtonHandler = this._showMoreButtonHandler.bind(this);
    this._changeSortTypeHandler = this._changeSortTypeHandler.bind(this);
  }

  init() {
    this._renderBoard();

    this._filmsModel.addObserver(this._eventModelHandler);
    this._filterModel.addObserver(this._eventModelHandler);
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = filter[filterType](films);

    switch(this._currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortByDate);
      case SortType.RATING:
        return filteredFilms.sort(sortByRating);
    }

    return filteredFilms;
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setChangeSortTypeHandler(this._changeSortTypeHandler);

    render(this._container, this._sortComponent);
  }

  _renderContent() {
    render(this._container, this._contentComponent);
    const filmsCount = this._getFilms().length;
    const films = this._getFilms().slice(FIRST_INDEX, Math.min(filmsCount, this._renderedFilmsCount));

    this._renderFilmCards(films, this._contentComponent.getElement().querySelector('.films-list .films-list__container'));
    this._renderTopRatedFilms();
    this._renderMostCommentedFilms();
  }

  _renderEmptyContent() {
    render(this._container, this._contentEmptyComponent);
  }

  _renderMostCommentedFilms() {
    const commentedFilms = this._getFilms()
      .slice()
      .sort(sortByComments)
      .slice(FIRST_INDEX, Math.min(this._getFilms().length, EXTRA_CARD_COUNT));

    this._renderFilmCards(
      commentedFilms,
      this._contentComponent.getElement().querySelector('.films-list__container--most-commented'),
    );
  }

  _renderTopRatedFilms() {
    const ratedFilms = this._getFilms()
      .slice()
      .sort(sortByRating)
      .slice(FIRST_INDEX, Math.min(this._getFilms().length, EXTRA_CARD_COUNT));

    this._renderFilmCards(
      ratedFilms,
      this._contentComponent.getElement().querySelector('.films-list__container--top-rated'),
    );
  }

  _renderFilmCards(films, container) {
    films.forEach((film) => this._renderFilmCard(container, film));
  }

  _renderFilmCard(container, film) {
    const filmCardPresenter = new FilmPresenter(container, this._actionViewHandler, this._changeModeHandler, this._filmsModel);
    filmCardPresenter.init(film);

    if (container.classList.contains('films-list__container--top-rated')) {
      this._filmCardPresenters[TOP_RATED_INDEX].push(filmCardPresenter);
    } else if (container.classList.contains('films-list__container--most-commented')) {
      this._filmCardPresenters[MOST_COMMENTED_INDEX].push(filmCardPresenter);
    } else {
      this._filmCardPresenters[FIRST_INDEX].push(filmCardPresenter);
    }
  }

  _clearBoard({resetRenderedFilmsCount = false, resetSortType = false} = {}) {
    const filmsCount = this._getFilms().length;

    this._filmCardPresenters.forEach((filmCardPresenter) => {
      filmCardPresenter.forEach((presenter) => presenter.destroy());
    });
    this._filmCardPresenters = [
      [], [], [],
    ];

    remove(this._sortComponent);
    remove(this._contentEmptyComponent);
    remove(this._showMoreButtonComponent);

    if (resetRenderedFilmsCount) {
      this._renderedFilmsCount = SHOW_CARD_COUNT;
    } else {
      this._renderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderBoard() {
    const films = this._getFilms();
    const filmsCount = films.length;

    if (filmsCount === 0) {
      this._renderEmptyContent();
      return;
    }

    this._renderSort();
    this._renderContent();

    if (filmsCount > this._renderedFilmsCount) {
      this._renderShowMoreButton();
    }
  }

  destroy() {
    this._clearBoard({resetRenderedFilmsCount: true, resetSortType: true});

    remove(this._contentComponent);

    this._filmsModel.removeObserver(this._eventModelHandler);
    this._filterModel.removeObserver(this._eventModelHandler);
  }

  _actionViewHandler(updateType, update) {
    this._filmsModel.updateFilm(updateType, update);
  }

  _eventModelHandler(updateType, data) {
    switch(updateType) {
      case UpdateType.PATCH:
        this._filmCardPresenters.forEach((filmCardPresenter) => {
          const filmCardForUpdate = filmCardPresenter.find((presenter) => presenter.getFilm().id === data.id);
          if (filmCardForUpdate) {
            filmCardForUpdate.init(data);
          }
        });
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetRenderedFilmsCount: true, resetSortType: true});
        this._renderBoard();
        break;
    }
  }

  _changeModeHandler() {
    this._filmCardPresenters.forEach((filmCardPresenter) => {
      filmCardPresenter.forEach((presenter) => presenter.resetView());
    });
  }

  _showMoreButtonHandler() {
    const filmsCount = this._getFilms().length;
    const newRenderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount + SHOW_CARD_COUNT);
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmsCount);

    this._renderFilmCards(films, this._contentComponent.getElement().querySelector('.films-list .films-list__container'));

    this._renderedFilmsCount = newRenderedFilmsCount;

    if (this._renderedFilmsCount >= filmsCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _changeSortTypeHandler(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard({resetRenderedTaskCount: true});
    this._renderBoard();
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreView();
    this._showMoreButtonComponent.setClickHandler(this._showMoreButtonHandler);

    render(this._contentComponent.getElement().querySelector('.films-list'), this._showMoreButtonComponent);
  }
}
