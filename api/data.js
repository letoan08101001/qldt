const { MongoClient } = require('mongodb');

const dataId = 'app-data';
const dbName = process.env.MONGODB_DB || process.env.MONGO_DB || 'qldt';
const collectionName = process.env.MONGODB_COLLECTION || 'app_data';

let clientPromise;

function mongoUri() {
  return process.env.MONGODB_URI || process.env.MONGO_URL || process.env.DATABASE_URL || '';
}

function getClient() {
  const uri = mongoUri();
  if (!uri) {
    throw new Error('Chưa có biến môi trường MongoDB. Hãy kiểm tra MONGODB_URI trong Vercel Project Settings.');
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
      await collection.updateOne(
        { _id: dataId },
        { $set: { data: req.body || null, updatedAt: new Date() } },
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
