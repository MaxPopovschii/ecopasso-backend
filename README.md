# 🌱 EcoPasso Backend

> **Il backend NestJS per calcolare e tracciare la tua impronta ecologica.**  
> _Un progetto "stupido" ma green di Maxim Popovschii e Giovanni Traini._

---

## 🚀 Descrizione

Applicazione server-side che permette agli utenti di:
- Registrarsi e gestire il proprio profilo
- Inserire attività quotidiane (alimentazione, casa, trasporti)
- Calcolare automaticamente la propria impronta ecologica (CO₂)
- Visualizzare statistiche e breakdown delle emissioni

---

## ⚡️ Setup progetto

```bash
npm install
```

---

## ▶️ Avvio del progetto

```bash
# modalità sviluppo
npm run start

# modalità watch (hot reload)
npm run start:dev

# modalità produzione
npm run start:prod
```

---

## 🧪 Test

```bash
# unit test
npm run test

# end-to-end test
npm run test:e2e

# copertura test
npm run test:cov
```

---

## 🗄️ Database

- **Database:** MySQL
- Assicurati che il database sia attivo e che le credenziali in `app.module.ts` o nel file di configurazione siano corrette.
- Tabelle principali:  
  - `utenti` (users)  
  - `attivita` (activities)  
  - `tipi_attivita` (activity types)

---

## 🛠️ Funzionalità principali

- ✅ Registrazione e gestione utenti (email come chiave primaria)
- ✅ Inserimento attività (alimentazione, casa, trasporti)
- ✅ Calcolo automatico dell’impronta ecologica per utente
- ✅ API REST documentate con Swagger (`/api`)

---

## 👨‍💻 Autore

**Maxim Popovschii**  
Progetto per esercizio/studio (e per salvare il pianeta, forse).

---

## 📄 Licenza

MIT

---

> _“Non ereditiamo la Terra dai nostri antenati, la prendiamo in prestito dai nostri figli.”_
