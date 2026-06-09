const TOKEN = 'BUILD_TIME_TOKEN_PLACEHOLDER';
export const RAW_URL = 'https://raw.githubusercontent.com/petr538/manga/main/';

export const mangas = JSON.parse(sessionStorage.getItem('mangas')) ?? {};

if ((() => { for (const _ in mangas) return false; return true; })()) {
  const pages = await fetch('https://api.github.com/repos/petr538/manga/git/trees/main?recursive=1', { method: 'get',
    headers: {
      Authorization: 'Bearer ' + TOKEN,
      Accept: 'application/vnd.github+json',
    }
  }).then(r => r.json()).then(d => d.tree.sort(compare));

  for (const p of pages) {
    const [title, chapter, name] = p.path.split('/');
    if (!chapter || !name) continue;

    mangas[title] ||= [{ name: chapter, pages: [] }];
    if (mangas[title].at(-1).name !== chapter)
      mangas[title].push({ name: chapter, pages: [] });
    mangas[title].at(-1).pages.push(encodeURI(p.path));
  }
  sessionStorage.setItem('mangas', JSON.stringify(mangas));

  function compare(a, b) {
    const aMatches = a.path.matchAll(/(\d+)[^\/.\d]*/g);
    for (const bMatch of b.path.matchAll(/(\d+)[^\/.\d]*/g)) {
      const aMatch = aMatches.next().value;
      if (!aMatch) return -1;
      if (aMatch[0] !== bMatch[0])
        return aMatch[1] === bMatch[1] ? aMatch[0].length - bMatch[0].length : aMatch[1] - bMatch[1];
    }
    return 0;
  }
}

export function insertChapters(title) {
  const chapters = document.querySelector('.chapters');
  for (let i = 0; i < mangas[title].length; i++)
    chapters.insertAdjacentHTML('beforeend',
      `<a class="ref" href="reader.html?title=${title}&chapter=${i}">${mangas[title][i].name}</a>`);
}
