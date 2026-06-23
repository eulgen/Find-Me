import https from 'https';

const domains = [
  { name: 'MTN', domain: 'mtn.cm' },
  { name: 'MTN_COM', domain: 'mtn.com' },
  { name: 'Jumia', domain: 'jumia.cm' },
  { name: 'Afriland', domain: 'afrilandfirstbank.com' },
  { name: 'Campost', domain: 'campost.cm' },
  { name: 'Nexttel', domain: 'nexttel.cm' },
  { name: 'Viettel', domain: 'viettel.com.vn' },
];

function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve(res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302);
    }).on('error', () => resolve(false));
  });
}

async function testLogos() {
  for (const { name, domain } of domains) {
    const clearbit = `https://logo.clearbit.com/${domain}`;
    const cbOk = await checkUrl(clearbit);
    console.log(`${name} Clearbit: ${cbOk ? clearbit : 'FAILED'}`);
  }
}

testLogos();
