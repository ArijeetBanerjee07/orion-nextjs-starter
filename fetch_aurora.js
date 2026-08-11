const https = require('https');
const fs = require('fs');

const urls = [
  "https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/components/Backgrounds/Aurora/Aurora.tsx",
  "https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/components/Backgrounds/Aurora/Aurora.jsx",
  "https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/blocks/Backgrounds/Aurora/Aurora.tsx",
  "https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/blocks/Backgrounds/Aurora/Aurora.jsx",
  "https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/components/Aurora/Aurora.tsx",
  "https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/components/Aurora/Aurora.jsx",
  "https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/content/Backgrounds/Aurora/Aurora.tsx",
  "https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/content/Backgrounds/Aurora/Aurora.jsx"
];

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 && !data.startsWith("404")) {
          resolve(data);
        } else {
          resolve(null);
        }
      });
    }).on('error', (err) => resolve(null));
  });
}

async function run() {
  for (const url of urls) {
    console.log("Trying", url);
    const data = await fetchUrl(url);
    if (data) {
      console.log("FOUND!");
      fs.writeFileSync("components/AuroraBackground.tsx", data);
      break;
    }
  }
}

run();
