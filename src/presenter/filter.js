import SiteMenuView from '../view/site-menu.js';
import {render, replace, remove} from '../util.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType} from '../const.js';

export default class FilterPresenter {
  constructor(filterContainer, filterModel, filmsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;

    this._filterComponent = null;

    this._eventModelHandler = this._eventModelHandler.bind(this);
    this._changeFilterTypeHandler = this._changeFilterTypeHandler.bind(this);

    this._filmsModel.addObserver(this._eventModelHandler);
    this._filterModel.addObserver(this._eventModelHandler);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new SiteMenuView(filters, this._filterModel.getFilter());
    this._filterComponent.setChangeFilterTypeHandler(this._changeFilterTypeHandler);

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
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
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
