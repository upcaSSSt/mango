import { loadGapi, insertChapters, imgUrl } from './global.js';

const p = new URLSearchParams(window.location.search);

let curPage = 0;
const page = document.querySelector('.main__page');
const switchers = document.querySelectorAll('.main__btn');
const title = document.querySelector('.header__title');
const chapterSwitchers = document.querySelectorAll('.header__btn');
const chapterName = document.querySelector('.header__chapter');
const menu = document.querySelector('.header__menu');
const select = document.querySelector('.header__select');
const progress = document.querySelector('.progress');

loadGapi();
window.addEventListener('gapiReady', async () => {
  title.textContent = (await gapi.client.drive.files.get({
    fileId: p.get('title'),
    fields: 'name',
  })).result.name;
  title.href = '../title.html?title=' + p.get('title');
  chapterName.textContent = (await gapi.client.drive.files.get({
    fileId: p.get('chapter'),
    fields: 'name',
  })).result.name;
  chapterName.onclick = () => menu.classList.toggle('active');
  document.querySelector('.header__close').onclick = () => menu.classList.remove('active');
  document.querySelector('.main__center').onclick = () => {
    document.querySelector('.header__notice').style.display = 'none';
    document.querySelector('.header').classList.toggle('hide');
  };
  const chapters = await insertChapters(p.get('title'));

  const pages = (await gapi.client.drive.files.list({
    q: `'${p.get('chapter')}' in parents and trashed=false`,
    fields: 'files(id, name)',
  })).result.files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
  const blobs = await Promise.all(pages.map((p) => {
    progress.value += 1 / pages.length;
    return imgUrl(p.id);
  }));
  progress.style.display = 'none';
  page.src = blobs[0];
  for (let blob = 1; blob <= blobs.length; blob++)
    select.insertAdjacentHTML('beforeend', `<option value="${blob}">${blob} / ${blobs.length}</option>`);

  switchers[0].onclick = () => {
    select.value = curPage;
    if (--curPage < 0)
      turnChapter(-1);
    page.src = blobs[curPage];
  };
  switchers[1].onclick = () => {
    if (++curPage >= blobs.length)
      turnChapter(1);
    select.value = curPage + 1;
    page.src = blobs[curPage];
  };

  select.onchange = () => {
    curPage = select.value - 1;
    page.src = blobs[curPage];
  };

  chapterSwitchers[0].onclick = () => turnChapter(-1);
  chapterSwitchers[1].onclick = () => turnChapter(1);

  function turnChapter(delta) {
    const index = chapters.findIndex((ch) => ch.id === p.get('chapter')) + delta;
    const ref = index < 0 || index >= chapters.length - 1 ? `/title.html?title=${p.get('title')}` :
      `/reader.html?title=${p.get('title')}&chapter=${chapters[index].id}`;
    window.location.replace(window.location.origin + ref);
  }
}, { once: true });
