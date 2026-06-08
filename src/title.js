import { RAW_URL, mangas, insertChapters } from './global.js';

const p = new URLSearchParams(window.location.search);

document.querySelector('.main__title').textContent = p.get('title');

insertChapters(p.get('title'));
document.querySelector('.header img').src = `${RAW_URL}${p.get('title')}/header.webp`;
const cover = document.querySelector('.main__cover img');
cover.src = `${RAW_URL}${p.get('title')}/${mangas[p.get('title')][0].name}/1.webp`;

let prevCover = '0';
const covers = [];
for (const ch of mangas[p.get('title')])
  if (ch.name.match(/\d+/)[0] !== prevCover.match(/\d+/)[0]) {
    covers.push(RAW_URL + ch.pages.find(p => p.endsWith('.webp')));
    prevCover = ch.name;
  }

cover.src = covers[Math.trunc(Math.random() * covers.length)];
window.setInterval(() => cover.src = covers[Math.trunc(Math.random() * covers.length)], 3000);
