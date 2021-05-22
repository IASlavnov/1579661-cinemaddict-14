import Observer from '../utils/observer.js';

export default class FilmsModel extends Observer {
  constructor() {
    super();
    this._films = [];
    this._comments = [];
  }

  setFilms(films) {
    this._films = films.slice();
  }

  setComments(film) {
    this._comments = film.comments.map((comment) => ({...comment}));
  }

  getFilms() {
    return this._films;
  }

  getComments() {
    return this._comments;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }
}
