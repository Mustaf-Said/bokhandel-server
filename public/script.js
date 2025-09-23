const api = 'http://localhost:3000';

// 🧍 Lägg till kund
document.getElementById('kundForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const data = Object.fromEntries(form.entries());
  await fetch(api + '/kunder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  alert('Kund tillagd');
  e.target.reset();
  hämtaKunder();
});

// 📚 Lägg till bok
document.getElementById('bokForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const data = Object.fromEntries(form.entries());
  data.Pris = parseFloat(data.Pris);
  data.LagerAntal = parseInt(data.LagerAntal);
  await fetch(api + '/bocker', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  alert('Bok tillagd');
  e.target.reset();
  hämtaBocker();
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

// 🧾 Visa beställningar
async function visaBestallningar() {
  const res = await fetch(api + '/bestallningar');
  const data = await res.json();
  const ul = document.getElementById('bestallningarLista');
  ul.innerHTML = data.map(b =>
    `<li><strong>${b.Namn}</strong> beställde "${b.Titel}" (${b.Antal} st) <br><strong>Datum</strong> ${b.Datum}</li>`
  ).join('');
}

// 🔃 Init
hämtaKunder();
hämtaBocker();
visaBestallningar();