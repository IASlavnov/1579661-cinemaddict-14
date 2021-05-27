import AbstractView from './abstract.js';
import {MenuItem} from '../const.js';

const createFilterItemTemplate = (filter, currentFilterType, currentMenuSection) => {
  const {name, count, type} = filter;
  return `<a href="#${name}" id="${type}" class="main-navigation__item ${type === currentFilterType && currentMenuSection === MenuItem.FILMS ? 'main-navigation__item--active' : ''}">${name} <span class="main-navigation__item-count" id="${type}">${count}</span></a>`;
};

const createSiteMenuTemplate = (filterItems, currentFilterType, currentMenuSection) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType, currentMenuSection))
    .join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional ${currentMenuSection === MenuItem.STATS ? 'main-navigation__additional--active' : ''}">Stats</a>
  </nav>`;
};

export default class SiteMenuView extends AbstractView {
  constructor(filters, currentFilterType, currentMenuSection) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;
    this._currentMenuSection = currentMenuSection;

    this._changeFilterTypeHandler = this._changeFilterTypeHandler.bind(this);
    this._clickStatisticsHandler = this._clickStatisticsHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate(this._filters, this._currentFilter, this._currentMenuSection);
  }

  _changeFilterTypeHandler(evt) {
    evt.preventDefault();
    this._callback.changeFilterType(evt.target.id);
  }

  _clickStatisticsHandler(evt) {
    evt.preventDefault();
    this._callback.openStatistics(evt);
  }

  setChangeFilterTypeHandler(callback) {
    this._callback.changeFilterType = callback;
    this.getElement().querySelectorAll('.main-navigation__item').forEach((item) => {
      item.addEventListener('click', this._changeFilterTypeHandler);
    });
  }

  setClickStatisticsHandler(callback) {
    this._callback.openStatistics = callback;
    this.getElement().querySelector('.main-navigation__additional').addEventListener('click', this._clickStatisticsHandler);
  }
}
