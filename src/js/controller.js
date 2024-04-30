import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeview from './views/recipeview.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeview.renderSpinner();
    //0 Update results view to mark selected results
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    //1.Loading recipe
    await model.loadRecipe(id);

    //Rendering recipe
    recipeview.render(model.state.recipe);
  } catch (err) {
    recipeview.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1.Get search query
    const query = searchView.getQuery();
    if (!query) return;
    //2.Load Search Results
    await model.loadSearchResults(query);
    //3. Render results

    resultsView.render(model.getSearchResultsPage());

    //4 Render initial Pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render New results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2. Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings(in state)
  model.updateServings(newServings);
  // Update the recipe view
  //recipeview.render(model.state.recipe);
  recipeview.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1 Add/remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2 Update recipe view
  recipeview.update(model.state.recipe);

  //3 Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show Loading Spinner
    addRecipeView.renderSpinner();
    //Upload the new Recipe data
    await model.uploadRecipe(newRecipe);

    //Render recipe
    recipeview.render(model.state.recipe);

    //Sucess Message
    addRecipeView.renderMessage('Recipe was sucessfully uploaded :) ');
    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change ID in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err, ':| >_<');
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeview.addHandlerRender(controlRecipes);
  recipeview.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  recipeview.addHandlerAddBookmark(controlAddBookmark);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
