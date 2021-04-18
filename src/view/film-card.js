export const createFilmCardTemplate = (film) => {
  const comments = film.comments;
  const {title, poster, totalRating, release, runtime, genre, description} = film.filmInfo;
  const {watchlist, alreadyWatched, favorite} = film.userDetails;

  const MAX_DESCRIPTION_LENGTH = 140;

  const setActiveClass = (flag) => {
    return flag ? 'film-card__controls-item--active' : '';
  };

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${release.date.slice(-4)}</span>
      <span class="film-card__duration">${runtime}</span>
      <span class="film-card__genre">${genre[0]}</span>
    </p>
    <img src="./images/posters/${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${description.length > MAX_DESCRIPTION_LENGTH ? description.substring(0, MAX_DESCRIPTION_LENGTH - 1) + '...' : description}</p>
    <a class="film-card__comments">${comments.length} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${setActiveClass(watchlist)}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${setActiveClass(alreadyWatched)}" type="button">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${setActiveClass(favorite)}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};
