
const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 20e3);
chrome.runtime.onStartup.addListener(keepAlive);
keepAlive();

function clickSpanPeriodically() {
  chrome.storage.sync.get('default_queue', (data) => { 
    const selectedOption = data.default_queue;
    if (selectedOption !== undefined) {
      chrome.storage.sync.get("currentSelectedView", function (result) {
        for (let i = 0; i < data.default_queue.text.length; i++) {
          console.log(data.default_queue.text[i]);
          if (result.currentSelectedView === data.default_queue.text[i]) {
            const selectedIndex = selectedOption.index; // Ändern Sie den Namen des Indexattributs entsprechend Ihrer Speicherstruktur
            clickButtonByClass("slds-button.slds-button_icon.slds-button_icon-border-filled"); // Rufen Sie die Funktion zum Klicken auf das Span-Element mit dem ausgewählten Index auf
            break;
          }
        }
      });
    }
  });
}


getDataFromIniFile("configurable_parameters", 'default_queue', function (value) {
  if (value !== null) {
    chrome.storage.sync.set({ 'default_queue': { text: value, index: 0 } }); // Speichere den ausgewählten Text und Index in der Storage#
    console.log(value);
  } else {
    console.error('Fehler beim Abrufen des Werts aus der INI-Datei - ' + "background.js - " + "main");
  }
});

// Periodisches Ausführen der Klickfunktion alle 10 Sekunden

getDataFromIniFile("configurable_parameters", 'refresh_time_in_minutes', function (value) {
  if (value !== null) {
    setInterval(clickSpanPeriodically, parseInt(parseFloat(value[0]) * 60000));
    setInterval(getTextFromSpanPeriodically, parseInt(parseFloat(value[0]) * 60000 - 250));
  } else {
    console.error('Fehler beim Abrufen des Werts aus der INI-Datei - ' + "background.js - " + "main");
    setInterval(clickSpanPeriodically, 120000);
    setInterval(getTextFromSpanPeriodically, 119900);
  }
});

// Funktion zum Klicken auf das definierte Span-Element basierend auf dem empfangenen Index
function clickButtonByClass(className) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      const tabId = tab.id;
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: (className) => {
          const button = document.querySelector(`button.${className}`);
          if (button) {
            button.click(); // Klicke auf den Button mit der angegebenen Klasse
          } else {
            console.error('No button found with the specified class.');
          }
        },
        args: [className]
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
          let value = keyValue[1].trim();

          // Check if value contains commas, then split and store as array
          if (value.includes(',')) {
            value = value.split(',').map(item => item.trim());
          } else {
            // If no commas, store value as an array with one element
            value = [value];
          }

          data[currentSection][key] = value;
        }
      });

      callback(data);
    })
    .catch(error => {
      console.error('Error reading INI file:', error);
    });
}



function getDataFromIniFile(section, key, callback) {
  processIniFile('config.ini', function (data) {
    if (data) {
      console.log('INI-Daten erfolgreich gelesen:');
      console.log(data[section][key]);
      callback(data[section][key]);
    } else {
      console.error('Fehler beim Lesen der INI-Datei - ' + "getDataFromIniFile");
    }
  });
}