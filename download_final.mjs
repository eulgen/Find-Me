import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const urls = {
  'mtn.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/MTN_2022_logo.svg/250px-MTN_2022_logo.svg.png',
  'jumia.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/JumiaLogo_%2814%29.png/250px-JumiaLogo_%2814%29.png',
  'afriland.png': 'https://upload.wikimedia.org/wikipedia/fr/thumb/e/eb/Logo_Afriland.png/250px-Logo_Afriland.png',
  'campost.png': 'https://www.google.com/s2/favicons?domain=campost.cm&sz=256',
  'nexttel.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Viettel_Group_en_logo.svg/250px-Viettel_Group_en_logo.svg.png',
  'dhl.svg': 'https://upload.wikimedia.org/wikipedia/commons/a/ac/DHL_Logo.svg',
  'orange.svg': 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Orange_logo.svg'
};

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
      } else if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 308) {
         download(response.headers.location, dest).then(resolve).catch(reject);
      } else {
        fs.unlink(dest, () => {});
        reject(`Status: ${response.statusCode}`);
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err.message);
    });
  });
}

async function run() {
  for (const [name, url] of Object.entries(urls)) {
    const dest = path.join(destDir, name);
    try {
      await download(url, dest);
      console.log(`OK: ${name}`);
    } catch (err) {
      console.log(`ERR: ${name} - ${err}`);
    }
  }
}

run();
