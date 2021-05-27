import UserRatingView from '../view/user-rating.js';
import {getUserRank} from '../utils/statistics.js';
import {render, remove} from '../util.js';

export default class UserRatingPresenter {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._userRatingComponent = null;

    this._eventModelHandler = this._eventModelHandler.bind(this);

    this._filmsModel.addObserver(this._eventModelHandler);
  }

  init() {
    const films = this._filmsModel.getFilms();
    const watchedFilmsCount = films.filter((film) => film.userDetails.alreadyWatched).length;

    if (watchedFilmsCount) {
      this._userRatingComponent = new UserRatingView(getUserRank(films));
      render(this._container, this._userRatingComponent);
    }
  }

  _update() {
    remove(this._userRatingComponent);
    this.init();
  }

  _eventModelHandler() {
    this._update();
  }
}
