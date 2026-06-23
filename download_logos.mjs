import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logos = [
  {
    name: 'mtn.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/MTN_Logo.svg'
  },
  {
    name: 'jumia.png',
    url: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Jumia_Group_logo.png'
  },
  {
    name: 'afriland.png',
    url: 'https://upload.wikimedia.org/wikipedia/fr/4/43/Logo_Afriland.png'
  },
  {
    name: 'campost.png',
    url: 'https://upload.wikimedia.org/wikipedia/fr/4/41/Campost_logo.png'
  },
  {
    name: 'nexttel.png',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Viettel_logo.svg/1200px-Viettel_logo.svg.png'
  }
];

const destDir = path.join(__dirname, 'public', 'assets', 'images');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };
    https.get(url, options, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
         // handle redirect
         download(response.headers.location, dest).then(resolve).catch(reject);
      } else {
        fs.unlink(dest, () => {});
        reject(`Failed to download ${url}: ${response.statusCode} - ${response.statusMessage}`);
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
      console.log(`Downloading ${logo.name}...`);
      await download(logo.url, dest);
      console.log(`Successfully downloaded ${logo.name}`);
    } catch (err) {
      console.error(`Error downloading ${logo.name}:`, err);
    }
  }
}

run();
