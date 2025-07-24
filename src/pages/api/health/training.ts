import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const { data, error } = await supabase
    .from('training_sessions')
    .select('data,tipo_attivita')
    .order('data', { ascending: false })
    .limit(5);
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
}