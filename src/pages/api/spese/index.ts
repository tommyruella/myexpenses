import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Recupera tutte le spese
    const { data, error } = await supabase.from('expenses').select('*').order('data_spesa', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    // Ensure importo is a number and data_spesa is a YYYY-MM-DD string
    type SafeSpesa = {
      [key: string]: unknown;
      importo: number;
      data_spesa: string;
    };
    const safeData: SafeSpesa[] = (data || []).map((s: Record<string, unknown>) => ({
      ...s,
      importo: Number(s.importo),
      data_spesa: s.data_spesa ? new Date(String(s.data_spesa)).toISOString().slice(0, 10) : '',
    }));
    return res.status(200).json(safeData);
  } else if (req.method === 'POST') {
    // Inserisce una nuova spesa
    const { descrizione, importo, data_spesa, categoria, tipo } = req.body;
    if (!descrizione || !importo || !data_spesa || !categoria || !tipo) {
      return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
    }
    const { data, error } = await supabase.from('expenses').insert([
      { descrizione, importo, data_spesa, categoria, tipo }
    ]).select();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data && data[0]);
  } else if (req.method === 'DELETE') {
    // Cancella tutte le spese
    const { error } = await supabase.from('expenses').delete().neq('id', 0); // cancella tutto
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: 'Tutte le spese sono state cancellate.' });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
