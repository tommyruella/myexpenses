import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (req.method === 'DELETE') {
    // const { error } = await supabase.from('expenses').delete().eq('id', id);
    // return res.status(204).end();
  } else if (req.method === 'PUT') {
    // const { data, error } = await supabase.from('expenses').update({...}).eq('id', id);
    // return res.status(200).json(data);
  } else {
    res.setHeader('Allow', ['DELETE', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
