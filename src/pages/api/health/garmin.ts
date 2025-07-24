import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const all = req.query.all === '1';
  let query = supabase
    .from('dati_garmin')
    .select('passi,battito_medio,distanza_totale,calorie_totali')
    .order('created_at', { ascending: false });

  if (!all) {
    query = query.limit(1);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  // Se all=1 ritorna array, altrimenti singolo oggetto
  if (all) {
    res.status(200).json(data);
  } else {
    res.status(200).json(Array.isArray(data) && data.length > 0 ? data[0] : null);
  }
}