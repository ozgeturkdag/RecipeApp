import { v4 } from "https://jspm.dev/uuid";
import {
  elements,
  setLocalStorage,
  getFromLocal,
  controlBtn,
} from "./js/helpers.js";
import { Search } from "./js/api.js";
import {
  clearLoader,
  renderLoader,
  renderResults,
  renderBasketItems,
} from "./js/ui.js";
import { Recipe } from "./js/recipe.js";

const recipe = new Recipe();

//! Olay İzleyicileri
elements.form.addEventListener("submit", handleSubmit);

//! Fonksiyonlar
async function handleSubmit(e) {
  e.preventDefault();
  // aratılan kelime
  const query = elements.searchInput.value;

  // arama terimi boş değilse çalışır
  if (query) {
    // search sınıfının bir örneğini oluştur
    const search = new Search(query);

    // istek atmaya başlamadan önce loader'ı ekrana bas
    renderLoader(elements.resultList);

    // istek atma
    try {
      await search.getResults();
      // isteğe cevap gelince loader'ı ekrandan kaldır
      clearLoader();

      // gelen cevabı ekrana bas
      renderResults(search.result);
    } catch (err) {
      alert("No recipes matching your criteria found");
      clearLoader();
    }
  }
}

// tarif detaylarını alma
const controlRecipe = async () => {
  const id = location.hash.replace("#", "");
  if (id) {
    // ekran loader'ı bas
    renderLoader(elements.recipeArea);

    try {
      // tarif bilgilerini ala
      await recipe.getRecipe(id);

      // loader'ı kaldır
      clearLoader();

      // ekrana tarif arayüzünü bas
      recipe.renderRecipe(recipe.info);

      // tarif arayüzüzne scroll'u kaydır
      elements.recipeArea.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      alert("Error retrieving data");
      clearLoader();
    }
  }
};

// iki farklı olayı izleme
["hashchange", "load"].forEach((eventName) => {
  window.addEventListener(eventName, controlRecipe);
});

//! Sepet Alanı

// local'storage'da sepet dizisi varsa onu al
// ama basket değeri undefind'sa o zaman [] olarak tanımla
let basket = getFromLocal("basket") || [];

// sayfanın yüklenme olayınız izle
document.addEventListener("DOMContentLoaded", () => {
  renderBasketItems(basket);

  // sepette eleman varsa butonu göster
  controlBtn(basket);
});

// tarif alanındaki tıklanmalarda çalışır
const handleClick = (e) => {
  if (e.target.id === "add-to-basket") {
    // tarifler diizni dön
    recipe.ingredients.forEach((title) => {
      // her bir tarif için obje oluştur ve id ekle
      const newItem = {
        id: v4(),
        title,
      };

      // yeni oluşan tarifi sepete ekle
      basket.push(newItem);
    });

    // sepeti local'storage'a kaydetme
    setLocalStorage("basket", basket);

    // ekrana sepet elemanlarını basma
    renderBasketItems(basket);

    // sepete ekle butonuu göster
    controlBtn(basket);
  }

  if (e.target.id === "like-btn") {
    recipe.controlLike();
  }
};

// sepetten eleman kaldırma
const deleteItem = (e) => {
  if (e.target.id === "delete-item") {
    // kapysaıcıya erişme
    const parent = e.target.parentElement;

    // seçilen ürünü diziden kaldırlbilmeik için id'ye erişme
    basket = basket.filter((i) => i.id !== parent.dataset.id);

    // local'storage'ı güncelleme
    setLocalStorage("basket", basket);

    // elemanı html'den kaldırma
    parent.remove();

    // temizle butonunu kontrol eder
    controlBtn(basket);
  }
};

// sepette tümünü temzileme
const handleClear = () => {
  // kullanıcan onay alma
  const res = confirm("The whole basket will be emptied!  Are you sure?");
  // kullanıcı onaylarsa çalışır
  if (res) {
    // local'i temizleme
    setLocalStorage("basket", null);

    // sepet dizisini sıfırlama
    basket = [];

    // butonu ortadan kaldırma
    controlBtn(basket);

    // arayüzü temizleme
    elements.basketList.innerHTML = "";
  }
};

// sepete ekele butonuna tıklanmayı izle
elements.recipeArea.addEventListener("click", handleClick);

// sepet üzerinde tıklanma olaylarını izler
elements.basketList.addEventListener("click", deleteItem);

// temizle butonuna tıklanmayı izler
elements.clearBtn.addEventListener("click", handleClear);
