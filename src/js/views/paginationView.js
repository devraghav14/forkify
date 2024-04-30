import View from './view.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      console.log(btn);
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      console.log(goToPage);
      handler(goToPage);
    });
  }
  _generateMarkupBtn(curPage, numPages, icons) {
    let markup = ``;
    //previous btn
    if (curPage > 1) {
      markup += `
      <button data-goto = "${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
          <use href="${icons}.svg#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
      </button>
      `;
    }
    //next btn
    if (curPage < numPages) {
      markup += `
            <button data-goto = "${
              curPage + 1
            }" class="btn--inline pagination__btn--next">
                <span>Page ${curPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
        `;
    }

    return markup;
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    //Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupBtn(curPage, numPages, icons);
    }

    //Last page
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupBtn(curPage, numPages, icons);
    }
    //Other Page
    if (curPage < numPages) {
      return this._generateMarkupBtn(curPage, numPages, icons);
    }
    //Page 1 , and there are no other pages
    return '';
  }
}

export default new PaginationView();
