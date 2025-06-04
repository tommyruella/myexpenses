import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Qui faremo: const { data, error } = await supabase.from('expenses').select('*');
    // return res.status(200).json(data);
  } else if (req.method === 'POST') {
    // Estrarre body (descrizione, importo, data_spesa, categoria)
    // const { data, error } = await supabase.from('expenses').insert([...]);
    // return res.status(201).json(data);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
