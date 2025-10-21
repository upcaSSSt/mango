const API_KEY = 'AIzaSyAYpFxuD1R8Gcrfg8v6DENS-HwWxqNT9ok';
const CLIENT_ID = '147622331730-gn5atqaid2gcgaqu687polg686pup2dq.apps.googleusercontent.com';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

let tokenClient;

export function loadGapi(callback = () => window.dispatchEvent(new Event('gapiReady'))) {
  window.addEventListener('load', () => {
    gapi.load('client', async () => {
      await gapi.client.init({ apiKey: API_KEY, discoveryDocs: [DISCOVERY_DOC] });
      callback();
    });
    tokenClient = google.accounts.oauth2.initTokenClient({ client_id: CLIENT_ID, scope: SCOPES });
  });
}

export function authWindow() {
  tokenClient.callback = async (res) => {
    if (res.error)
      throw res;
    localStorage.accessToken = gapi.client.getToken().access_token;
    await gapi.client.load('drive', 'v3');
    window.dispatchEvent(new Event('gapiReady'));
  };
  tokenClient.requestAccessToken({ prompt: gapi.client.getToken() ? '' : 'consent' });
}

export async function insertChapters(title) {
  const chapters = document.querySelector('.chapters');
  const res = (await gapi.client.drive.files.list({
    q: `'${title}' in parents and trashed=false`,
    fields: 'files(id, name)',
  })).result.files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

  for (let i = 0; i < res.length - 1; i++)
    chapters.insertAdjacentHTML('beforeend',
      `<a class="ref" href="../reader.html?title=${title}&chapter=${res[i].id}">${res[i].name}</a>`);
  return res;
}

export async function imgUrl(id) {
  return URL.createObjectURL(await fetch(`https://www.googleapis.com/drive/v3/files/${id}?alt=media`, {
    headers: { Authorization: 'Bearer ' + localStorage.accessToken }
  }).then((r) => r.blob()));
}
