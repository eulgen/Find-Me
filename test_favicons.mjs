import https from 'https';

const domains = [
  'http://mtn.cm',
  'http://jumia.cm',
  'http://afrilandfirstbank.com',
  'http://campost.cm',
  'http://viettel.com.vn'
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve(res.statusCode);
    }).on('error', () => resolve('error'));
  });
}

async function testFavicons() {
  for (const domain of domains) {
    const url = `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${domain}&size=128`;
    const code = await checkUrl(url);
    console.log(`${domain}: ${code}`);
  }
}

testFavicons();
