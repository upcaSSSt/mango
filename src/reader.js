import { RAW_URL, mangas, insertChapters } from './global.js';

const p = new URLSearchParams(window.location.search);

let curPage = 0;
const page = document.querySelector('.main__page');
const switchers = document.querySelectorAll('.main__btn');
const title = document.querySelector('.header__title');
const chapterSwitchers = document.querySelectorAll('.header__btn');
const chapterName = document.querySelector('.header__chapter');
const menu = document.querySelector('.header__menu');
const select = document.querySelector('.header__select');

title.textContent = p.get('title');
title.href = 'title.html?title=' + p.get('title');
chapterName.textContent = mangas[p.get('title')][p.get('chapter')].name;
chapterName.onclick = () => menu.classList.toggle('active');
document.querySelector('.header__close').onclick = () => menu.classList.remove('active');
document.querySelector('.main__center').onclick = () => {
  document.querySelector('.header__notice').style.display = 'none';
  document.querySelector('.header').classList.toggle('hide');
};
insertChapters(p.get('title'));

page.src = RAW_URL + mangas[p.get('title')][p.get('chapter')].pages[0];
for (let i = 0; i < mangas[p.get('title')][p.get('chapter')].pages.length; i++)
  select.insertAdjacentHTML('beforeend',
    `<option value="${i}">${i + 1} / ${mangas[p.get('title')][p.get('chapter')].pages.length}</option>`);

switchers[0].onclick = () => {
  if (--curPage < 0)
    turnChapter(-1);
  select.value = curPage;
  page.src = RAW_URL + mangas[p.get('title')][p.get('chapter')].pages[curPage];
};
switchers[1].onclick = () => {
  if (++curPage >= mangas[p.get('title')][p.get('chapter')].pages.length)
    turnChapter(1);
  select.value = curPage;
  page.src = RAW_URL + mangas[p.get('title')][p.get('chapter')].pages[curPage];
};

select.onchange = () => {
  curPage = select.value;
  page.src = RAW_URL + mangas[p.get('title')][p.get('chapter')].pages[curPage];
};

chapterSwitchers[0].onclick = () => turnChapter(-1);
chapterSwitchers[1].onclick = () => turnChapter(1);
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft')
    switchers[0].onclick();
  else if (e.key === 'ArrowRight')
    switchers[1].onclick();
});

function turnChapter(delta) {
  const index = +p.get('chapter') + delta;
  console.log(index);
  const ref = index < 0 || index >= mangas[p.get('title')].length ? `title.html?title=${p.get('title')}` :
    `reader.html?title=${p.get('title')}&chapter=${index}`;
  window.location.replace(window.location.origin + ref);
}
