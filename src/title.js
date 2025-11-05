import { loadGapi, insertChapters, imgUrl } from './global.js';

const p = new URLSearchParams(window.location.search);

loadGapi();
window.addEventListener('gapiReady', async () => {
  document.querySelector('.main__title').textContent = (await gapi.client.drive.files.get({
    fileId: p.get('title'),
    fields: 'name',
  })).result.name;

  const chapters = await insertChapters(p.get('title'));
  document.querySelector('.header img').src = await imgUrl(chapters[0].id);
  const cover = document.querySelector('.main__cover img');
  cover.src = `../manga/${p.get('title')}/Том 1 Глава 1/1.jpg`;

  let prevCover = '0';
  const promises = [];
  for (let i = 1; i < chapters.length; i++)
    if (chapters[i].name.match(/\d+/)[0] !== prevCover.match(/\d+/)[0]) {
      promises.push((async () => {
        const pages = await gapi.client.drive.files.list({
          q: `'${chapters[i].id}' in parents and trashed=false`,
          fields: 'files(id, name)',
          orderBy: 'name',
          pageSize: 12,
        });
        return imgUrl(pages.result.files.find(p => p.name[2] === 'j').id);
      })());
      prevCover = chapters[i].name;
    }

  const covers = await Promise.all(promises);
  cover.src = covers[Math.trunc(Math.random() * covers.length)];
  window.setInterval(() => cover.src = covers[Math.trunc(Math.random() * covers.length)], 3000);
}, { once: true });
