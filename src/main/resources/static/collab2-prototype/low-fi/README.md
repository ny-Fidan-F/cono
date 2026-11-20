# Collab 2 – Prototypen

Jede Variante enthält beide Widgets. Die Ideen unterscheiden sich in der Darstellung und Anordnung, nicht in der Projektlogik. Das CSS beschränkt sich auf Umrandungen, Balken oder Kreise.

Widget 1 startet beim Öffnen automatisch `demo-widget1.js`: Die Zuschauerzahl wird alle 2.5 Sekunden zufällig zwischen 20 und 180 gesetzt. Die Uhr läuft beschleunigt (2 Sekunden entsprechen 1 Simulationsminute), und alle 3 Simulationsminuten wird mit Basisrate 2 und Teiler 50 ein Sample berechnet. Nach 15 Simulationsminuten stoppt das aktuelle Item; ein Wechsel zum nächsten Item wird nicht ausgeführt. Das ist nur ein lokaler Testmodus, ohne Twitch- oder Backend-Verbindung. Widget 2 bleibt eine statische Übersicht mit Platzhalterwerten.

- `01-zeitbalken`: Zeitfortschritt als Balken.
- `02-kreisanzeige`: Item-Zeit als Kreisfortschritt; Item-Übersicht als Kreise.
- `03-sample-protokoll`: Zuwachs je Sample als Protokoll; Items als Warteschlange.

Startpunkt: `/collab2-prototype/low-fi/index.html`.
