// Custom Http Module
function customHttp() {
  return {
    get(url, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.addEventListener("load", () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener("error", () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        xhr.send();
      } catch (error) {
        cb(error);
      }
    },
    post(url, body, headers, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.addEventListener("load", () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener("error", () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }

        xhr.send(JSON.stringify(body));
      } catch (error) {
        cb(error);
      }
    },
  };
}
// Init http module
const http = customHttp();

const newsService = (function () {
  const apiKey = "d790b90d4db84cf38cc6f178e37afba9";
  const apiUrl = "https://news-api-v2.herokuapp.com";

  return {
    topHeadlines(country = "ru", cb) {
      http.get(
        `${apiUrl}/top-headlines?country=${country}&category=technology&apiKey=${apiKey}`,
        cb
      );
    },
    everything(query, cb) {
      http.get(`${apiUrl}/top-headlines?q=${query}&apiKey=${apiKey}`, cb);
    },
  };
})(); // Создали ньюссервис, который отвечает за взаимодействие с нашим АПИ, он хранит ключ и юрлу, и возвращает два метода топхедлайнс и еврифин

//  init selects
document.addEventListener("DOMContentLoaded", function () {
  M.AutoInit();
  loadNews();
}); // слушаем Домконтент событие и вызываем функцию лоадньюс

// Load news function
function loadNews() {
  newsService.topHeadlines("ru", onGetResponse);
} // лоадньюс обращается к сервису и вызывает метод топхедлайнс

// Function on get response from server

function onGetResponse(err, res) {
  renderNews(res.articles);
} // онгетреспонс колбек отрабатывает когда нам сервис возвращает ответ, который мы передаем в вункцию рендерньюс(массив с новостями)

// Function render news

function renderNews(news) {
  const newsContainer = document.querySelector(".news-container .row");
  let fragment = "";
  news.forEach((newsItem) => {
    const el = newsTemplate(newsItem);
    fragment += el;
  });

  newsContainer.insertAdjacentHTML('afterbegin', fragment); // после форича мы общаемся к ньюсконтейнеру, и с помощью инсертаджасментхтмл, вставляем нашу разметку на страницу
} // принимает новости, находит ньюс контейнер, в который мы закидываем новости, перебирает новости с помощью форича, на каждой и ттерации вызывает ньюстемплейт и записывает 1 новость ньюсайтем

// News item template function
function newsTemplate({ urlToImage, title, url, description }) {
  return `
  <div class="col s12">
    <div class="card">
      <div class="card-image">
        <img src= "${urlToImage}">
        <span class="card-title">${title || ""}</span>
      </div>
      <div class="card-content">
        <p>${description || ""}</p>
      </div>
      <div class="card-action">
        <a href="${url}">Read more</a>
      </div>
    </div>
  </div>
  `;
} // на основе этой 1 новости, мы формируем разметку и возвращаем эту разметку, эта разметка сохраняется в переменную el и конкат с переменной фрагмент
