import SmartView from './smart.js';
import {getDuration, getCommentDate, getFormatDate} from '../util.js';
import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import he from 'he';

const renderComments = (comments) => {
  return comments
    .map((comment) => {
      return `<li class="film-details__comment" data-id="${comment.id}">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${he.encode(comment.comment)}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${comment.author}</span>
        <span class="film-details__comment-day">${getCommentDate(comment.date)}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;
    })
    .join('');
};

const createPopupTemplate = (film) => {
  const {title, alternativeTitle, totalRating, poster, ageRating, director, writers, actors, release, runtime, genre, description} = film.filmInfo;
  const {watchlist, alreadyWatched, favorite} = film.userDetails;
  const comments = film.comments;
  const emoji = film.emoji;
  const comment = film.comment;

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

            <p class="film-details__age">${ageRating}</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${alternativeTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${totalRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers.length > 1 ? writers.join(', ') : writers}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors.length > 1 ? actors.join(', ') : actors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${getFormatDate(release.date)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${getDuration(runtime)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${release.releaseCountry}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${genre.length > 1 ? 'Genres' : 'Genre'}</td>
                <td class="film-details__cell">
                  ${genre.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('')}
              </tr>
            </table>

            <p class="film-details__film-description">
              ${description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${watchlist ? 'checked' : ''}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${alreadyWatched ? 'checked' : ''}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${favorite ? 'checked' : ''}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${film.comments.length}</span></h3>

          <ul class="film-details__comments-list">
            ${renderComments(comments)}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">${emoji ?  `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">` : ''}</div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${comment ? comment : ''}</textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class PopupView extends SmartView {
  constructor(film) {
    super();
    this._data = PopupView.parseFilmToData(film);
    this._id = film.id;

    this._closePopupHandler = this._closePopupHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._changeEmojiHandler = this._changeEmojiHandler.bind(this);
    this._changeInputHandler = this._changeInputHandler.bind(this);
    this._deleteCommentHandler = this._deleteCommentHandler.bind(this);
    this._addCommentHandler = this._addCommentHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createPopupTemplate(this._data);
  }

  static parseFilmToData(film) {
    return Object.assign(
      {},
      film,
      {
        emoji: null,
        comment: '',
      },
    );
  }

  static parseDataToFilm(data) {
    data = Object.assign({}, data);

    delete data.emoji;
    delete data.comment;

    return data;
  }

  reset(filmCard) {
    this.updateData(PopupView.parseFilmToData(filmCard));
  }

  _closePopupHandler(evt) {
    evt.preventDefault();
    this._callback.closePopup();
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

  _changeEmojiHandler(evt) {
    this.updateData({emoji: evt.target.value});
  }

  _changeInputHandler(evt) {
    this.updateData({comment: evt.target.value}, true);
  }

  _deleteCommentHandler(evt) {
    if (evt.target.matches('.film-details__comment-delete')) {
      const id = evt.target.closest('.film-details__comment').dataset.id;
      const currentComments = this._data.comments.slice().filter((item) => {
        return item.id !== id;
      });
      this.updateData({
        comments: currentComments,
      });
      this._callback.deleteComment(evt, id);
    }
  }

  _addCommentHandler(evt) {
    if ((evt.ctrlKey || evt.metaKey) && evt.key === 'Enter') {
      const newComment = {
        id: nanoid(),
        date: dayjs(),
        comment: this._data.comment,
        emotion: this._data.emoji,
        author: 'user',
      };

      this._callback.addComment(newComment);

      this.updateData({
        emoji: null,
        comment: '',
      }, true);
    }
  }

  _setInnerHandlers() {
    this.getElement().querySelectorAll('.film-details__emoji-item')
      .forEach((element) => {
        element.addEventListener('change', this._changeEmojiHandler);
      });
    this.getElement().querySelector('.film-details__comment-input').addEventListener('input', this._changeInputHandler);
  }

  setClosePopupHandler(callback) {
    this._callback.closePopup = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closePopupHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('#watchlist').addEventListener('click', this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector('#watched').addEventListener('click', this._watchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('#favorite').addEventListener('click', this._favoriteClickHandler);
  }

  setDeleteCommentHandler(callback) {
    this._callback.deleteComment = callback;
    this.getElement().querySelector('.film-details__comments-list').addEventListener('click', this._deleteCommentHandler);
  }

  setAddCommentHandler(callback) {
    this._callback.addComment = callback;
    document.addEventListener('keydown', this._addCommentHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setClosePopupHandler(this._callback.closePopup);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setDeleteCommentHandler(this._callback.deleteComment);
  }
}
