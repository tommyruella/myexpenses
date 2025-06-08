// Demo data setup script
// Demo data setup script
const DEMO_TRANSACTIONS = [
  { descrizione: "colazione china", importo: 3.00, data_spesa: "2025-01-01", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "profumo", importo: 17.90, data_spesa: "2025-01-03", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "benza", importo: 50.00, data_spesa: "2025-01-05", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "palestra", importo: 59.00, data_spesa: "2025-01-07", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "libro", importo: 23.00, data_spesa: "2025-01-08", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "stipendio", importo: 1652.00, data_spesa: "2025-01-10", categoria: "MISC", tipo: "ENTRATA" },
  { descrizione: "pane", importo: 7.00, data_spesa: "2025-01-11", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "walid", importo: 5.00, data_spesa: "2025-01-15", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "ricarica ho.", importo: 10.00, data_spesa: "2025-01-18", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "benza + treno", importo: 52.80, data_spesa: "2025-01-24", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "regali dave-dario", importo: 6.60, data_spesa: "2025-01-25", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "abbon. treno + mensa", importo: 24.00, data_spesa: "2025-01-27", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "mensa", importo: 10.00, data_spesa: "2025-01-28", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "brownie + coffe", importo: 12.60, data_spesa: "2025-01-31", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "sushi", importo: 33.15, data_spesa: "2025-02-02", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "abbon. treno + pizza", importo: 30.90, data_spesa: "2025-02-04", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "colaz + mensa", importo: 8.10, data_spesa: "2025-02-06", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "cawello + bowling", importo: 30.50, data_spesa: "2025-02-07", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "palestra", importo: 59.00, data_spesa: "2025-02-10", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "mensa + treno", importo: 15.60, data_spesa: "2025-02-12", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "panino + treno", importo: 10.10, data_spesa: "2025-02-13", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "stipendio", importo: 848.00, data_spesa: "2025-02-14", categoria: "MISC", tipo: "ENTRATA" },
  { descrizione: "pizza", importo: 7.50, data_spesa: "2025-02-15", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "coffe", importo: 3.00, data_spesa: "2025-02-16", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "treno", importo: 5.60, data_spesa: "2025-02-17", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "benza + treno", importo: 55.60, data_spesa: "2025-02-21", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "brioches", importo: 23.95, data_spesa: "2025-02-22", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "posterlab", importo: 37.00, data_spesa: "2025-02-23", categoria: "MISC", tipo: "ENTRATA" },
  { descrizione: "abbon. treno", importo: 19.00, data_spesa: "2025-02-24", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "regali", importo: 10.00, data_spesa: "2025-02-25", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "hood FG", importo: 52.62, data_spesa: "2025-02-26", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "iphone 13", importo: 390.90, data_spesa: "2025-02-28", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "colaz", importo: 6.20, data_spesa: "2025-03-01", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "hood scuffers", importo: 82.15, data_spesa: "2025-03-06", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "regalo eli", importo: 6.00, data_spesa: "2025-03-08", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "ricarica ho.", importo: 10.00, data_spesa: "2025-03-10", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "mensa + coffee", importo: 11.30, data_spesa: "2025-03-11", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "cinema", importo: 10.80, data_spesa: "2025-03-12", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "stipendio", importo: 699.00, data_spesa: "2025-02-14", categoria: "MISC", tipo: "ENTRATA" }, // ripetuto "14 feb"
  { descrizione: "bowling + shampoo", importo: 13.68, data_spesa: "2025-03-15", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "ASOS + FG", importo: 122.23, data_spesa: "2025-03-16", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "gym", importo: 59.00, data_spesa: "2025-03-17", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "cena papà", importo: 18.00, data_spesa: "2025-03-19", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "benzina", importo: 55.80, data_spesa: "2025-03-21", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "pizza cinemini", importo: 16.50, data_spesa: "2025-03-22", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "mensa", importo: 5.00, data_spesa: "2025-03-26", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "panino", importo: 6.50, data_spesa: "2025-03-28", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "mc", importo: 14.00, data_spesa: "2025-03-29", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "aperitif", importo: 8.00, data_spesa: "2025-03-30", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "cover", importo: 15.00, data_spesa: "2025-04-03", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "regali", importo: 10.00, data_spesa: "2025-04-04", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "storno ASOS", importo: 36.25, data_spesa: "2025-04-05", categoria: "MISC", tipo: "ENTRATA" },
  { descrizione: "mensa", importo: 8.50, data_spesa: "2025-04-09", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "coca + walid", importo: 10.00, data_spesa: "2025-04-11", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "benzina", importo: 50.00, data_spesa: "2025-04-12", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "profumo", importo: 17.90, data_spesa: "2025-04-13", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "aperitif + mensa", importo: 25.80, data_spesa: "2025-04-14", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "stipendio", importo: 757.00, data_spesa: "2025-04-15", categoria: "MISC", tipo: "ENTRATA" },
  { descrizione: "gym", importo: 59.00, data_spesa: "2025-04-16", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "pastiera + serata", importo: 24.90, data_spesa: "2025-04-18", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "ASOS", importo: 55.78, data_spesa: "2025-04-19", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "haircut", importo: 20.00, data_spesa: "2025-04-22", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "pranzo", importo: 14.80, data_spesa: "2025-04-24", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "mensa", importo: 10.00, data_spesa: "2025-04-29", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "storno ASOS", importo: 55.78, data_spesa: "2025-05-03", categoria: "MISC", tipo: "ENTRATA" },
  { descrizione: "benza", importo: 50.00, data_spesa: "2025-05-04", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "mensa", importo: 10.00, data_spesa: "2025-05-05", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "mensa", importo: 13.50, data_spesa: "2025-05-06", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "t-shirt FG", importo: 35.00, data_spesa: "2025-05-07", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "pizza+drink", importo: 20.63, data_spesa: "2025-05-09", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "fiori + regalo fra", importo: 28.40, data_spesa: "2025-05-11", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "mensa", importo: 5.00, data_spesa: "2025-05-13", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "mensa", importo: 8.00, data_spesa: "2025-05-14", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "stipendio", importo: 794.00, data_spesa: "2025-05-15", categoria: "MISC", tipo: "ENTRATA" },
  { descrizione: "regalo", importo: 8.00, data_spesa: "2025-05-16", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "gym", importo: 59.00, data_spesa: "2025-05-17", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "ricarica ho.", importo: 5.00, data_spesa: "2025-05-18", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "drink", importo: 6.00, data_spesa: "2025-05-19", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "mensa", importo: 13.00, data_spesa: "2025-05-22", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "cheescake", importo: 8.00, data_spesa: "2025-05-26", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "mensa", importo: 5.00, data_spesa: "2025-05-27", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "cena coop", importo: 22.00, data_spesa: "2025-05-29", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "mensa", importo: 10.00, data_spesa: "2025-05-30", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "mc", importo: 6.90, data_spesa: "2025-05-31", categoria: "MISC", tipo: "USCITA" },
  { descrizione: "pranzo + mc", importo: 8.60, data_spesa: "2025-06-03", categoria: "MISC", tipo: "USCITA" },
];

async function addDemoData() {
  try {
    for (const transaction of DEMO_TRANSACTIONS) {
      const response = await fetch('http://localhost:3000/api/spese', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });
      
      if (response.ok) {
        console.log(`✅ Added: ${transaction.descrizione}`);
      } else {
        const error = await response.json();
        console.log(`❌ Failed to add ${transaction.descrizione}:`, error);
      }
    }
    console.log('\n🎉 Demo data setup complete!');
  } catch (error) {
    console.error('Error setting up demo data:', error);
  }
}

// Run the setup
addDemoData();
