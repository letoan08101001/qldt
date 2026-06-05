let memoryData = null;

module.exports = function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'GET') {
    res.status(200).send(JSON.stringify(memoryData));
    return;
  }

  if (req.method === 'PUT') {
    memoryData = req.body || null;
    res.status(200).send(JSON.stringify({ ok: true }));
    return;
  }

  if (req.method === 'DELETE') {
    memoryData = null;
    res.status(200).send(JSON.stringify({ ok: true }));
    return;
  }

  res.status(405).send(JSON.stringify({ error: 'Method not allowed.' }));
};
