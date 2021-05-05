import FilmCardView from '../view/film-card.js';
import PopupView from '../view/popup.js';
import {render, replace, remove} from '../util.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

export default class Film {
  constructor(container, changeData, changeMode) {
    this._container = container;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmCardComponent = null;
    this._popupComponent = null;
    this._mode = Mode.DEFAULT;
    this._bodyElement = document.body;

    this._handleShowPopupClick = this._handleShowPopupClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleClosePopupClick = this._handleClosePopupClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmCardComponent = this._filmCardComponent;

    this._filmCardComponent = new FilmCardView(this._film);
    this._filmCardComponent.setShowPopupHandler(this._handleShowPopupClick);
    this._filmCardComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmCardComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevFilmCardComponent === null) {
      render(this._container, this._filmCardComponent);
      return;
    }

    if (this._container.contains(prevFilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    remove(prevFilmCardComponent);
  }

  destroy() {
    remove(this._filmCardComponent);
    // remove(this._popupComponent); ?
  }

  _renderPopup() {
    this._changeMode();
    this._mode = Mode.POPUP;

    const prevPopupComponent = this._popupComponent;

    this._popupComponent = new PopupView(this._film);
    this._popupComponent.setClosePopupHandler(this._handleClosePopupClick);
    this._popupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._popupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._popupComponent.setFavoriteClickHandler(this._handleFavoriteClick);

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

  _handleShowPopupClick() {
    this._renderPopup();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closePopup();
    }
  }

  _handleClosePopupClick() {
    this._closePopup();
  }

  _handleWatchlistClick() {
    const updatedUserDetails = Object.assign({}, this._film.userDetails, {watchlist: !this._film.userDetails.watchlist});
    this._changeData(Object.assign({}, this._film, {userDetails: updatedUserDetails}));
  }

  _handleWatchedClick() {
    const updatedUserDetails = Object.assign({}, this._film.userDetails, {alreadyWatched: !this._film.userDetails.alreadyWatched});
    this._changeData(Object.assign({}, this._film, {userDetails: updatedUserDetails}));
  }

  _handleFavoriteClick() {
    const updatedUserDetails = Object.assign({}, this._film.userDetails, {favorite: !this._film.userDetails.favorite});
    this._changeData(Object.assign({}, this._film, {userDetails: updatedUserDetails}));
  }
}
