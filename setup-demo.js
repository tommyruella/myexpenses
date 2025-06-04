// Demo data setup script
const DEMO_TRANSACTIONS = [
  {
    descrizione: "Grocery Shopping",
    importo: 75.50,
    data_spesa: "2025-06-03",
    categoria: "FOOD",
    tipo: "USCITA"
  },
  {
    descrizione: "Salary Deposit",
    importo: 3200.00,
    data_spesa: "2025-06-01",
    categoria: "MISC",
    tipo: "ENTRATA"
  },
  {
    descrizione: "Metro Card Refill",
    importo: 25.00,
    data_spesa: "2025-06-02",
    categoria: "TRANSPORT",
    tipo: "USCITA"
  },
  {
    descrizione: "Gym Membership",
    importo: 45.00,
    data_spesa: "2025-06-01",
    categoria: "FITNESS",
    tipo: "USCITA"
  },
  {
    descrizione: "Coffee & Lunch",
    importo: 18.75,
    data_spesa: "2025-06-04",
    categoria: "FOOD",
    tipo: "USCITA"
  },
  {
    descrizione: "Uber Ride",
    importo: 12.50,
    data_spesa: "2025-06-03",
    categoria: "TRANSPORT",
    tipo: "USCITA"
  },
  {
    descrizione: "Freelance Payment",
    importo: 500.00,
    data_spesa: "2025-05-30",
    categoria: "MISC",
    tipo: "ENTRATA"
  },
  {
    descrizione: "Protein Powder",
    importo: 35.99,
    data_spesa: "2025-05-29",
    categoria: "FITNESS",
    tipo: "USCITA"
  }
];

async function addDemoData() {
  try {
    for (const transaction of DEMO_TRANSACTIONS) {
      const response = await fetch('http://localhost:3001/api/spese', {
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
