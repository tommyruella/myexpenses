import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const { data, error } = await supabase
    .from('sleeping_data')
    .select('data, durata_secondi')
    .order('data', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  // Raggruppa e somma lato API
  type SleepRow = { data: string; durata_secondi: number };
  const grouped = Object.values(
    (data || []).reduce((acc: Record<string, SleepRow>, row: SleepRow) => {
      if (!acc[row.data]) acc[row.data] = { data: row.data, durata_secondi: 0 };
      acc[row.data].durata_secondi += Number(row.durata_secondi || 0);
      return acc;
    }, {} as Record<string, SleepRow>)
  )
    .sort((a, b) => b.data.localeCompare(a.data))
    .slice(0, 5);
  res.status(200).json(grouped);
}