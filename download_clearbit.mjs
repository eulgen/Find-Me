import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logos = [
  { name: 'mtn.png', url: 'https://logo.clearbit.com/mtn.cm' },
  { name: 'jumia.png', url: 'https://logo.clearbit.com/jumia.com.ng' },
  { name: 'afriland.png', url: 'https://logo.clearbit.com/afrilandfirstbank.com' },
  { name: 'campost.png', url: 'https://logo.clearbit.com/campost.cm' },
  { name: 'nexttel.png', url: 'https://logo.clearbit.com/viettel.com.vn' }
];

const destDir = path.join(__dirname, 'public', 'assets', 'images', 'partners');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      }
    };
    https.get(url, options, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307 || response.statusCode === 308) {
         download(response.headers.location, dest).then(resolve).catch(reject);
      } else {
        fs.unlink(dest, () => {});
        reject(`Failed ${url}: ${response.statusCode}`);
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err.message);
    });
  });
}

async function run() {
  for (const logo of logos) {
    const dest = path.join(destDir, logo.name);
    try {
      await download(logo.url, dest);
      console.log(`OK: ${logo.name}`);
    } catch (err) {
      console.log(`ERR: ${logo.name} - ${err}`);
    }
  }
}

run();
