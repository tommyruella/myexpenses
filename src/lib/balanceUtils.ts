import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Spesa {
  id: number;
  descrizione: string;
  importo: number;
  data_spesa: string;
  categoria: string;
  tipo: "USCITA" | "ENTRATA";
}

export async function fetchSpese(): Promise<Spesa[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('data_spesa', { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
}

export function computeChartData(spese: Spesa[], initialSaldo: number = 0) {
  let runningSaldo = initialSaldo;
  return spese.map(s => {
    runningSaldo += s.tipo === "ENTRATA" ? s.importo : -s.importo;
    return { date: s.data_spesa, saldo: runningSaldo };
  });
}
