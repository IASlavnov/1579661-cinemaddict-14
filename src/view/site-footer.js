export const createSiteFooterTemplate = (films) => {
  return `<section class="footer__logo logo logo--smaller">Cinemaddict</section>
    <section class="footer__statistics">
      <p>${films} movies inside</p>
    </section>`;
};
