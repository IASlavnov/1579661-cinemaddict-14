import AbstractView from './abstract.js';

const createFilmCardTemplate = (film) => {
  const comments = film.comments;
  const {title, poster, totalRating, release, runtime, genre, description} = film.filmInfo;
  const {watchlist, alreadyWatched, favorite} = film.userDetails;

  const MAX_DESCRIPTION_LENGTH = 140;

  const setActiveClass = (flag) => {
    return flag ? 'film-card__controls-item--active' : '';
  };

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${release.date.slice(-4)}</span>
      <span class="film-card__duration">${runtime}</span>
      <span class="film-card__genre">${genre[0]}</span>
    </p>
    <img src="./images/posters/${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${description.length > MAX_DESCRIPTION_LENGTH ? description.substring(0, MAX_DESCRIPTION_LENGTH - 1) + '...' : description}</p>
    <a class="film-card__comments">${comments.length} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${setActiveClass(watchlist)}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${setActiveClass(alreadyWatched)}" type="button">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${setActiveClass(favorite)}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._showPopupHandler = this._showPopupHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _showPopupHandler(evt) {
    evt.preventDefault();
    this._callback.showPopup();
  }

  _watchlistClickHandler() {
    this._callback.watchlistClick();
  }

  _watchedClickHandler() {
    this._callback.watchedClick();
  }

  _favoriteClickHandler() {
    this._callback.favoriteClick();
  }

  setShowPopupHandler(callback) {
    this._callback.showPopup = callback;
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._showPopupHandler);
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._showPopupHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._showPopupHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._watchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._favoriteClickHandler);
  }
}
