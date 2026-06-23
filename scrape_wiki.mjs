import https from 'https';

const pages = [
  'en.wikipedia.org/wiki/MTN_Group',
  'en.wikipedia.org/wiki/Jumia',
  'fr.wikipedia.org/wiki/Afriland_First_Bank',
  'fr.wikipedia.org/wiki/Campost',
  'en.wikipedia.org/wiki/Viettel'
];

function fetchPage(host, path) {
  return new Promise((resolve) => {
    https.get({ host, path: path, headers: {'User-Agent': 'Mozilla/5.0'} }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    });
  });
}

async function run() {
  for (const page of pages) {
    const [host, ...rest] = page.split('/');
    const path = '/' + rest.join('/');
    const html = await fetchPage(host, path);
    // Find the infobox image URL
    const match = html.match(/src="\/\/(upload\.wikimedia\.org\/wikipedia\/commons\/[^"]+logo[^"]*\.(?:svg|png|jpg))"/i)
               || html.match(/src="\/\/(upload\.wikimedia\.org\/wikipedia\/[^"]+logo[^"]*\.(?:svg|png|jpg))"/i)
               || html.match(/src="\/\/(upload\.wikimedia\.org\/wikipedia\/[^"]+\.(?:svg|png|jpg))"/i);
    if (match) {
      console.log(`${page}: https://${match[1]}`);
    } else {
      console.log(`${page}: NO MATCH`);
    }
  }
}

run();
