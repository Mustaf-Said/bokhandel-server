
# 📚 Bokhandel-App

En fullstackapplikation för att hantera en bokhandel, med stöd för CRUD-operationer på böcker, kunder, beställningar och rapporter. Backend är byggd med Express och MySQL2. Frontend är en enkel HTML/CSS/JS-baserad klient.

## 🛠️ Teknikstack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Databas:** MySQL2
- **Miljövariabler:** dotenv

---

## 📁 Mappstruktur

/
├── backend/
│   ├── config/
│   │   └── db.js                # Databasanslutning
│   ├── controllers/             # Logik för varje resurs
│   │   ├── bestallningarController.js
│   │   ├── bockerController.js
│   │   ├── kunderController.js
│   │   └── rapportController.js
│   ├── routes/                  # API-endpoints per resurs
│   │   ├── bestallningar.js
│   │   ├── bocker.js
│   │   ├── kunder.js
│   │   └── rapport.js
│   ├── server.js                # Startar Express-servern
│   │── package.json
│   └── .env                     # Miljövariabler (ska ej pushas)

│
├── frontend/
│   └── public/
│       ├── index.html
│       ├── script.js
│       └── style.css
│
├
└── README.md

## 1. Klona projektet
```bash
git clone https://github.com/Mustaf-Said/bokhandel-server.git
cd bokhandel-server/backend

## 2. ⚙️ Installation
npm install

## 3. Starta backend-servern
npm start

📄 Licens
MIT License. Fritt att använda och vidareutveckla.

👨‍💻 Utvecklare
Mustafa Said
GitHub-profil