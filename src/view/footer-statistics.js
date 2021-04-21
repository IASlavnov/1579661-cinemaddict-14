import {createElement} from '../util.js';

const createSiteFooterTemplate = (films) => {
  return `<p>${films} movies inside</p>`;
};

export default class Footer {
  constructor(count) {
    this._count = count;
    this._element = null;
  }

  getTemplate() {
    return createSiteFooterTemplate(this._count);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}