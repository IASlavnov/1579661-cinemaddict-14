import AbstractView from './abstract.js';

const createUserRatingTemplate = (rating) => {
  return `<section class="header__profile profile">
    <p class="profile__rating">${rating}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class UserRatingView extends AbstractView {
  constructor(rating) {
    super();
    this._rating = rating;
  }

  getTemplate() {
    return createUserRatingTemplate(this._rating);
  }
}
