import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Recupera tutte le spese
    const { data, error } = await supabase.from('expenses').select('*').order('data_spesa', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  } else if (req.method === 'POST') {
    // Inserisce una nuova spesa
    const { descrizione, importo, data_spesa, categoria } = req.body;
    if (!descrizione || !importo || !data_spesa || !categoria) {
      return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
    }
    const { data, error } = await supabase.from('expenses').insert([
      { descrizione, importo, data_spesa, categoria }
    ]).select();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data && data[0]);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
