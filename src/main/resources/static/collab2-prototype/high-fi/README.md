# Prototypen mit Design

Die gestalteten Prototypen liegen in eigenen Unterordnern. Jeder Prototyp hat zwei getrennte Widget-Seiten für OBS.

- `index.html` – Übersicht mit Links zu den Widget-Seiten
- `prototype-1-v2/widget1-aktuelles-item.html` – OBS-Widget für das aktuelle Item
- `prototype-1-v2/widget2-item-uebersicht.html` – OBS-Widget für die Item-Übersicht
- `prototype-1-v2/styles.css` – Gestaltung nach dem Figma-Prototyp
- `shared/accumulation.js` – gemeinsame Berechnung für Zuschauerwerte, Zeit, Samples und Akkumulation
- `shared/widget2-state.js` – gemeinsame Übertragung der aktuellen Werte an Widget 2
- `prototype-1-v2/widget1-view.js` – zeigt die gemeinsamen Werte im Balken-Design von Prototype 1
- `prototype-2-v2/widget1-aktuelles-item.html` – Widget 1 mit Zeitfortschritt als Kreis
- `prototype-2-v2/widget2-item-uebersicht.html` – Widget 2 mit vier Item-Kreisen
- `prototype-2-v2/styles.css` – Gestaltung von Prototype 2 V2
- `prototype-2-v2/widget1-view.js` – zeigt dieselben gemeinsamen Werte im Kreis-Design von Prototype 2
- `prototype-3-v2/widget1-sample-protokoll.html` – Widget 1 als Sample-Protokoll mit den letzten drei Samples
- `prototype-3-v2/widget2-item-warteschlange.html` – Widget 2 als Warteschlange mit aktuellem und folgenden Items
- `prototype-3-v2/styles.css` – Gestaltung für die beiden Widgets von Prototype 3
- `prototype-3-v2/widget1-view.js` – zeigt neue Sample-Werte als Tabellenzeilen

Beide Prototypen verwenden dieselbe Berechnung. Widget 1 berechnet und sendet die Werte; Widget 2 empfängt sie. Die einzelnen `widget1-view.js`-Dateien enthalten nur noch die Anzeige passend zum jeweiligen Design.

Die Widgets sind im laufenden Spring-Boot-Projekt unter `/collab2-prototype/high-fi/prototype-1-v2/` beziehungsweise `/collab2-prototype/high-fi/prototype-2-v2/` erreichbar. Die Low-Fi-Ideen bleiben in `../low-fi/`.
