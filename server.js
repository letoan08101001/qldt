const fs = require('fs');
const http = require('http');
const path = require('path');

const rootDir = __dirname;
const dataFile = path.join(rootDir, 'app-data.json');
const port = Number(process.env.PORT || 3000);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function ensureDataFile() {
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, 'null\n', 'utf8');
}

function send(res, status, body, contentType = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': contentType });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 25 * 1024 * 1024) {
        reject(new Error('Request body is too large.'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function safeStaticPath(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split('?')[0]);
  const requested = cleanPath === '/' ? '/index.html' : cleanPath;
  const filePath = path.normalize(path.join(rootDir, requested));
  return filePath.startsWith(rootDir) ? filePath : null;
}

async function handleApi(req, res) {
  ensureDataFile();

  if (req.url !== '/api/data') {
    send(res, 404, JSON.stringify({ error: 'API endpoint not found.' }), 'application/json; charset=utf-8');
    return;
  }

  if (req.method === 'GET') {
    send(res, 200, fs.readFileSync(dataFile, 'utf8'), 'application/json; charset=utf-8');
    return;
  }

  if (req.method === 'PUT') {
    try {
      const body = await readBody(req);
      const parsed = JSON.parse(body);
      fs.writeFileSync(dataFile, `${JSON.stringify(parsed, null, 2)}\n`, 'utf8');
      send(res, 200, JSON.stringify({ ok: true }), 'application/json; charset=utf-8');
    } catch (error) {
      send(res, 400, JSON.stringify({ error: error.message }), 'application/json; charset=utf-8');
    }
    return;
  }

  if (req.method === 'DELETE') {
    fs.writeFileSync(dataFile, 'null\n', 'utf8');
    send(res, 200, JSON.stringify({ ok: true }), 'application/json; charset=utf-8');
    return;
  }

  send(res, 405, JSON.stringify({ error: 'Method not allowed.' }), 'application/json; charset=utf-8');
}

const server = http.createServer(async (req, res) => {
  if (req.url.startsWith('/api/')) {
    await handleApi(req, res);
    return;
  }

  const filePath = safeStaticPath(req.url);
  if (!filePath) {
    send(res, 403, 'Forbidden');
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      send(res, 404, 'Not found');
      return;
    }
    const contentType = mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    send(res, 200, content, contentType);
  });
});

server.listen(port, () => {
  ensureDataFile();
  console.log(`Dynamic web server running at http://localhost:${port}`);
});
