import AbstractView from './abstract.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {name, count, type} = filter;
  return `<a href="#${name}" id="${type}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}">${name} <span class="main-navigation__item-count">${count}</span></a>`;
};

const createSiteMenuTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class SiteMenuView extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._changeFilterTypeHandler = this._changeFilterTypeHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate(this._filters, this._currentFilter);
  }

  _changeFilterTypeHandler(evt) {
    evt.preventDefault();
    this._callback.changeFilterType(evt.target.id);
  }

  setChangeFilterTypeHandler(callback) {
    this._callback.changeFilterType = callback;
    this.getElement().querySelectorAll('.main-navigation__item').forEach((item) => {
      item.addEventListener('click', this._changeFilterTypeHandler);
    });
  }
}
