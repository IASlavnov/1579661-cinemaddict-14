import AbstractView from './abstract.js';

const createSiteFooterTemplate = (films) => {
  return `<p>${films} movies inside</p>`;
};

export default class Footer extends AbstractView {
  constructor(count) {
    super();
    this._count = count;
  }

  getTemplate() {
    return createSiteFooterTemplate(this._count);
  }
}
