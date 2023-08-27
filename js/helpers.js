export const elements = {
  form: document.querySelector("form"),
  searchInput: document.querySelector("form input"),
  resultList: document.querySelector(".results"),
  recipeArea: document.querySelector(".recipe"),
  basketList: document.querySelector(".shopping ul"),
  clearBtn: document.querySelector("#clear"),
  likeList: document.querySelector(".list"),
};

// local storage'ı günceller
export const setLocalStorage = (key, data) => {
  // verileri stringe çevirme
  const strData = JSON.stringify(data);

  // local storage'a kaydetme
  localStorage.setItem(key, strData);
};

// local'storge'dan eleman alma
export const getFromLocal = (key) => {
  //  string veriyi local'den alma
  const strData = localStorage.getItem(key);

  // veriyi json'a çevirip fonksiyonun çağrıldığı yere gönderme
  return JSON.parse(strData);
};

// sepetin doluluk oranını göre temizle butonunu göster
export const controlBtn = (basket) => {
  if (basket.length > 0) {
    elements.clearBtn.style.display = "flex";
  } else {
    elements.clearBtn.style.display = "none";
  }
};
