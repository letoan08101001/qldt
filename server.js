const fs = require('fs');
const http = require('http');
const path = require('path');
const dataHandler = require('./api/data');

const rootDir = __dirname;
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

function send(res, status, body, contentType = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': contentType });
  res.end(body);
}

function safeStaticPath(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split('?')[0]);
  const requested = cleanPath === '/' ? '/index.html' : cleanPath;
  const filePath = path.normalize(path.join(rootDir, requested));
  return filePath.startsWith(rootDir) ? filePath : null;
}

function withVercelResponse(res) {
  res.status = (statusCode) => ({
    send: (body) => send(res, statusCode, body, res.getHeader('Content-Type') || 'application/json; charset=utf-8')
  });
  return res;
}

const server = http.createServer(async (req, res) => {
  const pathOnly = req.url.split('?')[0];

  if (pathOnly === '/api/data') {
    await dataHandler(req, withVercelResponse(res));
    return;
  }

  if (pathOnly.startsWith('/api/')) {
    send(res, 404, JSON.stringify({ error: 'API endpoint not found.' }), 'application/json; charset=utf-8');
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
  console.log(`Dynamic web server running at http://localhost:${port}`);
  console.log('Data API uses MongoDB. Set MONGODB_URI before starting this server.');
});
