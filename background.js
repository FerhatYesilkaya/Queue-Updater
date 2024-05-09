
const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 20e3);
chrome.runtime.onStartup.addListener(keepAlive);
keepAlive();

function clickSpanPeriodically() {
  chrome.storage.sync.get('selectedDropDownOption', (data) => { // Ändern Sie den Key auf 'selectedDropDownOption'
    const selectedOption = data.selectedDropDownOption;
    if (selectedOption !== undefined) {
      chrome.storage.sync.get("currentSelectedView", function(result) {
        if(result.currentSelectedView === data.selectedDropDownOption.text){
          const selectedIndex = selectedOption.index; // Ändern Sie den Namen des Indexattributs entsprechend Ihrer Speicherstruktur
          clickSpanAtIndex(selectedIndex); // Rufen Sie die Funktion zum Klicken auf das Span-Element mit dem ausgewählten Index auf
        }
      });
    }
  });
}

// Periodisches Ausführen der Klickfunktion alle 10 Sekunden

getDataFromIniFile("configurable_parameters",'refresh_time_in_minutes', function(value) {
  if (value !== null) {
      console.log('Wert aus INI-Datei:', value);
      setInterval(clickSpanPeriodically, parseInt(value)*60000);
      setInterval(getTextFromSpanPeriodically, parseInt(value)*60000-250);
  } else {
      console.error('Fehler beim Abrufen des Werts aus der INI-Datei - ' + "background.js - "+ "main");
      setInterval(clickSpanPeriodically, 11000);
      setInterval(getTextFromSpanPeriodically, 10000);
  }
});

// Funktion zum Klicken auf das definierte Span-Element basierend auf dem empfangenen Index
function clickSpanAtIndex(index) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      const tabId = tab.id;
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: (index) => {
          const spans = document.querySelectorAll(`span.virtualAutocompleteOptionText`);
          if (spans.length > index) {
            spans[index].click(); // Klicke auf das Span-Element mit dem empfangenen Index
          } else {
            console.error('Invalid index or no span elements found with the specified class.');
          }
        },
        args: [index]
      });
    });
  });

}

function getTextFromSpanPeriodically() {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      const tabId = tab.id;
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: () => {
          const spans = document.querySelectorAll('span.selectedListView');
          if (spans.length > 0) {
            const spanText = spans[0].textContent;
            // Hier können Sie den Text des Span-Elements verwenden oder weitere Verarbeitungen durchführen
            chrome.storage.sync.set({ "currentSelectedView": spanText });
          } else {
            console.error('Kein Span-Element mit der angegebenen Klasse gefunden.');
          }
        }
      });
    });
  });
}

function processIniFile(fileUrl, callback) {
  fetch(fileUrl)
      .then(response => response.text())
      .then(text => {
          const lines = text.split('\n');
          const data = {};
          let currentSection = null;

          lines.forEach(line => {
              line = line.trim();

              // Ignore comments and empty lines
              if (line.startsWith(';') || line === '') {
                  return;
              }

              // Check for section headers
              if (line.startsWith('[') && line.endsWith(']')) {
                  currentSection = line.substring(1, line.length - 1);
                  data[currentSection] = {};
                  return;
              }

              // Parse key-value pairs
              const keyValue = line.split('=');
              if (keyValue.length === 2 && currentSection !== null) {
                  const key = keyValue[0].trim();
                  const value = keyValue[1].trim();
                  data[currentSection][key] = value;
              }
          });

          callback(data);
      })
      .catch(error => {
          console.error('Error reading INI file:', error);
      });
}


function getDataFromIniFile(section,key, callback){
  processIniFile('config.ini', function(data) {
    if (data) {
        console.log('INI-Daten erfolgreich gelesen:');
        console.log(data[section][key]);
        callback(data[section][key]);
    } else {
        console.error('Fehler beim Lesen der INI-Datei - ' + "getDataFromIniFile");
    }
  });
}


function writeIniValue(fileUrl="config.ini", section="parameters", key, value, callback) {
  // Erstelle den INI-Text für den einzelnen Wert
  const iniText = `[${section}]\n${key} = ${value}\n`;

  // Schreibe den INI-Text in die Datei
  fetch(fileUrl, {
      method: 'POST', // Du könntest auch PUT verwenden, wenn du den gesamten Inhalt überschreiben möchtest
      body: iniText
  })
  .then(response => {
      if (response.ok) {
          callback(true);
      } else {
          console.error('Fehler beim Schreiben des Werts in die INI-Datei:', response.statusText);
          callback(false);
      }
  })
  .catch(error => {
      console.error('Fehler beim Schreiben des Werts in die INI-Datei:', error);
      callback(false);
  });
}

