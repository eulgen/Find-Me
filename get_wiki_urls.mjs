import https from 'https';

const titles = [
  'File:MTN_Logo.svg',
  'File:Jumia_Group-Logo.png',
  'File:Logo_Afriland.png',
  'File:Campost_logo.png',
  'File:Viettel_logo_2021.svg'
];

async function getImageUrl(title) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${title}&prop=imageinfo&iiprop=url&format=json`;
  // Fallback to fr.wikipedia.org
  const urlFr = `https://fr.wikipedia.org/w/api.php?action=query&titles=${title}&prop=imageinfo&iiprop=url&format=json`;
  
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pageId === '-1' || !pages[pageId].imageinfo) {
             // try fr
             https.get(urlFr, (resFr) => {
                let dataFr = '';
                resFr.on('data', chunk => dataFr += chunk);
                resFr.on('end', () => {
                   try {
                     const jsonFr = JSON.parse(dataFr);
                     const pagesFr = jsonFr.query.pages;
                     const pageIdFr = Object.keys(pagesFr)[0];
                     if (pageIdFr !== '-1' && pagesFr[pageIdFr].imageinfo) {
                       resolve(pagesFr[pageIdFr].imageinfo[0].url);
                     } else {
                       resolve(null);
                     }
                   } catch(e) { resolve(null); }
                });
             });
          } else {
             resolve(pages[pageId].imageinfo[0].url);
          }
        } catch(e) {
          resolve(null);
        }
      });
    });
  });
}

async function run() {
  for (const title of titles) {
    const url = await getImageUrl(title);
    console.log(`${title}: ${url}`);
  }
}

run();
