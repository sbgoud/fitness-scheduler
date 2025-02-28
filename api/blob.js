import { put, get } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { user } = req.query;
    const { url } = await put(`users/${user}.json`, req.body, {
      access: 'public',
      addRandomSuffix: false
    });
    return res.status(200).json({ url });
  }

  if (req.method === 'GET') {
    const { user } = req.query;
    const blob = await get(`users/${user}.json`);
    return res.status(200).json(blob);
  }

  res.status(405).end();
}