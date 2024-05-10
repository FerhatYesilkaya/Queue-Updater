# [DEUTSCH] Queue-Updater Chrome Extension

Der Queue-Updater ist eine Google Chrome Erweiterung und aktualisiert die Queue von Rexis automatisch nach einer bestimmten Zeit (konfigurierbar). Diese Erweiterung kann ganz einfach von euch installiert werden.

## Vorbedingung
- Google Chrome (mindestens Version 124.0.6367.119)
- Zugang zu Rexis

## Installationsanleitung

1. Ihr müsst dieses Projekt als ZIP-Datei runterladen
2. Legt die Datei entpackt auf dem Rechner ab, wo ihr es auf jeden Fall nicht löschen könnt. Achtet darauf, dass der Ordner nicht mehrere Unterverzeichnisse hat.
3. In dieser entpackten Datei ist eine weitere Daten mit dem Namen `config.ini`. Hier könnt ihr zwei Parameter anpassen. Mehr Information gibt es unter `Konfugirerbare Parameter`.
4. Öffnet euer Google Chrome
5. Klickt rechts oben auf die drei Punkte > Erweiterungen > Erweiterungen verwalten
6. Vergewissert euch, dass rechts oben "Entwicklermodus" aktiv ist
7. Links oben auf "Entpackte Erweiterung laden" klicken
8. Die entpackte Datei auswählen
9. Fertig

## Konfigurierbare Parameter

In der entpackten Datei ist eine weitere Datei mit der Bezeichnung `config.ini`, mit dem ihr zwei Parameter anpassen könnt:

- `default_queue (Typ: Text)`: Damit könnt ihr angeben, welche Queue immer neu geladen werden soll. Gibt dazu den Namen der Queue ein (muss identisch sein wie in REXIS). Falls ihr mehrere Queues aktualisieren wollt, dann könnt ihr die Namen mit einem `,` trennen. Achtet darauf, dass nach dem Komma kein Leerzeichen ist.

- `refresh_time_in_minutes (Typ: Nummer)`: Hier könnt ihr angeben, wie oft die Queue in Minuten aktualisiert werden soll. Ganzzahlen oder Fließkommazahlen sind erlaubt. 

Nachdem Parameter umgestellt wurden, muss der Queue-Updater aktualisiert werden. Dafür müsst ihr Schritt 5 befolgen und dort könnt ihr den Queue-Updater sehen. Dort müsst ihr auf das Refresh-Button klicken.

## Sonstiges
Es handelt sich hierbei um eine Überganglösung bis eine offizielle Variante zur Verfügung gestellt wird. Ich behalte mir vor dieses Projekt einzustellen oder dauerhaft von GitHub zu löschen. Des Weiteren bin ich für den Missbrauch dieser Google Erweiterung nicht verantwortlich.

# [ENGLISH] Queue-Updater Chrome Extension

The Queue-Updater is a Google Chrome extension that automatically updates the queue of Rexis after a specified time (configurable). This extension can be easily installed by following these steps:

## Prerequisite
- Google Chrome (at least Version 124.0.6367.119)
- Access to Rexis

## Installation Guide

1. Download this project as a ZIP file.
2. Unzip the file and place it on your computer where you won't accidentally delete it. Make sure the folder does not have multiple subdirectories.
3. In this unpacked file, there is another file named `config.ini`. Here you can configure two parameters. More information is available under `Configurable Parameters`.
4. Open your Google Chrome browser.
5. Click on the three dots in the top right corner > Extensions > Manage Extensions.
6. Ensure that "Developer mode" is activated in the top right corner.
7. Click on "Load unpacked" in the top left corner.
8. Select the unpacked file.
9. You're done!

## Configurable Parameters

In the unpacked file, there is another file named `config.ini`, where you can adjust two parameters:

- `default_queue (Type: Text)`: Specify which queue(s) should always be reloaded. Enter the name(s) of the queue(s) (must be identical to Rexis). If you want to update multiple queues, you can separate the names with a comma. Make sure there is no space after the comma.
- `refresh_time_in_minutes (Type: Number)`: Here you can specify how often the queue should be updated, in minutes. Integers or floating-point numbers are allowed.

After parameters have been changed, the Queue-Updater needs to be refreshed. To do this, follow step 5 and you will see the Queue-Updater there. Click on the refresh button.

## Miscellaneous

This is a temporary solution until an official version is made available. I reserve the right to discontinue or permanently delete this project from GitHub. Furthermore, I am not responsible for any misuse of this Google extension.
