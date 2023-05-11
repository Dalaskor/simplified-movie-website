import * as fs from 'node:fs';
import puppeteer from 'puppeteer';

const BASE_URL = 'https://www.kinopoisk.ru';
const START_PAGE = 1;
const END_PAGE = 40;

const scrapper = async () => {
  console.log('Эмуляция браузера...');
  const browser = await puppeteer.launch({ headless: false });
  const films = [];
  const curTime = new Date().getTime();
  const fileName = `data-${curTime}.json`;

  const page = await browser.newPage();
  for (let i = START_PAGE; i <= END_PAGE; i++) {
    let url = `${BASE_URL}/lists/movies/?page=${i}`;

    console.log('Переход к списку фильмов...');
    await new Promise((r) => setTimeout(r, 1000));
    await page.goto(url);

    console.log('Получения списка фильмов...');
    const filmLinks = await parseLinks(page);

    const newFilms = await listHandler(page, filmLinks);
    Array.prototype.push.apply(films, newFilms);

    fs.writeFileSync(fileName, JSON.stringify(films));
  }

  await page.close();
  await browser.close();
};

// Прогнать парсер по фильмам из полученного списка
const listHandler = async (page, filmLinks) => {
  let films = [];

  for (const link of filmLinks) {
    const url = `${BASE_URL}${link}`;
    console.log(`Фильм - ${url}`);

    console.log('Переход на страинцу с фильмом...');
    await new Promise((r) => setTimeout(r, 1000));
    await page.goto(url);

    console.log('Парсим страницу с фильмом...');
    const film = await parseFilm(page);

    console.log(film);
    if (film) {
      films.push(film);
    }

    console.log('Переход обратно к списку');
    await new Promise((r) => setTimeout(r, 1000));
    await page.goBack();
  }

  return films;
};

// Парсинг урлов на страницe с фильмами
const parseLinks = async (page) => {
  const filmLinks = await page.evaluate(() => {
    const items = Array.from(
      document.querySelectorAll('.styles_root__wgbNq'),
      (el) => el.getAttribute('href'),
    );
    return items;
  });

  return await filmLinks;
};

// Парсинг страницы с фильмом
const parseFilm = async (page) => {
  try {
    const film = await page.evaluate(() => {
      const TITLES = {
        year: 'Год производства',
        country: 'Страна',
        genre: 'Жанр',
        tagline: 'Слоган',
        director: 'Режиссер',
        scenario: 'Сценарий',
        producer: 'Продюсер',
        operator: 'Оператор',
        compositor: 'Композитор',
        artist: 'Художник',
        montage: 'Монтаж',
        budget: 'Бюджет',
        feesUS: 'Сборы в США',
        fees: 'Сборы в мире',
        spectators: 'Зрители',
        feesRU: 'Сборы в России',
        premiere: 'Премьера в мире',
        premiereRU: 'Премьера в России',
        releaseDVD: 'Релиз на DVD',
        releaseBluRay: 'Релиз на Blu-ray',
        age: 'Возраст',
        ratingMPAA: 'Рейтинг MPAA',
        time: 'Время',
        aboutFilm: 'О фильме',
        aboutSeries: 'О сериале',
      };

      const rows = Array.from(
        document
          .querySelector('[data-test-id^="encyclopedic"]')
          .querySelectorAll('[data-tid="7cda04a5"]'),
      );
      const rowsActors = document
        .querySelector('[class^="styles_actors"]')
        .querySelectorAll('[data-tid="2e6eb73e"]>a');
      const rowsActorsDuble = document
        .querySelector('[class^="styles_actors"]+div')
        .querySelectorAll('[data-tid="2e6eb73e"]>a');

      const name_en = document.querySelector('[data-tid="eb6be89"]').innerText;
      const description = document.querySelector(
        '[class^="styles_paragraph"]',
      ).innerText;
      const mainImg = document
        .querySelector('[class="styles_posterLink__C1HRc"]>img')
        .getAttribute('src');
      const actors = Array.from(rowsActors, (el) => el.innerText);
      const actorsDuble = Array.from(rowsActorsDuble, (el) => el.innerText);

      const aboutTitle = document
        .querySelector('[data-test-id^="encyclopedic"]')
        .parentElement.querySelector('h3').innerText;

      let name = '';
      let type = '';
      let year = '';
      let country = [];
      let genre = [];
      let tagline = '';
      let director = [];
      let scenario = [];
      let producer = [];
      let operator = [];
      let compositor = [];
      let artist = [];
      let montage = [];
      let budget = '';
      let feesUS = '';
      let feesRU = '';
      let fees = '';
      let spectators = [];
      let premiereRU = '';
      let premiere = '';
      let releaseDVD = '';
      let releaseBluRay = '';
      let age = '';
      let ratingMPAA = '';
      let time = '';

      if (aboutTitle === TITLES.aboutFilm) {
        type = 'фильм';
        name = document.querySelector('[data-tid="75209b22"]').innerText;
      } else if (aboutTitle === TITLES.aboutSeries) {
        type = 'сериал';
        name = document.querySelector('[data-tid="2da92aed"]').innerText;
      }

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const title = row.querySelector('div').innerText;

        switch (title) {
          case TITLES.year:
            year = row.querySelector('[href^="/lists/movies/year"]').innerText;
            break;
          case TITLES.country:
            country = Array.from(
              row.querySelectorAll('[href^="/lists/movies/country"]'),
              (el) => el.innerText,
            );
            break;
          case TITLES.genre:
            genre = Array.from(
              row.querySelectorAll('[href^="/lists/movies/genre"]'),
              (el) => el.innerText,
            );
            break;
          case TITLES.tagline:
            const checkTagline = row.querySelector('[data-tid="e1e37c21"]>div');
            if (!checkTagline) {
              tagline = '-';
              break;
            }

            tagline = checkTagline.innerText;
            break;
          case TITLES.director:
            director = Array.from(
              row.querySelectorAll('[href^="/name/"]'),
              (el) => el.innerText,
            );
            break;
          case TITLES.scenario:
            scenario = Array.from(
              row.querySelectorAll('[href^="/name/"]'),
              (el) => el.innerText,
            );
            break;
          case TITLES.producer:
            producer = Array.from(
              row.querySelectorAll('[href^="/name/"]'),
              (el) => el.innerText,
            );
            break;
          case TITLES.operator:
            operator = Array.from(
              row.querySelectorAll('[href^="/name/"]'),
              (el) => el.innerText,
            );
            break;
          case TITLES.compositor:
            compositor = Array.from(
              row.querySelectorAll('[href^="/name/"]'),
              (el) => el.innerText,
            );
            break;
          case TITLES.artist:
            artist = Array.from(
              row.querySelectorAll('[href^="/name/"]'),
              (el) => el.innerText,
            );
            break;
          case TITLES.montage:
            montage = Array.from(
              row.querySelectorAll('[href^="/name/"]'),
              (el) => el.innerText,
            );
            break;
          case TITLES.budget:
            budget = row.querySelector('[href^="/film/"]').innerHTML;
            break;
          case TITLES.feesUS:
            feesUS = row.querySelector('[href^="/film/"]').innerHTML;
            break;
          case TITLES.feesRU:
            feesRU = row.querySelector('[href^="/film/"]').innerHTML;
            break;
          case TITLES.fees:
            fees = row.querySelector('[href^="/film/"]').innerHTML;
            break;
          case TITLES.spectators:
            spectators = Array.from(row.querySelectorAll('span'), (el) => ({
              country: el.querySelector('img').getAttribute('alt'),
              count: el.innerText,
            }));
            break;
          case TITLES.premiereRU:
            premiereRU = row.querySelector('[href^="/premiere/"]').innerText;
            break;
          case TITLES.premiere:
            premiere = row.querySelector('[href^="/film/"]').innerText;
            break;
          case TITLES.releaseDVD:
            releaseDVD = row.querySelector(
              '[data-tid="e1e37c21"]>div',
            ).innerText;
            break;
          case TITLES.releaseBluRay:
            releaseBluRay = row.querySelector(
              '[data-tid="e1e37c21"]>div',
            ).innerText;
            break;
          case TITLES.age:
            age = row.querySelector('[data-tid="5c1ffa33"]').innerText;
            break;
          case TITLES.ratingMPAA:
            ratingMPAA = row.querySelector('[data-tid="5c1ffa33"]').innerText;
            break;
          case TITLES.time:
            time = row.querySelector('[data-tid="e1e37c21"]>div').innerText;
            break;
        }
      }

      return {
        name,
        name_en,
        type,
        year,
        country,
        genre,
        tagline,
        director,
        scenario,
        producer,
        operator,
        compositor,
        artist,
        montage,
        budget,
        feesUS,
        feesRU,
        fees,
        spectators,
        premiereRU,
        premiere,
        releaseDVD,
        releaseBluRay,
        age,
        ratingMPAA,
        time,
        description,
        mainImg,
        actors,
        actorsDuble,
      };
    });

    return film;
  } catch (e) {
    console.error(e);
  }
};

await scrapper();
