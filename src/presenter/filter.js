import SiteMenuView from '../view/site-menu.js';
import {render, replace, remove} from '../util.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType, MenuItem} from '../const.js';

export default class FilterPresenter {
  constructor(filterContainer, filterModel, filmsModel, changeMenuSection) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._changeMenuSection = changeMenuSection;
    this._currentMenuSection = MenuItem.FILMS;

    this._filterComponent = null;

    this._eventModelHandler = this._eventModelHandler.bind(this);
    this._changeFilterTypeHandler = this._changeFilterTypeHandler.bind(this);
    this._clickStatisticsHandler = this._clickStatisticsHandler.bind(this);

    this._filmsModel.addObserver(this._eventModelHandler);
    this._filterModel.addObserver(this._eventModelHandler);
  }

  init() {
    const filters = this._getFilters();
    this._currentFilter = this._filterModel.getFilter();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new SiteMenuView(filters, this._currentFilter, this._currentMenuSection);
    this._filterComponent.setChangeFilterTypeHandler(this._changeFilterTypeHandler);
    this._filterComponent.setClickStatisticsHandler(this._clickStatisticsHandler);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _eventModelHandler() {
    this.init();
  }

  _changeFilterTypeHandler(filterType) {
    if (this._currentFilter === filterType && this._currentMenuSection === MenuItem.FILMS) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
    this._changeMenuSection(MenuItem.FILMS);
    this._currentMenuSection = MenuItem.FILMS;
    this.init();
  }

  _clickStatisticsHandler() {
    if (this._currentMenuSection === MenuItem.STATS) {
      return;
    }

    this._changeMenuSection(MenuItem.STATS);
    this._currentMenuSection = MenuItem.STATS;
    this.init();
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [
      {
        type: FilterType.ALL,
        name: 'All',
        count: filter[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](films).length,
      },
    ];
  }
}
