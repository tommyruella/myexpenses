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
  const grouped = Object.values(
    (data || []).reduce((acc: any, row: any) => {
      if (!acc[row.data]) acc[row.data] = { data: row.data, durata_secondi: 0 };
      acc[row.data].durata_secondi += Number(row.durata_secondi || 0);
      return acc;
    }, {} as Record<string, { data: string; durata_secondi: number }>)
  )
    .sort((a: any, b: any) => b.data.localeCompare(a.data))
    .slice(0, 5);
  res.status(200).json(grouped);
}