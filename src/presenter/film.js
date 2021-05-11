import FilmCardView from '../view/film-card.js';
import PopupView from '../view/popup.js';
import {render, replace, remove} from '../util.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

export default class FilmPresenter {
  constructor(container, changeData, changeMode) {
    this._container = container;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmCardComponent = null;
    this._popupComponent = null;
    this._mode = Mode.DEFAULT;
    this._bodyElement = document.body;

    this._showPopupHandler = this._showPopupHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._closePopupHandler = this._closePopupHandler.bind(this);
    this._clickWatchlistHandler = this._clickWatchlistHandler.bind(this);
    this._clickWatchedHandler = this._clickWatchedHandler.bind(this);
    this._clickFavoriteHandler = this._clickFavoriteHandler.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmCardComponent = this._filmCardComponent;

    this._filmCardComponent = new FilmCardView(this._film);
    this._filmCardComponent.setShowPopupHandler(this._showPopupHandler);
    this._filmCardComponent.setWatchlistClickHandler(this._clickWatchlistHandler);
    this._filmCardComponent.setWatchedClickHandler(this._clickWatchedHandler);
    this._filmCardComponent.setFavoriteClickHandler(this._clickFavoriteHandler);

    if (prevFilmCardComponent === null) {
      render(this._container, this._filmCardComponent);
      return;
    }

    if (this._container.contains(prevFilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    remove(prevFilmCardComponent);
  }

  getFilm() {
    return this._film;
  }

  destroy() {
    remove(this._filmCardComponent);
  }

  _renderPopup() {
    this._changeMode();
    this._mode = Mode.POPUP;

    const prevPopupComponent = this._popupComponent;

    this._popupComponent = new PopupView(this._film);
    this._popupComponent.setClosePopupHandler(this._closePopupHandler);
    this._popupComponent.setWatchlistClickHandler(this._clickWatchlistHandler);
    this._popupComponent.setWatchedClickHandler(this._clickWatchedHandler);
    this._popupComponent.setFavoriteClickHandler(this._clickFavoriteHandler);

    if (prevPopupComponent === null) {
      render(this._bodyElement, this._popupComponent);
      this._bodyElement.classList.add('hide-overflow');
      document.addEventListener('keydown', this._escKeyDownHandler);
      return;
    }

    if (this._mode === Mode.POPUP) {
      replace(this._popupComponent, prevPopupComponent);
      this._bodyElement.classList.add('hide-overflow');
      document.addEventListener('keydown', this._escKeyDownHandler);
    }

    remove(prevPopupComponent);
  }

  _closePopup() {
    if (this._mode !== Mode.DEFAULT) {
      this._popupComponent.getElement().remove();
      this._bodyElement.classList.remove('hide-overflow');
      this._popupComponent = null;
      document.removeEventListener('keydown', this._escKeyDownHandler);
      this._mode = Mode.DEFAULT;
    }
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
  }

  _showPopupHandler() {
    this._renderPopup();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closePopup();
    }
  }

  _closePopupHandler() {
    this._closePopup();
  }

  _clickWatchlistHandler() {
    const updatedUserDetails = Object.assign({}, this._film.userDetails, {watchlist: !this._film.userDetails.watchlist});
    this._changeData(Object.assign({}, this._film, {userDetails: updatedUserDetails}));
  }

  _clickWatchedHandler() {
    const updatedUserDetails = Object.assign({}, this._film.userDetails, {alreadyWatched: !this._film.userDetails.alreadyWatched});
    this._changeData(Object.assign({}, this._film, {userDetails: updatedUserDetails}));
  }

  _clickFavoriteHandler() {
    const updatedUserDetails = Object.assign({}, this._film.userDetails, {favorite: !this._film.userDetails.favorite});
    this._changeData(Object.assign({}, this._film, {userDetails: updatedUserDetails}));
  }
}
