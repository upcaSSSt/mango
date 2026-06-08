import { RAW_URL, mangas } from './global.js';

//const res = await fetch('https://api.github.com/repos/upcassst/mangas/contents/Blame!').then(r => r.json());
const container = document.querySelector('.main__container');
for (const t in mangas) {
  const cover = mangas[t][0].pages.find(p => p.endsWith('.webp'));
  container.insertAdjacentHTML('beforeend',
    `<div class="title">\
      <img class="title__img" src="${RAW_URL}${cover}" alt="${t}">\
      <a class="ref" href="/title?title=${t}">${t}</a>\
    </div>`);
}
