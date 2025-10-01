
# 📚 Bokhandel-App

En fullstackapplikation för att hantera en bokhandel, med stöd för CRUD-operationer på böcker, kunder, beställningar och rapporter. Backend är byggd med Express och MySQL2. Frontend är en enkel HTML/CSS/JS-baserad klient.

## 🛠️ Teknikstack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Databas:** MySQL2
- **Miljövariabler:** dotenv

---

## 📁 Mappstruktur

BOKHANDEL-SERVER/
├── backend/
│   ├── config/
│   │   └── db.js # Databasanslutning
│   ├── controllers/ # Logik för varje resurs
│   │   ├── bestallningarController.js
│   │   ├── bockerController.js
│   │   ├── kunderController.js
│   │   └── rapportController.js
│   ├── routes/ # API-endpoints per resurs
│   │   ├── bestallningar.js
│   │   ├── bocker.js
│   │   ├── kunder.js
│   │   └── rapport.js
│   ├── server.js # Startar Express-servern
│   ├── package-lock.json
│   ├── package.json
│   └── .env # Miljövariabler (ska ej pushas)
│
├── frontEnd/
│   └── public/
│       ├── index.html
│       ├── script.js
│       └── style.css
│
├── database/ # MySQL-databasfiler (kan vara SQL dump eller konfigurationsfiler)
│
├── .gitignore
├── README.md
└── node_modules/  # Node.js moduler (skapas vid installation)


## 1. Klona projektet

```bash
git clone https://github.com/Mustaf-Said/bokhandel-server.git
cd bokhandel-server/backend

## 2. ⚙️ Installation

npm install

## 3. Starta backend-servern

npm start

## 📥 Ladda ner bokhandelsdata

Om du vill använda bokhandelsdata i ditt projekt kan du ladda ner den färdiga exempeldatafilen bokhandelsdata från GitHub.
När du har hämtat filen kan du öppna den och anpassa den efter dina egna behov om så önskas.
För att använda datan i ditt projekt, se till att den är på rätt plats i projektet eller justera sökvägen i din kodkonfiguration för att läsa filen.

## 📄 Licens
MIT License. Fritt att använda och vidareutveckla.

## 👨‍💻 Utvecklare
Mustafa Said
GitHub-profil