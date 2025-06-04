import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id;
  if (req.method === 'DELETE') {
    // Elimina la spesa con l'ID specificato
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(204).end();
  } else if (req.method === 'PUT') {
    // Modifica una spesa esistente
    const { descrizione, importo, data_spesa, categoria } = req.body;
    const { data, error } = await supabase.from('expenses').update({ descrizione, importo, data_spesa, categoria }).eq('id', id).select();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data && data[0]);
  } else {
    res.setHeader('Allow', ['DELETE', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
