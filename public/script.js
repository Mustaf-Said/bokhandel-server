const api = 'http://localhost:3000';

// 🧍 Lägg till kund
document.getElementById('kundForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const data = Object.fromEntries(form.entries());

  try {
    const response = await fetch(api + '/kunder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      // Läs felmeddelandet från servern om det inte är en OK-svar
      const errorData = await response.json();
      return alert('Fel: ' + errorData.error);
    }

    alert('Kund tillagd');
    e.target.reset();
    hämtaKunder();
  } catch (err) {
    console.error('Något gick fel:', err);  // Logga för felsökning
    alert('Ett fel inträffade när kunddata skickades. Försök igen senare.');
  }
});


// 📚 Lägg till bok
document.getElementById('bokForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const data = Object.fromEntries(form.entries());
  data.Pris = parseFloat(data.Pris);
  data.LagerAntal = parseInt(data.LagerAntal);

  try {
    const response = await fetch(api + '/bocker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return alert('Fel: ' + errorData.error);  // Visa serverns felmeddelande
    }

    alert('Bok tillagd');
    e.target.reset();
    hämtaBocker();
  } catch (err) {
    console.error('Något gick fel:', err);  // Logga för felsökning
    alert('Ett fel inträffade när bokdata skickades. Försök igen senare.');
  }
});


// 🛒 Skapa beställning
document.getElementById('orderForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const KundID = document.getElementById('kundSelect').value;
  const bokInputs = document.querySelectorAll('.bokRad input[type="number"]');
  const Bocker = Array.from(bokInputs)
    .filter(i => i.value > 0)
    .map(i => ({ BokID: i.dataset.bokid, Antal: parseInt(i.value) }));

  if (Bocker.length === 0) return alert('Välj minst en bok');

  const datum = new Date().toISOString().split('T')[0];

  await fetch(api + '/bestallningar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ KundID, Datum: datum, Bocker })
  });

  alert('Beställning skapad');
  e.target.reset();
  hämtaBocker(); // uppdatera lager
});

// 📥 Hämta kunder till dropdown
async function hämtaKunder() {
  const res = await fetch(api + '/kunder');
  const kunder = await res.json();
  const select = document.getElementById('kundSelect');
  select.innerHTML = kunder.map(k => `<option value="${k.KundID}">${k.Namn}</option>`).join('');
}

// 📦 Hämta böcker till checkboxlista
async function hämtaBocker() {
  const res = await fetch(api + '/bocker');
  const bocker = await res.json();
  const lista = document.getElementById('bokLista');
  lista.innerHTML = bocker.map(b => `
        <div class="bokRad">
          <label>${b.Titel} (${b.LagerAntal} i lager): </label>
          <input type="number" min="0" max="${b.LagerAntal}" data-bokid="${b.BokID}" />
        </div>
      `).join('');
}

let allaBestallningar = []; // Global variabel för alla beställningar

// 🧾 Hämta och visa beställningar (sorterade A–Ö)
async function visaBestallningar() {
  const res = await fetch(api + '/bestallningar');
  const data = await res.json();

  // Spara alla beställningar i en global variabel
  allaBestallningar = data.sort((a, b) => a.Namn.localeCompare(b.Namn, 'sv'));

  // Visa första gången utan filter
  renderaBestallningar(allaBestallningar);
}

// 📋 Rendera beställningar (filtrerad lista)
function renderaBestallningar(lista) {
  const ul = document.getElementById('bestallningarLista');
  ul.innerHTML = lista.map(b => {
    const datum = new Date(b.Datum);
    datum.setDate(datum.getDate());
    const datumStr = datum.toLocaleDateString();
    return `<li><strong>${b.Namn}</strong> beställde "${b.Titel}" (${b.Antal} st) <br><strong>Datum</strong> ${datumStr}</li>`;
  }).join('');
}

// 🔍 Lägg till sökfunktion
document.getElementById('sokBestallningar').addEventListener('input', (e) => {

  const sokterm = e.target.value.toLowerCase();

  const filtreradLista = allaBestallningar.filter(b =>
    b.Namn.toLowerCase().includes(sokterm) ||
    b.Titel.toLowerCase().includes(sokterm)
  );

  renderaBestallningar(filtreradLista);

  // Om sökningen matchar exakt ett namn eller boktitel => scrolla ner
  const exaktMatch = allaBestallningar.find(b =>
    b.Namn.toLowerCase() === sokterm || b.Titel.toLowerCase() === sokterm
  );

  if (exaktMatch) {
    // Scrolla till beställningslistan
    document.getElementById('bestallningarLista').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    e.target.value = '';
  }

});




// 🔃 Init
hämtaKunder();
hämtaBocker();
visaBestallningar();