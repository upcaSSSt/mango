import { loadGapi, authWindow, imgUrl } from "./global";

const container = document.querySelector('.main__container');

loadGapi(authWindow);
window.addEventListener('gapiReady', async () => {
  const titles = await gapi.client.drive.files.list({
    q: '"1ZvNMBF6qAjqYfweWc8IaHiFtgm1U7YzS" in parents and trashed=false',
    fields: 'files(id, name)',
    orderBy: 'name',
  });

  const imgs = await Promise.all(titles.result.files.map(async (t) => {
    const chapter = await gapi.client.drive.files.list({
      q: `'${t.id}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
      orderBy: 'name',
      pageSize: 1,
    });
    const cover = await gapi.client.drive.files.list({
      q: `'${chapter.result.files[0].id}' in parents and trashed=false`,
      fields: 'files(id, name)',
      orderBy: 'name',
      pageSize: 1,
    });

    return imgUrl(cover.result.files[0].id);
  }));
  for (let i = 0; i < imgs.length; i++)
    container.insertAdjacentHTML('beforeend',
      `<div class="title">\
        <img class="title__img" src="${imgs[i]}" alt="${titles.result.files[i].name}">\
        <a class="ref" href="../title.html?title=${titles.result.files[i].id}">\
          ${titles.result.files[i].name}\
        </a>\
      </div>`);
}, { once: true });
