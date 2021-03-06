import AbstractView from './abstract.js';
import {SortType} from '../const.js';

const createSortTemplate = (currentSortType) => {
  return `<ul class="sort">
    <li><a href="#" class="sort__button ${currentSortType === SortType.DEFAULT ? 'sort__button--active' : ''}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button ${currentSortType === SortType.DATE ? 'sort__button--active' : ''}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button ${currentSortType === SortType.RATING ? 'sort__button--active' : ''}" data-sort-type=${SortType.RATING}>Sort by rating</a></li>
  </ul>`;
};

export default class SortView extends AbstractView {
  constructor(currentSortType) {
    super();
    this._currentSortType = currentSortType;

    this._changeSortTypeHandler = this._changeSortTypeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  _changeSortTypeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.changeSortType(evt.target.dataset.sortType);

    this.getElement().querySelectorAll('.sort__button').forEach((button) => {
      button.classList.remove('sort__button--active');
    });
    evt.target.classList.add('sort__button--active');
  }

  setChangeSortTypeHandler(callback) {
    this._callback.changeSortType = callback;
    this.getElement().addEventListener('click', this._changeSortTypeHandler);
  }
}
