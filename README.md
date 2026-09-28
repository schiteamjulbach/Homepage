# Veranstaltungsplattform – Schiteam Julbach

Next.js auf Vercel, Neon/PostgreSQL für Veranstaltungen und Anmeldungen,
Vercel Blob für Bilder. Für den Betrieb ist kein Cloudflare-Konto nötig.

## Vercel einmalig einrichten

1. Das GitHub-Repository schiteamjulbach/Homepage mit dem Vercel-Projekt verbinden.
   Root Directory ist die Repository-Wurzel, Framework Preset ist Next.js.
   Node.js 24.x verwenden. Einen alten Install-Command-Override entfernen.
   vercel.json setzt Build Command auf npm run build und Output Directory auf .next.
2. Im Projekt unter Storage eine **Neon/Postgres**-Datenbank über den Vercel Marketplace
   anlegen und mit dem Projekt verbinden. Eine EU-Region in der Nähe der App wählen.
   Die Integration muss DATABASE_URL bereitstellen (Standardpräfix verwenden).
3. Unter Storage einen **Vercel Blob**-Store mit Zugriff **Public** anlegen und
   mit dem Projekt verbinden. Dadurch wird BLOB_READ_WRITE_TOKEN bereitgestellt.
   Dort werden nur Veranstaltungsbilder gespeichert, keine Teilnehmerdaten.
4. Unter Settings → Environment Variables ein starkes ADMIN_PASSWORD setzen.
   Der Benutzername ist admin. Keine Geheimnisse in Git oder Chat einfügen.
5. Nach dem Verbinden und Setzen der Variablen neu deployen. Für Preview eine
   eigene Testdatenbank und einen eigenen Test-Bildspeicher verwenden.

| Variable | Zweck |
| --- | --- |
| DATABASE_URL | Neon-Postgres-Verbindungsadresse aus der Integration |
| BLOB_READ_WRITE_TOKEN | Token des verbundenen öffentlichen Blob-Stores |
| ADMIN_PASSWORD | Passwort für den Adminbereich |

Die Datenbanktabellen werden beim ersten API-Aufruf automatisch und transaktional
angelegt. Der Build selbst benötigt keine Zugangsdaten. Ohne DATABASE_URL kann die
HTML-Seite ausgeliefert werden, Veranstaltungen und Anmeldungen jedoch nicht.
Ohne Blob-Token sind neue Bild-Uploads nicht möglich. Variablen niemals mit
NEXT_PUBLIC_ versehen. Nach Änderungen an Vercel-Variablen neu deployen.

## Datenbestand und Betrieb

Diese Umstellung überträgt **keine bisherigen Cloudflare-Daten**. Ohne Zugriff auf
bisheriges Sites/D1/R2 ist ein Export nicht möglich. Eine neue Datenbank startet
wie bisher mit einem Kinderskikurs und zehn ausdrücklich fiktiven Testteilnehmern.
Diese vor echtem Betrieb im Adminbereich entfernen. Bestehende hochgeladene Bilder
müssen neu hochgeladen werden; die mitgelieferten Dateien unter public/ bleiben erhalten.

Sitzungen laufen nach acht Stunden ab. Eine Änderung von ADMIN_PASSWORD macht
bestehende Admin-Sitzungen ungültig. Schreibvorgänge werden innerhalb einer
Postgres-Transaktion gesperrt, damit gleichzeitige Anmeldungen das Teilnehmerlimit
nicht überschreiten. Die Sperre gilt für die ganze Plattform und eignet sich für
kleine Vereinsveranstaltungen; bei hohem Schreibaufkommen kann sie Wartezeit erzeugen.

Bilder dürfen maximal 4 MB groß sein, damit Uploads unter Vercels Request-Limit
bleiben. Gespeicherte E-Mail-Vorlagen lösen weiterhin noch keinen E-Mail-Versand aus.

## Lokal entwickeln und prüfen

Node.js 22.13 oder neuer verwenden (empfohlen 24). .env.example als .env.local
kopieren und nur mit Testressourcen befüllen.

```sh
npm ci
npm run dev
npm run build
npm start
npm test
```

Die Tests verwenden isoliertes, eingebettetes PostgreSQL (PGlite) und einen
simulierten Blob-Speicher. Sie führen echte SQL-Abfragen und Node-Route-Handler aus,
prüfen Rechte, Anmeldungen, Warteliste, Persistenz, Bilder und Fehlerfälle und greifen
nicht auf Produktionsressourcen zu. Die HTTP-Verbindung zu Neon und Blob wird erst
nach Einrichtung der echten Dienste in Vercel geprüft.

Das initiale Postgres-Schema steht in db/postgres-schema.ts. db/schema.ts und
drizzle.config.ts beschreiben das Postgres-Modell für zukünftige Migrationen;
npm run db:generate schreibt nach drizzle-postgres/. Neue Schemaänderungen benötigen
eine eigene, geprüfte Migration; CREATE TABLE IF NOT EXISTS aktualisiert bestehende
Tabellen nicht automatisch. Die alten SQLite-Migrationen unter drizzle/ nicht
auf Postgres anwenden. Alte Sites/Vinext-Dateien sind historischer Altbestand;
Start und Build verwenden ausschließlich Next.js.

Nach dem Deployment Homepage, Admin-Anmeldung, Testanmeldung, Warteliste und
Bild-Upload prüfen. Das Projekt muss für die Vercel-Verbindung in Codex freigegeben
sein, damit Deployment-Status und Einstellungen darüber gelesen werden können.

Quellen: [Postgres in Vercel](https://vercel.com/docs/postgres),
[Vercel Blob](https://vercel.com/docs/vercel-blob),
[Vercel-Limits](https://vercel.com/docs/functions/limitations).

### Adressregel und Anmeldezeitraum

Neue öffentliche Anmeldungen benötigen Adresse (Straße/Hausnummer), PLZ und Ort. Der bisherige Schalter `onlyWaitlist` / die Spalte `only_waitlist` heißt in der Oberfläche „Warteliste für externe“: Bei Aktivierung gehen Anmeldungen außerhalb der Kombination 4162 + Julbach auf die Warteliste. Groß-/Kleinschreibung und äußere Leerzeichen werden normalisiert. Diese Regel gilt unabhängig von der allgemeinen Warteliste bei voller Kapazität. Manuelle Bestätigungen bleiben möglich und unterliegen dem Teilnehmerlimit. Bereits gespeicherte Anmeldungen werden nicht umgestuft; die neue additive Migration lässt unbekannte Adressen leer.

Sind Beginn und Ende gesetzt, hat der Zeitraum Vorrang vor `active` (Beginn inklusive, Ende exklusiv). Sonst bleibt der manuelle Schalter maßgeblich, zusätzlich begrenzt durch eventuell vorhandene einzelne Zeitgrenzen. Der Server prüft den Zeitraum bei jeder Anmeldung. Der Admin-Schalter zeigt bei vollständigem Zeitraum den effektiven Status; der gespeicherte manuelle Wert bleibt für das spätere Entfernen des Zeitraums erhalten.
