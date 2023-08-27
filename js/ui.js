import { elements } from "./helpers.js";

// api'den gelen sonuçları ekrana basar
export const renderResults = (recipes) => {
  elements.resultList.innerHTML = "";
  // her bir obje için ekrana kart basma
  recipes.slice(0, 10).forEach((recipe) => {
    // kart için html'i hazırlama
    const markup = `
         <a href="#${recipe.recipe_id}" class="result-link">
            <img
              src="${recipe.image_url}"
            />
            <div class="data">
              <h4>${recipe.title}</h4>
              <p>${recipe.publisher}</p>
            </div>
          </a>
        `;

    // oluşturğumuz html'i ilgili yere gönderme
    elements.resultList.insertAdjacentHTML("beforeend", markup);
  });
};

// ekrana yüklenme gifi basma
export const renderLoader = (parent) => {
  // loader' htmlini hazırlama
  const loader = `
  <div class="loader">
   <img src="images/food-load.gif" />
  </div>
  `;

  //   loader'ı bize gelen html elemanın içine gönderme
  parent.insertAdjacentHTML("afterbegin", loader);
};

// ekran loader'ı kaldıracak fonksiyon
export const clearLoader = () => {
  // loader'ı dökümanda bul
  const loader = document.querySelector(".loader");

  //eğerki bulunduysa loader'I html'den kaldır
  if (loader) loader.remove();
};

// ekrana sepete eklenen ürünleri basar
export const renderBasketItems = (items) => {
  const markup = items
    .map(
      (item) => `
    <li data-id=${item.id}>
    <i id="delete-item" class="bi bi-x"></i>
    <span>${item.title}</span>
    </li>
    `
    )
    .join("");

  elements.basketList.innerHTML = markup;
};
