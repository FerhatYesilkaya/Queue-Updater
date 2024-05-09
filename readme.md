# [DEUTSCH] Queue-Updater Chrome Extension

Der Queue-Updater ist eine Google Chrome Erweiterung und aktualisiert die Queue von Rexis automatisch nach einer bestimmten Zeit (konfigurierbar). Diese Erweiterung kann ganz einfach von euch installiert werden.

## Vorbedingung
- Google Chrome (mindestens Version 124.0.6367.119)
- Zugang zu Rexis

## Installationsanleitung

1. Ihr müsst dieses Projekt als ZIP-Datei runterladen
2. Legt die Datei entpackt auf dem Rechner ab, wo ihr es auf jeden Fall nicht löschen könnt. Achtet darauf, dass der Ordner nicht mehrere Unterverzeichnisse hat.
3. Öffnet euer Google Chrome
4. Klickt rechts oben auf die drei Punkte > Erweiterungen > Erweiterungen verwalten
5. Vergewissert euch, dass rechts oben "Entwicklermodus" aktiv ist
6. Links oben auf "Entpackte Erweiterung laden" klicken
7. Die entpackte Datei auswählen
8. Nach dem ersten import der Goolge Erweiterung muss während Rexis geöffnet ist einmal das PopUp geöffnet und die Auswahl geändert werden (auch wenn es schon richtig eingestellt ist). Der Fix dafür ist noch in Arbeit.
9. Fertig

## PopUp-Ansicht
Wenn ihr auf die Erweiterung im Chrome Browser klickt, dann öffnet sich ein PopUp. Dort könnt ihr die Queue auswählen, die aktualisiert werden soll. Der Standard ist: `DACH - Service - IT`

## Konfigurierbare Parameter

In der entpackten Datei ist eine weitere Datei mit der Bezeichnung `config.ini`, mit dem ihr zwei Parameter anpassen könnt:

- `default_queue (Typ: Text)`: Damit könnt ihr angeben, welche Queue immer neu geladen werden soll. Gibt dazu den Namen der Queue ein (muss identisch sein). Durch die PopUp-Ansicht kann man auch zwar die Einstellung vornehmen (Die ersten 8 Queues in der Ausawhlliste von Rexis), aber da diese Einstellung im lokalen Storage gespeichert ist, kann es nicht gewährleistet werden, dass immer die richtige Queue geladen wird.

- `refresh_time_in_minutes (Typ: Nummer)`: Hier könnt ihr angeben, wie oft die Queue in Minuten aktualisiert werden soll. Ganzzahlen oder Fließkommazahlen sind erlaubt. 

## Sonstiges
Es handelt sich hierbei um eine Überganglösung bis eine offizielle Variante zur Verfügung gestellt wird. Ich behalte mir vor dieses Projekt einzustellen oder dauerhaft von GitHub zu löschen. Des Weiteren bin ich für den Missbrauch dieser Google Erweiterung nicht verantwortlich.

# [ENGLISH] Queue-Updater Chrome Extension

The Queue-Updater is a Google Chrome extension that automatically updates the queue of Rexis after a specified time (configurable). This extension can be easily installed.

## Prerequisite
- Google Chrome (at least Version 124.0.6367.119)
- Access to Rexis

## Installation Guide

1. Download this project as a ZIP file.
2. Unzip the file and place it on your computer where you won't accidentally delete it. Make sure the folder does not have multiple subdirectories.
3. Open your Google Chrome browser.
4. Click on the three dots in the top right corner > Extensions > Manage Extensions.
5. Ensure that "Developer mode" is activated in the top right corner.
6. Click on "Load unpacked" in the top left corner.
7. Select the unpacked file.
8. After the initial import of the Google extension, once Rexis is open, the pop-up must be opened and the selection changed at least once (even if it's already set correctly). The fix for this issue is still in progress.
9. You're done!

## Pop-Up View
When you click on the extension in the Chrome browser, a pop-up opens. There, you can select the queue that you want to update. The default is: `DACH - Service - IT`.

## Configurable Parameters

In the unpacked file, there is another file named `config.ini`, where you can adjust two parameters:

- `default_queue (Type: Text)`: Specify which queue should always be reloaded. Enter the name of the queue (must be identical). Although you can make this setting through the pop-up view (the first 8 queues in the Rexis selection list), since this setting is stored in local storage, it cannot be guaranteed that the correct queue will always be loaded.

- `refresh_time_in_minutes (Type: Number)`: Here you can specify how often the queue should be updated, in minutes. Integers or floating-point numbers are allowed.

## Miscellaneous
This is a temporary solution until an official version is made available. I reserve the right to discontinue or permanently delete this project from GitHub. Furthermore, I am not responsible for any misuse of this Google extension.
