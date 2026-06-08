const { MongoClient } = require('mongodb');

const dataId = 'app-data';
const dbName = process.env.MONGODB_DB || process.env.MONGO_DB || 'qldt';
const collectionName = process.env.MONGODB_COLLECTION || 'app_data';
const maxBodySize = 25 * 1024 * 1024;

let clientPromise;

function mongoUri() {
  return process.env.MONGODB_URI || process.env.MONGO_URL || process.env.DATABASE_URL || '';
}

function getClient() {
  const uri = mongoUri();
  if (!uri) {
    throw new Error('Missing MongoDB connection string. Set MONGODB_URI in Vercel Project Settings.');
  }
  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
  }
  return clientPromise;
}

async function getCollection() {
  const client = await getClient();
  return client.db(dbName).collection(collectionName);
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > maxBodySize) {
        reject(new Error('Request body is too large.'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

async function requestBody(req) {
  if (req.body !== undefined) {
    if (typeof req.body === 'string') return req.body ? JSON.parse(req.body) : null;
    return req.body;
  }
  const raw = await readRawBody(req);
  return raw ? JSON.parse(raw) : null;
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  try {
    const collection = await getCollection();

    if (req.method === 'GET') {
      const doc = await collection.findOne({ _id: dataId });
      res.status(200).send(JSON.stringify(doc?.data ?? null));
      return;
    }

    if (req.method === 'PUT') {
      const body = await requestBody(req);
      await collection.updateOne(
        { _id: dataId },
        { $set: { data: body, updatedAt: new Date() } },
        { upsert: true }
      );
      res.status(200).send(JSON.stringify({ ok: true }));
      return;
    }

    if (req.method === 'DELETE') {
      await collection.deleteOne({ _id: dataId });
      res.status(200).send(JSON.stringify({ ok: true }));
      return;
    }

    res.status(405).send(JSON.stringify({ error: 'Method not allowed.' }));
  } catch (error) {
    res.status(500).send(JSON.stringify({ error: error.message }));
  }
};
